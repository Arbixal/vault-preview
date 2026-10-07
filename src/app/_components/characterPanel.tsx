import useSWR from "swr";
import MessagePanel from "./messagePanel";
import VaultSectionPanel from "./vaultSectionPanel";
import {
    characterProgressUrl,
    errorMessage,
    fetchCharacterProgress,
    type CharacterProgressResponse,
} from "../api";

interface ICharacterPanelProps {
    character: Character;
    onRemove?: () => void;
}

export interface Character {
    region: string;
    name: string;
    realm: string;
}

export default function CharacterPanel({character, onRemove} : ICharacterPanelProps)
{
  const dataUrl = characterProgressUrl(character);
  const {data, error, isValidating, mutate} = useSWR<CharacterProgressResponse>(
    dataUrl,
    () => fetchCharacterProgress(character),
  );

  const displayedName = data?.character.name ?? character.name;
  const displayedRegion = data?.character.region ?? character.region;
  const displayedRealm = data?.character.realm ?? character.realm;

  const classColour = safeClassColour(data?.character.class);
  const sectionAccent = `border-${classColour}/50`;

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-sans shadow-xl shadow-black/20" data-testid="character-card">
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
              </div>
            </div>
            {onRemove && <button className="grid size-8 shrink-0 place-items-center rounded-lg border border-neutral-800 text-neutral-500 transition hover:border-red-400/60 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-neutral-500" type="button" aria-label={`Remove ${displayedName} ${displayedRealm} ${displayedRegion.toUpperCase()}`} onClick={onRemove}>
              <span aria-hidden="true">×</span>
            </button>}
          </header>

          <div className="space-y-3 p-3 sm:p-4">
            {error ? <MessagePanel isRetrying={isValidating} message={errorMessage(error, "Unable to load data for this character. Try again in a moment.")} onRetry={() => { void mutate(); }} /> : data ? <>
              {data.sections.length > 0
                ? data.sections.map((section, index) => <VaultSectionPanel accentClass={sectionAccent} key={`${section.id}-${index}`} section={section} />)
                : <p className="rounded-lg border border-dashed border-neutral-800 px-3 py-5 text-center text-sm text-neutral-600">No progress sections are available.</p>}
              {data.progressPeriod && <p className="text-[11px] text-neutral-600" data-testid="progress-period">
                Reset {data.progressPeriod.resetAt} · As of {data.progressPeriod.asOf}
              </p>}
            </> : <LoadingProgress />}
          </div>
        </article>
    )
}

function LoadingProgress() {
  return <p className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-5 text-center text-sm text-neutral-500" role="status">Loading Vault progress...</p>;
}

function safeClassColour(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase();
  return normalized && /^[a-z]+$/.test(normalized) ? normalized : "poor";
}
