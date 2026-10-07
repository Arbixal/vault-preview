import type { ReactNode } from "react";
import Tooltip from "./tooltip";
import type {
  ProgressDimension,
  ProgressItem,
  Tooltip as ApiTooltip,
  TooltipRow,
  VaultSection,
  VaultSlot,
} from "../api";

interface VaultSectionPanelProps {
  section: VaultSection;
  accentClass?: string;
}

const RARITY_STYLES: Record<string, { border: string; text: string }> = {
  poor: { border: "border-neutral-700", text: "text-neutral-400" },
  common: { border: "border-neutral-600", text: "text-neutral-200" },
  uncommon: { border: "border-emerald-500/70", text: "text-emerald-400" },
  rare: { border: "border-sky-500/70", text: "text-sky-400" },
  epic: { border: "border-fuchsia-500/70", text: "text-fuchsia-400" },
  legendary: { border: "border-orange-500/70", text: "text-orange-400" },
};

const STATE_STYLES: Record<string, string> = {
  complete: "border-emerald-800/80 bg-emerald-950/20",
  incomplete: "border-neutral-800 bg-neutral-950/70",
  unavailable: "border-amber-800/80 bg-amber-950/20",
  unsupported: "border-violet-800/80 bg-violet-950/20",
  unknown: "border-neutral-700 bg-neutral-900/70",
};

