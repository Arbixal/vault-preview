import useSWR from "swr";
import MythicPlusPanel, { DungeonData } from "./mythicPlusPanel";
import RaidPanel, { RaidData } from "./raidPanel";
import MessagePanel from "./messagePanel";
import DelvePanel, { DelveData } from "./delvePanel";

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
  const dataUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/vault-progress/${character.region}/${character.realm}/${character.name}`;
  const {data, error, isLoading, isValidating, mutate} = useSWR(dataUrl, (url) => fetch(url).then((res) => {
    if (!res.ok)
      throw new Error(`Unable to load character data: ${res.status}`);

    return res.json();
  }));
 
  const characterData = data?.[`${character.name}-${character.realm}`]

  const classColour = characterData?.player_class ?? "poor";
  const sectionAccent = `border-${classColour}/50`;

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-sans shadow-xl shadow-black/20">
          <header className="flex items-start justify-between gap-4 border-b border-neutral-800/80 px-4 py-3 sm:px-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className={`mt-2 size-2 shrink-0 rounded-full border-2 border-${classColour}`} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-neutral-100">{character.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span className={`text-${classColour}`}>{character.region.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{character.realm}</span>
                  {characterData?.season && <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">Season {characterData.season}</span>}
                </div>
              </div>
            </div>
            {onRemove && <button className="grid size-8 shrink-0 place-items-center rounded-lg border border-neutral-800 text-neutral-500 transition hover:border-red-400/60 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-neutral-500" type="button" aria-label={`Remove ${character.name} ${character.realm} ${character.region.toUpperCase()}`} onClick={onRemove}>
              <span aria-hidden="true">×</span>
            </button>}
          </header>

          <div className="space-y-3 p-3 sm:p-4">
            {error ? <MessagePanel isRetrying={isValidating} message={"Unable to load data for this character. Try again in a moment."} onRetry={() => { void mutate(); }} /> : <>
              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Raids</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <RaidPanel data={characterData?.raid} season={characterData?.season} loading={isLoading} />
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Mythic+</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <MythicPlusPanel data={characterData?.dungeons} season={characterData?.season} loading={isLoading} />
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <h3 className={`border-l-2 ${sectionAccent} pl-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300`}>Delves</h3>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-600">Vault tiers</span>
                </div>
                <DelvePanel data={characterData?.delves} season={characterData?.season} loading={isLoading} />
              </section>
            </>}
          </div>
        </article>
    )
}
