import { ReactNode } from "react";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultSlot from "./vaultSlot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { BossData, bossDataToILevel } from "../seasonData";

interface RaidPanelProps {
    data: RaidData;
    season: number | undefined;
    loading: boolean;
}

export type RaidData = { [key: string]: BossData }
interface IBossEncounter {
    label: string;
    ilvl: number;
    tooltip: ReactNode;
}

function getBossTooltip(bossName: string, data: BossData): ReactNode
{
    return (<div className="flex flex-col h-fit">
        <h1 className="font-bold mb-2">{bossName}</h1>
        <div className="flex text-uncommon"><span className="text-left flex-auto">LFR</span> {data?.lfr == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-rare"><span className="text-left flex-auto">Normal</span> {data?.normal == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-epic"><span className="text-left flex-auto">Heroic</span> {data?.heroic == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-legendary"><span className="text-left flex-auto">Mythic</span> {data?.mythic == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
    </div>)
}

export default function RaidPanel({ data, season, loading }: RaidPanelProps) {

    var bosses: IBossEncounter[] = [];

    if (season == 14)
    {
        bosses.push({ label: 'V', ilvl: bossDataToILevel(data?.['vexie-and-the-geargrinders'], season), tooltip: getBossTooltip("Vexie and the Geargrinders", data?.['vexie-and-the-geargrinders'])});
        bosses.push({ label: 'CoC', ilvl: bossDataToILevel(data?.['cauldron-of-carnage'], season), tooltip: getBossTooltip("Cauldron of Carnage", data?.['cauldron-of-carnage'])});
        bosses.push({ label: 'R', ilvl: bossDataToILevel(data?.['rik-reverb'], season), tooltip: getBossTooltip("Rik Reverb", data?.['rik-reverb'])});
        bosses.push({ label: 'SB', ilvl: bossDataToILevel(data?.['stix-bunkjunker'], season), tooltip: getBossTooltip("Stix Bunkjunker", data?.['stix-bunkjunker'])});
        bosses.push({ label: 'SL', ilvl: bossDataToILevel(data?.['sprocketmonger-lockenstock'], season), tooltip: getBossTooltip("Sprocketmonger Lockenstock", data?.['sprocketmonger-lockenstock'])});
        bosses.push({ label: 'OAB', ilvl: bossDataToILevel(data?.['the-one-armed-bandit'], season), tooltip: getBossTooltip("The One-Armed Bandit", data?.['the-one-armed-bandit'])});
        bosses.push({ label: 'M', ilvl: bossDataToILevel(data?.['mug\'zee'], season), tooltip: getBossTooltip("Mug'zee", data?.['mug\'zee'])});
        bosses.push({ label: 'G', ilvl: bossDataToILevel(data?.['chrome-king-gallywix'], season), tooltip: getBossTooltip("Gallywix", data?.['chrome-king-gallywix'])});
    }

    if (season == 13)
    {
        bosses.push({ label: 'U', ilvl: bossDataToILevel(data?.['ulgrax-the-devourer'], season), tooltip: getBossTooltip("Ulgrax", data?.['ulgrax-the-devourer'])});
        bosses.push({ label: 'BH', ilvl: bossDataToILevel(data?.['the-bloodbound-horror'], season), tooltip: getBossTooltip("Bloodbound Horror", data?.['the-bloodbound-horror'])});
        bosses.push({ label: 'S', ilvl: bossDataToILevel(data?.['sikran'], season), tooltip: getBossTooltip("Sikran", data?.['sikran'])});
        bosses.push({ label: 'R', ilvl: bossDataToILevel(data?.['rashanan'], season), tooltip: getBossTooltip("Rasha'nan", data?.['rashanan'])});
        bosses.push({ label: 'BO', ilvl: bossDataToILevel(data?.['broodtwister-ovinax'], season), tooltip: getBossTooltip("Broodtwister Ovi'nax", data?.['broodtwister-ovinax'])});
        bosses.push({ label: 'K', ilvl: bossDataToILevel(data?.['nexus-princess-kyveza'], season), tooltip: getBossTooltip("Nexus-Princess Ky'veza", data?.['nexus-princess-kyveza'])});
        bosses.push({ label: 'SC', ilvl: bossDataToILevel(data?.['the-silken-court'], season), tooltip: getBossTooltip("Silken Court", data?.['the-silken-court'])});
        bosses.push({ label: 'A', ilvl: bossDataToILevel(data?.['queen-ansurek'], season), tooltip: getBossTooltip("Queen Ansurek", data?.['queen-ansurek'])});
    }

    if (season == 11 || season == 12)
    {
        bosses.push({ label: 'G', ilvl: bossDataToILevel(data?.['gnarlroot'], season), tooltip: getBossTooltip("Gnarlroot", data?.['gnarlroot'])});
        bosses.push({ label: 'I', ilvl: bossDataToILevel(data?.['igira-the-cruel'], season), tooltip: getBossTooltip("Igira the Cruel", data?.['igira-the-cruel'])});
        bosses.push({ label: 'V', ilvl: bossDataToILevel(data?.['volcoross'], season), tooltip: getBossTooltip("Volcoross", data?.['volcoross'])});
        bosses.push({ label: 'L', ilvl: bossDataToILevel(data?.['larodar'], season), tooltip: getBossTooltip("Larodar, Keeper of the Flame", data?.['larodar'])});
        bosses.push({ label: 'CoD', ilvl: bossDataToILevel(data?.['council-of-dreams'], season), tooltip: getBossTooltip("Council of Dreams", data?.['council-of-dreams'])});
        bosses.push({ label: 'N', ilvl: bossDataToILevel(data?.['nymue'], season), tooltip: getBossTooltip("Nymue, Weaver of the Cycle", data?.['nymue'])});
        bosses.push({ label: 'S', ilvl: bossDataToILevel(data?.['smolderon'], season), tooltip: getBossTooltip("Smolderon", data?.['smolderon'])});
        bosses.push({ label: 'TS', ilvl: bossDataToILevel(data?.['tindral-sageswift'], season), tooltip: getBossTooltip("Tindral Sageswift", data?.['tindral-sageswift'])});
        bosses.push({ label: 'F', ilvl: bossDataToILevel(data?.['fyrakk-the-blazing'], season), tooltip: getBossTooltip("Fyrakk the Blazing", data?.['fyrakk-the-blazing'])});
    }

    if (season == 9 || season == 12)
    {
        bosses.push({ label: 'E', ilvl: bossDataToILevel(data?.['eranog'], season), tooltip: getBossTooltip("Eranog", data?.['eranog'])});
        bosses.push({ label: 'T', ilvl: bossDataToILevel(data?.['terros'], season), tooltip: getBossTooltip("Terros", data?.['terros'])});
        bosses.push({ label: 'PC', ilvl: bossDataToILevel(data?.['the-primal-council'], season), tooltip: getBossTooltip("The Primal Council", data?.['the-primal-council'])});
        bosses.push({ label: 'SCB', ilvl: bossDataToILevel(data?.['sennarth'], season), tooltip: getBossTooltip("Sennarth, the Cold Breath", data?.['sennarth'])});
        bosses.push({ label: 'D', ilvl: bossDataToILevel(data?.['dathea'], season), tooltip: getBossTooltip("Dathea, Ascended", data?.['dathea'])});
        bosses.push({ label: 'KG', ilvl: bossDataToILevel(data?.['kurog-grimtotem'], season), tooltip: getBossTooltip("Kurog Grimtotem", data?.['kurog-grimtotem'])});
        bosses.push({ label: 'BD', ilvl: bossDataToILevel(data?.['broodkeeper-diurna'], season), tooltip: getBossTooltip("Broodkeeper Diurna", data?.['broodkeeper-diurna'])});
        bosses.push({ label: 'R', ilvl: bossDataToILevel(data?.['raszageth-the-storm-eater'], season), tooltip: getBossTooltip("Raszageth the Storm Eater", data?.['raszageth-the-storm-eater'])});
    }

    if (season == 10 || season == 12)
    {
        bosses.push({ label: 'K', ilvl: bossDataToILevel(data?.['kazzara'], season), tooltip: getBossTooltip("Kazzara, the Hellforged", data?.['kazzara'])});
        bosses.push({ label: 'AC', ilvl: bossDataToILevel(data?.['the-amalgamation-chamber'], season), tooltip: getBossTooltip("The Amalgamation Chamber", data?.['the-amalgamation-chamber'])});
        bosses.push({ label: 'FE', ilvl: bossDataToILevel(data?.['the-forgotten-experiments'], season), tooltip: getBossTooltip("The Forgotten Experiments", data?.['the-forgotten-experiments'])});
        bosses.push({ label: 'AotZ', ilvl: bossDataToILevel(data?.['assault-of-the-zaqali'], season), tooltip: getBossTooltip("Assault of the Zaqali", data?.['assault-of-the-zaqali'])});
        bosses.push({ label: 'RtE', ilvl: bossDataToILevel(data?.['rashok'], season), tooltip: getBossTooltip("Rashok, the Elder", data?.['rashok'])});
        bosses.push({ label: 'Z', ilvl: bossDataToILevel(data?.['the-vigilant-steward'], season), tooltip: getBossTooltip("The Vigilant Steward, Zskarn", data?.['the-vigilant-steward'])});
        bosses.push({ label: 'M', ilvl: bossDataToILevel(data?.['magmorax'], season), tooltip: getBossTooltip("Magmorax", data?.['magmorax'])});
        bosses.push({ label: 'EN', ilvl: bossDataToILevel(data?.['echo-of-neltharion'], season), tooltip: getBossTooltip("Echo of Neltharion", data?.['echo-of-neltharion'])});
        bosses.push({ label: 'SS', ilvl: bossDataToILevel(data?.['scalecommander-sarkareth'], season), tooltip: getBossTooltip("Scalecommander Sarkareth", data?.['scalecommander-sarkareth'])});
    }

    const sortedBosses = [...bosses.sort((a, b) => b.ilvl - a.ilvl)];

    // Ensure there are 6 bosses
    for (var i = sortedBosses.length; i < 6; ++i) {
        sortedBosses.push({ ilvl: -1, label: '', tooltip: ''});
    }

    const extraBosses = sortedBosses.length > 6 ? sortedBosses.slice(6) : [];

    return (
        <div className="flex-col">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[1].ilvl} loading={loading} season={season} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <Tooltip message={sortedBosses[0].tooltip}>
                            <DungeonRun ilevel={sortedBosses[0].ilvl} label={sortedBosses[0].label} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[1].tooltip}>
                            <DungeonRun ilevel={sortedBosses[1].ilvl} label={sortedBosses[1].label} season={season} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[3].ilvl} loading={loading} season={season} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <Tooltip message={sortedBosses[2].tooltip}>
                            <DungeonRun ilevel={sortedBosses[2].ilvl} label={sortedBosses[2].label} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[3].tooltip}>
                            <DungeonRun ilevel={sortedBosses[3].ilvl} label={sortedBosses[3].label} season={season} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[5].ilvl} loading={loading} season={season} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <Tooltip message={sortedBosses[4].tooltip}>
                            <DungeonRun ilevel={sortedBosses[4].ilvl} label={sortedBosses[4].label} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[5].tooltip}>
                            <DungeonRun ilevel={sortedBosses[5].ilvl} label={sortedBosses[5].label} season={season} />
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                {extraBosses.map((x, ix) => (
                <Tooltip key={ix} message={x.tooltip}>
                    <DungeonRun ilevel={x.ilvl} label={x.label} season={season} />
                </Tooltip>
                ))}
            </div>
        </div>
    );
}