export default function VaultSectionPanel({accentClass = "border-neutral-600", section}: VaultSectionPanelProps) {
  const status = section.status.toLowerCase();
  const freshness = section.freshness.toLowerCase();
  const statusIsKnown = status === "available" || status === "empty" || status === "unavailable" || status === "unsupported";
  const showSubtitle = Boolean(section.subtitle) && status !== "unavailable";
  const sectionKind = section.kind.toLowerCase();
  const isRaid = sectionKind === "raid";
  const isMythicPlus = sectionKind === "mythic-plus";
  const hasCompactContributions = isRaid || isMythicPlus;
  const contributionItems = hasCompactContributions ? sectionItems(section) : [];

  return (
    <section className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-3" data-testid={`vault-section-${section.id}`}>
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800/80 pb-2">
        <div>
          <h3 className={`border-l-2 ${accentClass} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>{section.title}</h3>
          {showSubtitle && <p className="mt-1 pl-2 text-xs text-neutral-600">{section.subtitle}</p>}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 text-[10px] uppercase tracking-[0.08em]">
          <span className={`rounded-full border px-2 py-1 ${statusIsKnown ? "border-neutral-800 text-neutral-600" : "border-violet-800/70 text-violet-300"}`}>
            {humanize(section.status)}
          </span>
          {freshness !== "fresh" && <span className={`rounded-full border px-2 py-1 ${freshness === "stale" ? "border-amber-800/70 text-amber-300" : "border-neutral-800 text-neutral-600"}`}>
            {humanize(section.freshness)}
          </span>}
        </div>
      </header>

      <SectionNotice section={section} />

      {section.slots.length > 0 ? (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {section.slots.map((slot) => <VaultSlotCard key={slot.id} showItems={!hasCompactContributions} slot={slot} />)}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-neutral-800 px-3 py-5 text-center text-sm text-neutral-600">No vault slots are available.</p>
      )}

      {hasCompactContributions ? <ContributionSummary kind={isRaid ? "bosses" : "runs"} items={contributionItems} /> : section.additionalItems.length > 0 && <div className="mt-3 border-t border-neutral-800/80 pt-3">
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-600">Additional progress</h4>
        <ProgressItemList items={section.additionalItems} />
      </div>}
    </section>
  );
}

function SectionNotice({section}: VaultSectionPanelProps) {
  const status = section.status.toLowerCase();
  const freshness = section.freshness.toLowerCase();
  if (status !== "unavailable" && freshness !== "stale") {
    return null;
  }

  const message = status === "unavailable"
    ? section.subtitle ?? `${section.title} data is unavailable.`
    : `${section.title} is using stale data.`;

  return <p className="mb-3 rounded-md border border-amber-900/60 bg-amber-950/20 px-2.5 py-2 text-xs text-amber-200" role="status">{message}</p>;
}

function VaultSlotCard({showItems, slot}: {showItems: boolean; slot: VaultSlot}) {
  const completed = slot.progress.completed;
  const completedForSlot = completed === null ? null : Math.min(Math.max(completed, 0), slot.requirement.required);
  const progressLabel = completed === null
    ? humanize(slot.progress.state)
    : `${completedForSlot} / ${slot.requirement.required} ${progressUnit(slot.requirement.unit, completedForSlot)}`;
  const progressAriaLabel = completed === null
    ? `Progress ${progressLabel}`
    : `${progressLabel} contribute to the ${slot.requirement.label} reward`;

  return (
    <article className="min-w-0 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3" data-testid={`vault-slot-${slot.id}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-neutral-200">{slot.requirement.label}</h4>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-neutral-600">{slot.requirement.unit}</p>
        </div>
        <span className="rounded-full border border-neutral-800 px-2 py-1 text-xs text-neutral-500" aria-label={progressAriaLabel} data-testid={`vault-slot-progress-${slot.id}`}>{progressLabel}</span>
      </header>

      <RewardDisplay reward={slot.reward} requirement={slot.requirement.label} />

      {showItems && slot.items.length > 0 ? (
        <ProgressItemList items={slot.items} />
      ) : showItems && (
        <p className="mt-3 text-xs text-neutral-600">No qualifying progress items.</p>
      )}
    </article>
  );
}

function ContributionSummary({kind, items}: {kind: "bosses" | "runs"; items: ProgressItem[]}) {
  const isRaid = kind === "bosses";
  const testId = isRaid ? "raid-progress" : "mythic-plus-progress";

  return (
    <div className="mt-3 border-t border-neutral-800/80 pt-3" data-testid={testId}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-600">Contributing {kind}</h4>
        {items.length > 0 && <span className="text-[10px] uppercase tracking-[0.08em] text-neutral-700">{items.length} total</span>}
      </div>
      {items.length > 0 ? <ProgressItemList compact items={items} /> : <p className="text-xs text-neutral-600">No contributing {kind} are available.</p>}
    </div>
  );
}

function RewardDisplay({reward, requirement}: {reward: VaultSlot["reward"]; requirement: string}) {
  const style = rarityStyle(reward.rarity);
  const hasReward = reward.itemLevel !== null;
  const rarityLabel = reward.rarity ? humanize(reward.rarity) : "No reward";
  const label = hasReward
    ? `${requirement} reward item level ${reward.itemLevel}, ${rarityLabel}`
    : `${requirement}: no qualifying reward`;

  return (
    <div className={`mt-3 flex min-h-14 items-center justify-between gap-3 rounded-lg border bg-neutral-950/90 px-3 py-2 ${style.border} ${style.text}`} aria-label={label} data-rarity={reward.rarity ?? "none"}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-600">Reward</span>
      <span className="text-right">
        <strong className="block text-lg font-bold leading-none">{hasReward ? reward.itemLevel : "No reward"}</strong>
        <small className="mt-1 block text-[11px] uppercase tracking-[0.08em]">{rarityLabel}</small>
      </span>
    </div>
  );
}

function ProgressItemList({compact = false, items}: {compact?: boolean; items: ProgressItem[]}) {
  return (
    <div className={compact ? "mt-2 flex min-w-0 flex-wrap gap-1.5" : "mt-3 grid min-w-0 gap-2"} role="list">
      {items.map((item) => <ProgressItemView compact={compact} item={item} key={item.id} />)}
    </div>
  );
}

function ProgressItemView({compact, item}: {compact: boolean; item: ProgressItem}) {
  const style = compact ? contributionStyle(item) : stateStyle(item.state);
  const dimensions = uniqueDimensions(item.progress?.dimensions ?? []);
  const tooltip = itemTooltip(item, dimensions);
  const itemRarity = item.rarity ? ` · ${humanize(item.rarity)}` : "";
  const displayLabel = compact ? compactLabel(item) : item.label;

  return (
    <Tooltip message={tooltip ? <StructuredTooltip tooltip={tooltip} /> : null} role="listitem">
      <div className={`min-w-0 rounded-md border ${compact ? "flex h-6 min-w-7 items-center justify-center px-1.5" : "px-2.5 py-2"} ${style}`} aria-label={`${item.label}, ${humanize(item.state)}${itemRarity}`} data-item-id={item.id}>
        <div className="flex min-w-0 items-start justify-between gap-2">
          <span className={`${compact ? "text-[10px] font-semibold" : "min-w-0 truncate text-sm"} text-neutral-200`} title={item.label}>{displayLabel}</span>
          {!compact && <span className="shrink-0 text-[10px] uppercase tracking-[0.08em] text-neutral-500">{humanize(item.state)}</span>}
        </div>
        {!compact && (item.itemLevel !== undefined && item.itemLevel !== null || item.rarity) && <div className="mt-1 text-[11px] text-neutral-500">
          {item.itemLevel !== undefined && item.itemLevel !== null && <span>Item level {item.itemLevel}</span>}
          {item.itemLevel !== undefined && item.itemLevel !== null && item.rarity && <span> · </span>}
          {item.rarity && <span>{humanize(item.rarity)}</span>}
        </div>}
        {!compact && dimensions.length > 0 && <DimensionList dimensions={dimensions} />}
      </div>
    </Tooltip>
  );
}

function sectionItems(section: VaultSection): ProgressItem[] {
  const items = section.slots.flatMap((slot) => slot.items).concat(section.additionalItems);
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function uniqueDimensions(dimensions: ProgressDimension[]): ProgressDimension[] {
  const unique = new Map<string, ProgressDimension>();
  for (const dimension of dimensions) {
    const key = dimension.id.toLowerCase();
    const previous = unique.get(key);
    if (!previous || isComplete(dimension) && !isComplete(previous)) {
      unique.set(key, dimension);
    }
  }
  return [...unique.values()];
}

function isComplete(dimension: ProgressDimension): boolean {
  return dimension.completed === true || dimension.state.toLowerCase() === "complete";
}

function compactLabel(item: ProgressItem): string {
  if (item.id.startsWith("raiderio:run:") && typeof item.progress?.value === "number") {
    return `+${item.progress.value}`;
  }

  const words = item.label
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/gi, ""))
    .filter((word) => word.length > 0 && !["a", "an", "and", "of", "the"].includes(word.toLowerCase()));

  if (words.length === 0) {
    return item.label.slice(0, 3).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }
  return words.map((word) => word[0]).join("").toUpperCase();
}

