import { ReactNode } from "react";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultSlot from "./vaultSlot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface RaidPanelProps {
    data: RaidData;
    loading: boolean;
}

export type RaidData = { [key: string]: BossData }
type BossData = {
    mythic: boolean;
    heroic: boolean;
    normal: boolean;
    lfr: boolean;
}

interface IBossEncounter {
    label: string;
    ilvl: number;
    tooltip: ReactNode;
}

function bossDataToILevel(bossData: BossData | undefined) {
    if (bossData === undefined)
        return -1;

    if (bossData.mythic)
        return 519;
    else if (bossData.heroic)
        return 506;
    else if (bossData.normal)
        return 493;
    else if (bossData.lfr)
        return 480;

    return -1;
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

export default function RaidPanel({ data, loading }: RaidPanelProps) {

    var bosses: IBossEncounter[] = [];

    bosses.push({ label: 'G', ilvl: bossDataToILevel(data?.['gnarlroot']), tooltip: getBossTooltip("Gnarlroot", data?.['gnarlroot'])});
    bosses.push({ label: 'I', ilvl: bossDataToILevel(data?.['igira-the-cruel']), tooltip: getBossTooltip("Igira the Cruel", data?.['igira-the-cruel'])});
    bosses.push({ label: 'V', ilvl: bossDataToILevel(data?.['volcoross']), tooltip: getBossTooltip("Volcoross", data?.['volcoross'])});
    bosses.push({ label: 'L', ilvl: bossDataToILevel(data?.['larodar']), tooltip: getBossTooltip("Larodar, Keeper of the Flame", data?.['larodar'])});
    bosses.push({ label: 'CoD', ilvl: bossDataToILevel(data?.['council-of-dreams']), tooltip: getBossTooltip("Council of Dreams", data?.['council-of-dreams'])});
    bosses.push({ label: 'N', ilvl: bossDataToILevel(data?.['nymue']), tooltip: getBossTooltip("Nymue, Weaver of the Cycle", data?.['nymue'])});
    bosses.push({ label: 'S', ilvl: bossDataToILevel(data?.['smolderon']), tooltip: getBossTooltip("Smolderon", data?.['smolderon'])});
    bosses.push({ label: 'TS', ilvl: bossDataToILevel(data?.['tindral-sageswift']), tooltip: getBossTooltip("Tindral Sageswift", data?.['tindral-sageswift'])});
    bosses.push({ label: 'F', ilvl: bossDataToILevel(data?.['fyrakk-the-blazing']), tooltip: getBossTooltip("Fyrakk the Blazing", data?.['fyrakk-the-blazing'])});

    bosses.push({ label: 'E', ilvl: bossDataToILevel(data?.['eranog']), tooltip: getBossTooltip("Eranog", data?.['eranog'])});
    bosses.push({ label: 'T', ilvl: bossDataToILevel(data?.['terros']), tooltip: getBossTooltip("Terros", data?.['terros'])});
    bosses.push({ label: 'PC', ilvl: bossDataToILevel(data?.['the-primal-council']), tooltip: getBossTooltip("The Primal Council", data?.['the-primal-council'])});
    bosses.push({ label: 'SCB', ilvl: bossDataToILevel(data?.['sennarth']), tooltip: getBossTooltip("Sennarth, the Cold Breath", data?.['sennarth'])});
    bosses.push({ label: 'D', ilvl: bossDataToILevel(data?.['dathea']), tooltip: getBossTooltip("Dathea, Ascended", data?.['dathea'])});
    bosses.push({ label: 'KG', ilvl: bossDataToILevel(data?.['kurog-grimtotem']), tooltip: getBossTooltip("Kurog Grimtotem", data?.['kurog-grimtotem'])});
    bosses.push({ label: 'BD', ilvl: bossDataToILevel(data?.['broodkeeper-diurna']), tooltip: getBossTooltip("Broodkeeper Diurna", data?.['broodkeeper-diurna'])});
    bosses.push({ label: 'R', ilvl: bossDataToILevel(data?.['raszageth-the-storm-eater']), tooltip: getBossTooltip("Raszageth the Storm Eater", data?.['raszageth-the-storm-eater'])});

    bosses.push({ label: 'K', ilvl: bossDataToILevel(data?.['kazzara']), tooltip: getBossTooltip("Kazzara, the Hellforged", data?.['kazzara'])});
    bosses.push({ label: 'AC', ilvl: bossDataToILevel(data?.['the-amalgamation-chamber']), tooltip: getBossTooltip("The Amalgamation Chamber", data?.['the-amalgamation-chamber'])});
    bosses.push({ label: 'FE', ilvl: bossDataToILevel(data?.['the-forgotten-experiments']), tooltip: getBossTooltip("The Forgotten Experiments", data?.['the-forgotten-experiments'])});
    bosses.push({ label: 'AotZ', ilvl: bossDataToILevel(data?.['assault-of-the-zaqali']), tooltip: getBossTooltip("Assault of the Zaqali", data?.['assault-of-the-zaqali'])});
    bosses.push({ label: 'RtE', ilvl: bossDataToILevel(data?.['rashok']), tooltip: getBossTooltip("Rashok, the Elder", data?.['rashok'])});
    bosses.push({ label: 'Z', ilvl: bossDataToILevel(data?.['the-vigilant-steward']), tooltip: getBossTooltip("The Vigilant Steward, Zskarn", data?.['the-vigilant-steward'])});
    bosses.push({ label: 'M', ilvl: bossDataToILevel(data?.['magmorax']), tooltip: getBossTooltip("Magmorax", data?.['magmorax'])});
    bosses.push({ label: 'EN', ilvl: bossDataToILevel(data?.['echo-of-neltharion']), tooltip: getBossTooltip("Echo of Neltharion", data?.['echo-of-neltharion'])});
    bosses.push({ label: 'SS', ilvl: bossDataToILevel(data?.['scalecommander-sarkareth']), tooltip: getBossTooltip("Scalecommander Sarkareth", data?.['scalecommander-sarkareth'])});

    const sortedBosses = [...bosses.sort((a, b) => b.ilvl - a.ilvl)];

    const extraBosses = sortedBosses.length > 7 ? sortedBosses.slice(7) : [];

    return (
        <div className="flex-col">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[1].ilvl} loading={loading} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <Tooltip message={sortedBosses[0].tooltip}>
                            <DungeonRun ilevel={sortedBosses[0].ilvl} label={sortedBosses[0].label} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[1].tooltip}>
                            <DungeonRun ilevel={sortedBosses[1].ilvl} label={sortedBosses[1].label} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[3].ilvl} loading={loading} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <Tooltip message={sortedBosses[2].tooltip}>
                            <DungeonRun ilevel={sortedBosses[2].ilvl} label={sortedBosses[2].label} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[3].tooltip}>
                            <DungeonRun ilevel={sortedBosses[3].ilvl} label={sortedBosses[3].label} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[6].ilvl} loading={loading} />
                    <div className="grid grid-cols-3 gap-1 mt-2">
                        <Tooltip message={sortedBosses[4].tooltip}>
                            <DungeonRun ilevel={sortedBosses[4].ilvl} label={sortedBosses[4].label} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[5].tooltip}>
                            <DungeonRun ilevel={sortedBosses[5].ilvl} label={sortedBosses[5].label} />
                        </Tooltip>
                        <Tooltip message={sortedBosses[6].tooltip}>
                            <DungeonRun ilevel={sortedBosses[6].ilvl} label={sortedBosses[6].label} />
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                {extraBosses.map((x, ix) => (
                <Tooltip key={ix} message={x.tooltip}>
                    <DungeonRun ilevel={x.ilvl} label={x.label} />
                </Tooltip>
                ))}
            </div>
        </div>
    );
}