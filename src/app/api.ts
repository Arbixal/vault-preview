export type JsonRecord = Record<string, unknown>;

export interface SeasonSnapshot {
  id: string;
  displayName: string;
  shortLabel: string;
  expansion: string;
  sourceSeasonId?: number;
  revision: string;
  revisionHash: string;
}

export interface AppConfigResponse {
  schemaVersion: 1;
  activeSeason: SeasonSnapshot;
}

export interface CharacterIdentity {
  region: string;
  realm: string;
  name: string;
  class?: string | null;
}

export interface ProgressPeriod {
  resetAt: string;
  asOf: string;
}

export interface VaultSection {
  id: string;
  title: string;
  subtitle?: string | null;
  kind: string;
  status: string;
  freshness: string;
  slots: VaultSlot[];
  additionalItems: ProgressItem[];
}

export interface VaultSlot {
  id: string;
  requirement: SlotRequirement;
  progress: SlotProgress;
  reward: Reward;
  items: ProgressItem[];
}

export interface SlotRequirement {
  unit: string;
  required: number;
  label: string;
}

export interface SlotProgress {
  completed: number | null;
  state: string;
}

export interface ProgressItem {
  id: string;
  label: string;
  state: string;
  itemLevel?: number | null;
  rarity?: string | null;
  progress?: ProgressData;
  tooltip?: Tooltip | null;
}

export interface ProgressData {
  value?: number | string | null;
  completed?: number | null;
  required?: number | null;
  dimensions: ProgressDimension[];
}

export interface ProgressDimension {
  id: string;
  label: string;
  state: string;
  value?: number | string | null;
  completed?: boolean | null;
}

export interface Tooltip {
  title: string;
  rows: TooltipRow[];
}

export interface TooltipRow {
  label: string;
  value?: string | null;
  state?: string | null;
  completed?: boolean | null;
}

export interface Reward {
  itemLevel: number | null;
  rarity: string | null;
}

export interface CharacterProgressResponse {
  schemaVersion: 1;
  character: CharacterIdentity;
  season: SeasonSnapshot;
  progressPeriod: ProgressPeriod;
  sections: VaultSection[];
}

export interface CharacterRequest {
  region: string;
  realm: string;
  name: string;
}

export interface ApiErrorResponse {
  schemaVersion: 1;
  error: {
    code: string;
    message: string;
    requestId?: string | null;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;

  constructor(message: string, status: number, code: string, requestId?: string | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId ?? undefined;
  }
}

export class ApiValidationError extends ApiError {
  readonly path: string;

  constructor(message: string, path = "response") {
    super(message, 0, "INVALID_RESPONSE");
    this.name = "ApiValidationError";
    this.path = path;
  }
}

const apiEndpoint = (process.env.NEXT_PUBLIC_API_ENDPOINT ?? "").replace(/\/+$/, "");

export const appConfigUrl = `${apiEndpoint}/v1/app-config`;

export function characterProgressUrl(character: CharacterRequest): string {
  const path = [character.region, character.realm, character.name]
    .map((value) => encodeURIComponent(value))
    .join("/");

  return `${apiEndpoint}/v1/vault-progress/${path}`;
}

export async function fetchAppConfig(): Promise<AppConfigResponse> {
  return fetchJson(appConfigUrl, parseAppConfigResponse);
}

export async function fetchCharacterProgress(character: CharacterRequest): Promise<CharacterProgressResponse> {
  return fetchJson(characterProgressUrl(character), parseCharacterProgressResponse);
}

export function parseAppConfigResponse(value: unknown): AppConfigResponse {
  const record = objectAt(value, "response");
  schemaVersion(record, "response");

  return {
    schemaVersion: 1,
    activeSeason: parseSeasonSnapshot(record.activeSeason, "response.activeSeason"),
  };
}

export function parseCharacterProgressResponse(value: unknown): CharacterProgressResponse {
  const record = objectAt(value, "response");
  schemaVersion(record, "response");

  return {
    schemaVersion: 1,
    character: parseCharacterIdentity(record.character, "response.character"),
    season: parseSeasonSnapshot(record.season, "response.season"),
    progressPeriod: parseProgressPeriod(record.progressPeriod, "response.progressPeriod"),
    sections: arrayAt(record.sections, "response.sections").map((section, index) =>
      parseVaultSection(section, `response.sections[${index}]`),
    ),
  };
}

export function errorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  switch (error.code) {
    case "CHARACTER_NOT_FOUND":
      return "Character data is not available.";
    case "ACTIVE_CONFIGURATION_UNAVAILABLE":
      return "The active season configuration is unavailable.";
    case "UPSTREAM_UNAVAILABLE":
      return "The upstream progress service is unavailable.";
    case "INVALID_RESPONSE":
      return "The progress service returned an invalid response.";
    default:
      return error.message || fallback;
  }
}

async function fetchJson<T>(url: string, parse: (value: unknown) => T): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError("The progress service could not be reached.", 0, "NETWORK_ERROR");
  }

  const payload = await readJson(response);
  if (!response.ok) {
    throw parseApiError(payload, response.status);
  }

  return parse(payload);
}