function itemTooltip(item: ProgressItem, dimensions: ProgressDimension[]): ApiTooltip | null {
  if (item.tooltip?.rows.length) {
    return item.tooltip;
  }
  if (dimensions.length > 0) {
    const generated = dimensionsTooltip(item.label, dimensions);
    return item.tooltip ? { ...item.tooltip, rows: generated.rows } : generated;
  }
  return item.tooltip ?? null;
}

function DimensionList({dimensions}: {dimensions: ProgressDimension[]}) {
  return (
    <ul className="mt-2 grid gap-1 border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-500" aria-label="Progress details">
      {dimensions.map((dimension, index) => <li className="flex items-center justify-between gap-2" key={`${dimension.id}-${index}`}>
        <span>{dimension.label}</span>
        <span>{dimension.completed === true || dimension.state.toLowerCase() === "complete" ? "Complete" : humanize(dimension.state)}</span>
      </li>)}
    </ul>
  );
}

function StructuredTooltip({tooltip}: {tooltip: ApiTooltip}) {
  return (
    <div className="flex min-w-48 flex-col gap-1">
      <h4 className="mb-1 font-bold">{tooltip.title}</h4>
      {tooltip.rows.map((row, index) => <TooltipRowView key={`${row.label}-${index}`} row={row} />)}
    </div>
  );
}

function TooltipRowView({row}: {row: TooltipRow}) {
  const value = row.value ?? (row.completed === true ? "Complete" : row.completed === false ? "Incomplete" : row.state ? humanize(row.state) : null);

  return <div className="flex gap-3 text-xs"><span className="text-neutral-400">{row.label}</span><span className="text-neutral-200">{value ?? "-"}</span></div>;
}

function dimensionsTooltip(label: string, dimensions: ProgressDimension[]): ApiTooltip {
  return {
    title: label,
    rows: dimensions.map((dimension) => ({
      label: dimension.label,
      state: dimension.state,
      completed: dimension.completed,
    })),
  };
}

function rarityStyle(rarity: string | null): { border: string; text: string } {
  return RARITY_STYLES[rarity?.toLowerCase() ?? ""] ?? RARITY_STYLES.poor;
}

function stateStyle(state: string): string {
  return STATE_STYLES[state.toLowerCase()] ?? STATE_STYLES.unknown;
}

function contributionStyle(item: ProgressItem): string {
  const rarity = item.rarity?.toLowerCase();
  const style = rarity ? RARITY_STYLES[rarity] : undefined;
  return style ? `${style.border} bg-neutral-950/70 ${style.text}` : stateStyle(item.state);
}

function humanize(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function progressUnit(unit: string, count: number | null): string {
  const normalized = unit.toLowerCase();
  return count === 1 && normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;
}
