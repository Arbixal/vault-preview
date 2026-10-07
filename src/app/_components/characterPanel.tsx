import useSWR from "swr";
import MythicPlusPanel, { DungeonData } from "./mythicPlusPanel";
import RaidPanel, { RaidData } from "./raidPanel";
import MessagePanel from "./messagePanel";
import DelvePanel, { DelveData } from "./delvePanel";
import {
    characterProgressUrl,
    errorMessage,
    fetchCharacterProgress,
    type CharacterProgressResponse,
    type VaultSection,
} from "../api";
import { toLegacyCharacterData } from "../legacyProgressAdapter";

interface ICharacterPanelProps {
    character: Character;
    onRemove?: () => void;
}

export interface Character {
    region: string;
    name: string;
    realm: string;
}

export interface CharacterData {
    raid: RaidData;
    dungeons: DungeonData;
    delves: DelveData;
}

export default function CharacterPanel({character, onRemove} : ICharacterPanelProps)
{
  const dataUrl = characterProgressUrl(character);
  const {data, error, isLoading, isValidating, mutate} = useSWR<CharacterProgressResponse>(
    dataUrl,
    () => fetchCharacterProgress(character),
  );

  const characterData = data ? toLegacyCharacterData(data) : undefined;
  const displayedName = data?.character.name ?? character.name;
  const displayedRegion = data?.character.region ?? character.region;
  const displayedRealm = data?.character.realm ?? character.realm;

  const classColour = safeClassColour(data?.character.class);
  const sectionAccent = `border-${classColour}/50`;

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-sans shadow-xl shadow-black/20">
          <header className="flex items-start justify-between gap-4 border-b border-neutral-800/80 px-4 py-3 sm:px-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className={`mt-2 size-2 shrink-0 rounded-full border-2 border-${classColour}`} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-neutral-100">{displayedName}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span className={`text-${classColour}`}>{displayedRegion.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{displayedRealm}</span>
                  {data?.season && <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">{data.season.shortLabel}</span>}
                </div>
                {data?.season && <div className="mt-2 max-w-full text-[11px] text-neutral-600" data-testid="season-snapshot">
                  <div>{data.season.displayName} · revision {data.season.revision}</div>
                  <div className="break-all" title={data.season.revisionHash}>hash {data.season.revisionHash}</div>
                </div>}
              </div>
            </div>
            {onRemove && <button className="grid size-8 shrink-0 place-items-center rounded-lg border border-neutral-800 text-neutral-500 transition hover:border-red-400/60 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-neutral-500" type="button" aria-label={`Remove ${displayedName} ${displayedRealm} ${displayedRegion.toUpperCase()}`} onClick={onRemove}>
              <span aria-hidden="true">×</span>
            </button>}
          </header>

          <div className="space-y-3 p-3 sm:p-4">
            {error ? <MessagePanel isRetrying={isValidating} message={errorMessage(error, "Unable to load data for this character. Try again in a moment.")} onRetry={() => { void mutate(); }} /> : <>
              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Raids</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <SectionStatus section={findSection(data, "raid")} />
                <RaidPanel data={characterData?.raid ?? {}} season={data?.season.sourceSeasonId} loading={isLoading} />
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Mythic+</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <SectionStatus section={findSection(data, "mythic-plus")} />
                <MythicPlusPanel data={characterData?.dungeons ?? []} season={data?.season.sourceSeasonId} loading={isLoading} />
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Delves</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <SectionStatus section={findSection(data, "delves")} />
                <DelvePanel data={characterData?.delves ?? {}} season={data?.season.sourceSeasonId} loading={isLoading} />
              </section>
              {data?.progressPeriod && <p className="text-[11px] text-neutral-600" data-testid="progress-period">
                Reset {data.progressPeriod.resetAt} · As of {data.progressPeriod.asOf}
              </p>}
            </>}
          </div>
        </article>
    )
}

function findSection(response: CharacterProgressResponse | undefined, kind: string): VaultSection | undefined {
  return response?.sections.find((section) => section.kind.toLowerCase() === kind);
}

function SectionStatus({section}: {section: VaultSection | undefined}) {
  if (!section) {
    return null;
  }

  const stale = section.freshness.toLowerCase() === "stale";
  const unavailable = section.status.toLowerCase() === "unavailable";
  if (!stale && !unavailable) {
    return null;
  }

  const message = unavailable
    ? section.subtitle ?? `${section.title} data is unavailable.`
    : `${section.title} is using stale data.`;

  return <p className="mb-2 rounded-md border border-amber-900/60 bg-amber-950/20 px-2.5 py-2 text-xs text-amber-200" role="status">{message}</p>;
}

function safeClassColour(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase();
  return normalized && /^[a-z]+$/.test(normalized) ? normalized : "poor";
}