async function readJson(response: Response): Promise<unknown> {
  const body = await response.text();
  if (!body) {
    return undefined;
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    return undefined;
  }
}

function parseApiError(value: unknown, status: number): ApiError {
  if (isRecord(value) && value.schemaVersion === 1 && isRecord(value.error)) {
    const code = stringValue(value.error.code);
    const message = stringValue(value.error.message);
    const requestId = value.error.requestId;

    if (code && message && (requestId === undefined || requestId === null || typeof requestId === "string")) {
      return new ApiError(message, status, code, requestId);
    }
  }

  return new ApiError(`The progress service returned HTTP ${status}.`, status, `HTTP_${status}`);
}

function parseSeasonSnapshot(value: unknown, path: string): SeasonSnapshot {
  const record = objectAt(value, path);
  const revisionHash = requiredString(record.revisionHash, `${path}.revisionHash`);
  if (!/^sha256:[0-9a-f]{64}$/.test(revisionHash)) {
    invalid(`${path}.revisionHash`, "expected a sha256 hash");
  }

  return {
    id: requiredString(record.id, `${path}.id`),
    displayName: requiredString(record.displayName, `${path}.displayName`),
    shortLabel: requiredString(record.shortLabel, `${path}.shortLabel`),
    expansion: requiredString(record.expansion, `${path}.expansion`),
    sourceSeasonId: optionalInteger(record.sourceSeasonId, `${path}.sourceSeasonId`),
    revision: requiredString(record.revision, `${path}.revision`),
    revisionHash,
  };
}

function parseCharacterIdentity(value: unknown, path: string): CharacterIdentity {
  const record = objectAt(value, path);
  const classValue = record.class;

  if (classValue !== undefined && classValue !== null && typeof classValue !== "string") {
    invalid(`${path}.class`, "expected a string or null");
  }

  return {
    region: requiredString(record.region, `${path}.region`),
    realm: requiredString(record.realm, `${path}.realm`),
    name: requiredString(record.name, `${path}.name`),
    class: classValue as string | null | undefined,
  };
}

function parseProgressPeriod(value: unknown, path: string): ProgressPeriod {
  const record = objectAt(value, path);
  const resetAt = requiredString(record.resetAt, `${path}.resetAt`);
  const asOf = requiredString(record.asOf, `${path}.asOf`);

  if (Number.isNaN(Date.parse(resetAt))) {
    invalid(`${path}.resetAt`, "expected an ISO date-time");
  }
  if (Number.isNaN(Date.parse(asOf))) {
    invalid(`${path}.asOf`, "expected an ISO date-time");
  }

  return { resetAt, asOf };
}

function parseVaultSection(value: unknown, path: string): VaultSection {
  const record = objectAt(value, path);
  const subtitle = record.subtitle;

  if (subtitle !== undefined && subtitle !== null && typeof subtitle !== "string") {
    invalid(`${path}.subtitle`, "expected a string or null");
  }

  return {
    id: requiredString(record.id, `${path}.id`),
    title: requiredString(record.title, `${path}.title`),
    subtitle: subtitle as string | null | undefined,
    kind: requiredString(record.kind, `${path}.kind`),
    status: requiredString(record.status, `${path}.status`),
    freshness: requiredString(record.freshness, `${path}.freshness`),
    slots: arrayAt(record.slots, `${path}.slots`).map((slot, index) =>
      parseVaultSlot(slot, `${path}.slots[${index}]`),
    ),
    additionalItems: arrayAt(record.additionalItems, `${path}.additionalItems`).map((item, index) =>
      parseProgressItem(item, `${path}.additionalItems[${index}]`),
    ),
  };
}

function parseVaultSlot(value: unknown, path: string): VaultSlot {
  const record = objectAt(value, path);

  return {
    id: requiredString(record.id, `${path}.id`),
    requirement: parseSlotRequirement(record.requirement, `${path}.requirement`),
    progress: parseSlotProgress(record.progress, `${path}.progress`),
    reward: parseReward(record.reward, `${path}.reward`),
    items: arrayAt(record.items, `${path}.items`).map((item, index) =>
      parseProgressItem(item, `${path}.items[${index}]`),
    ),
  };
}

function parseSlotRequirement(value: unknown, path: string): SlotRequirement {
  const record = objectAt(value, path);

  return {
    unit: requiredString(record.unit, `${path}.unit`),
    required: requiredInteger(record.required, `${path}.required`),
    label: requiredString(record.label, `${path}.label`),
  };
}

function parseSlotProgress(value: unknown, path: string): SlotProgress {
  const record = objectAt(value, path);

  return {
    completed: nullableInteger(record.completed, `${path}.completed`),
    state: requiredString(record.state, `${path}.state`),
  };
}

