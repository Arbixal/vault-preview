import { ReactNode } from "react";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultLane from "./vaultLane";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { BossData, bossDataToILevel, getBossNames, BossName } from "../seasonData";

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

function getBossTooltip(bossName: string, data: BossData, lfrLabel: string = "LFR"): ReactNode
{
    return (<div className="flex flex-col h-fit">
        <h1 className="font-bold mb-2">{bossName}</h1>
        <div className="flex text-uncommon"><span className="text-left flex-auto">{lfrLabel}</span> {data?.lfr == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-rare"><span className="text-left flex-auto">Normal</span> {data?.normal == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-epic"><span className="text-left flex-auto">Heroic</span> {data?.heroic == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
        <div className="flex text-legendary"><span className="text-left flex-auto">Mythic</span> {data?.mythic == true ? <FontAwesomeIcon icon={faCircleCheck} className="mt-1.5" /> : ""}</div>
    </div>)
}

export default function RaidPanel({ data, season, loading }: RaidPanelProps) {

    var bosses: IBossEncounter[] = [];

    var bossNames: BossName[] = getBossNames(season);

    bossNames.forEach((boss) => {
        bosses.push({ label: boss.label, ilvl: bossDataToILevel(data?.[boss.key], season), tooltip: getBossTooltip(boss.name, data?.[boss.key], boss.lfrLabel)});
    });

    const sortedBosses = [...bosses.sort((a, b) => b.ilvl - a.ilvl)];

    // Ensure there are 6 bosses
    for (var i = sortedBosses.length; i < 6; ++i) {
        sortedBosses.push({ ilvl: -1, label: '', tooltip: ''});
    }

    const extraBosses = sortedBosses.length > 6 ? sortedBosses.slice(6) : [];

    return (
        <div className="flex-col">
            <div className="grid min-w-0 grid-cols-3 justify-center gap-2 sm:grid-cols-[repeat(3,9rem)] sm:gap-4">
                <VaultLane threshold="2 bosses" ilevel={sortedBosses[1].ilvl} loading={loading} season={season} runLayoutClassName="sm:grid-cols-2">
                    <Tooltip message={loading ? "" : sortedBosses[0].tooltip}>
                        <DungeonRun ilevel={sortedBosses[0].ilvl} label={sortedBosses[0].label} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedBosses[1].tooltip}>
                        <DungeonRun ilevel={sortedBosses[1].ilvl} label={sortedBosses[1].label} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>
                <VaultLane threshold="4 bosses" ilevel={sortedBosses[3].ilvl} loading={loading} season={season} runLayoutClassName="sm:grid-cols-2">
                    <Tooltip message={loading ? "" : sortedBosses[2].tooltip}>
                        <DungeonRun ilevel={sortedBosses[2].ilvl} label={sortedBosses[2].label} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedBosses[3].tooltip}>
                        <DungeonRun ilevel={sortedBosses[3].ilvl} label={sortedBosses[3].label} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>
                <VaultLane threshold="6 bosses" ilevel={sortedBosses[5].ilvl} loading={loading} season={season} runLayoutClassName="sm:grid-cols-2">
                    <Tooltip message={loading ? "" : sortedBosses[4].tooltip}>
                        <DungeonRun ilevel={sortedBosses[4].ilvl} label={sortedBosses[4].label} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedBosses[5].tooltip}>
                        <DungeonRun ilevel={sortedBosses[5].ilvl} label={sortedBosses[5].label} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>
            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
                {extraBosses.map((x, ix) => (
                <Tooltip key={ix} message={x.tooltip}>
                    <DungeonRun ilevel={x.ilvl} label={x.label} season={season} className="w-7" />
                </Tooltip>
                ))}
            </div>
        </div>
    );
}
