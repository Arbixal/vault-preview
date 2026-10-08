import { readFileSync } from "node:fs";
import path from "node:path";

export interface ContractFixture {
  name: string;
  path: string;
  responseType: "AppConfigResponse" | "CharacterProgressResponse" | "LegacyProgressResponse";
  purpose: string;
}

export interface ContractManifest {
  schemaVersion: number;
  contract: string;
  fixtures: ContractFixture[];
}

const fixturesDirectory = path.resolve(process.cwd(), "test/fixtures/vault-preview-v1");

export const contractManifest = readJson<ContractManifest>(path.join(fixturesDirectory, "manifest.json"));

export function readContractFixture(name: string): unknown {
  const fixture = contractManifest.fixtures.find((entry) => entry.name === name);
  if (!fixture) {
    throw new Error(`Contract fixture not found: ${name}`);
  }

  return readJson<unknown>(path.join(fixturesDirectory, fixture.path));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}