function parseReward(value: unknown, path: string): Reward {
  const record = objectAt(value, path);
  const rarity = record.rarity;

  if (rarity !== null && typeof rarity !== "string") {
    invalid(`${path}.rarity`, "expected a string or null");
  }

  return {
    itemLevel: nullableInteger(record.itemLevel, `${path}.itemLevel`),
    rarity: rarity as string | null,
  };
}

function parseProgressItem(value: unknown, path: string): ProgressItem {
  const record = objectAt(value, path);
  const itemLevel = record.itemLevel;
  const rarity = record.rarity;

  if (itemLevel !== undefined && itemLevel !== null && (!Number.isInteger(itemLevel) || (itemLevel as number) < 0)) {
    invalid(`${path}.itemLevel`, "expected a non-negative integer or null");
  }
  if (rarity !== undefined && rarity !== null && typeof rarity !== "string") {
    invalid(`${path}.rarity`, "expected a string or null");
  }

  return {
    id: requiredString(record.id, `${path}.id`),
    label: requiredString(record.label, `${path}.label`),
    state: requiredString(record.state, `${path}.state`),
    itemLevel: itemLevel as number | null | undefined,
    rarity: rarity as string | null | undefined,
    progress: record.progress === undefined ? undefined : parseProgressData(record.progress, `${path}.progress`),
    tooltip: record.tooltip === undefined || record.tooltip === null
      ? record.tooltip as null | undefined
      : parseTooltip(record.tooltip, `${path}.tooltip`),
  };
}

function parseProgressData(value: unknown, path: string): ProgressData {
  const record = objectAt(value, path);

  return {
    value: scalarValue(record.value, `${path}.value`),
    completed: optionalNullableInteger(record.completed, `${path}.completed`),
    required: optionalNullableInteger(record.required, `${path}.required`),
    dimensions: record.dimensions === undefined
      ? []
      : arrayAt(record.dimensions, `${path}.dimensions`).map((dimension, index) =>
        parseProgressDimension(dimension, `${path}.dimensions[${index}]`),
      ),
  };
}

function parseProgressDimension(value: unknown, path: string): ProgressDimension {
  const record = objectAt(value, path);
  const completed = record.completed;

  if (completed !== undefined && completed !== null && typeof completed !== "boolean") {
    invalid(`${path}.completed`, "expected a boolean or null");
  }

  return {
    id: requiredString(record.id, `${path}.id`),
    label: requiredString(record.label, `${path}.label`),
    state: requiredString(record.state, `${path}.state`),
    value: scalarValue(record.value, `${path}.value`),
    completed: completed as boolean | null | undefined,
  };
}

function parseTooltip(value: unknown, path: string): Tooltip {
  const record = objectAt(value, path);

  return {
    title: requiredString(record.title, `${path}.title`),
    rows: arrayAt(record.rows, `${path}.rows`).map((row, index) =>
      parseTooltipRow(row, `${path}.rows[${index}]`),
    ),
  };
}

function parseTooltipRow(value: unknown, path: string): TooltipRow {
  const record = objectAt(value, path);
  const valueField = record.value;
  const state = record.state;
  const completed = record.completed;

  if (valueField !== undefined && valueField !== null && typeof valueField !== "string") {
    invalid(`${path}.value`, "expected a string or null");
  }
  if (state !== undefined && state !== null && typeof state !== "string") {
    invalid(`${path}.state`, "expected a string or null");
  }
  if (completed !== undefined && completed !== null && typeof completed !== "boolean") {
    invalid(`${path}.completed`, "expected a boolean or null");
  }

  return {
    label: requiredString(record.label, `${path}.label`),
    value: valueField as string | null | undefined,
    state: state as string | null | undefined,
    completed: completed as boolean | null | undefined,
  };
}

function objectAt(value: unknown, path: string): JsonRecord {
  if (!isRecord(value)) {
    invalid(path, "expected an object");
  }

  return value;
}

function arrayAt(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    invalid(path, "expected an array");
  }

  return value;
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    invalid(path, "expected a non-empty string");
  }

  return value;
}

function requiredInteger(value: unknown, path: string): number {
  if (!Number.isInteger(value) || (value as number) < 0) {
    invalid(path, "expected a non-negative integer");
  }

  return value as number;
}

function optionalInteger(value: unknown, path: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  return requiredInteger(value, path);
}

function nullableInteger(value: unknown, path: string): number | null {
  if (value === null) {
    return null;
  }
  return requiredInteger(value, path);
}

function optionalNullableInteger(value: unknown, path: string): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  return nullableInteger(value, path);
}

function scalarValue(value: unknown, path: string): number | string | null | undefined {
  if (value === undefined || value === null || typeof value === "string") {
    return value as string | null | undefined;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  invalid(path, "expected a number, string, null, or omitted value");
}

function schemaVersion(record: JsonRecord, path: string): void {
  if (record.schemaVersion !== 1) {
    invalid(`${path}.schemaVersion`, "expected schema version 1");
  }
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalid(path: string, reason: string): never {
  throw new ApiValidationError(`${path}: ${reason}`, path);
}
