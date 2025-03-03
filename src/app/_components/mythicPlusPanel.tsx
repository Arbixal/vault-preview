import { levelToILevel } from "../seasonData";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultSlot from "./vaultSlot";

interface MythicPlusPanelProps {
    data: DungeonData;
    season: number | undefined;
    loading: boolean;
}

export type DungeonData = DungeonRun[];

type DungeonRun = {
    level: number;
    name: string;
}

function levelToLabel(level: number) {
    return level > 0 ? level.toString() : '-';
}

export default function MythicPlusPanel({data, season, loading}: MythicPlusPanelProps) {
    var sortedRuns = [...(data ?? []).sort((a, b) => b.level - a.level)];

    // Ensure there are 8 runs
    for (var i = sortedRuns.length; i < 8; ++i) {
        sortedRuns.push({ level: -1, name: ''});
    }

    const extraRuns = sortedRuns.length > 8 ? sortedRuns.slice(8) : [];

    return (
        <div className="flex-col mt-5">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[0].level, season)} loading={loading} season={season} />
                    <div className="grid grid-cols-1 gap-1 mt-2">
                        <Tooltip message={sortedRuns[0].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[0].level, season)} label={levelToLabel(sortedRuns[0].level)} season={season} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[3].level, season)} loading={loading} season={season} />
                    <div className="grid grid-cols-3 gap-1 mt-2">
                        <Tooltip message={sortedRuns[1].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[1].level, season)} label={levelToLabel(sortedRuns[1].level)} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedRuns[2].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[2].level, season)} label={levelToLabel(sortedRuns[2].level)} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedRuns[3].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[3].level, season)} label={levelToLabel(sortedRuns[3].level)} season={season} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[7].level, season)} loading={loading} season={season} />
                    <div className="grid grid-cols-4 gap-1 mt-2">
                        <Tooltip message={sortedRuns[4].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[4].level, season)} label={levelToLabel(sortedRuns[4].level)} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedRuns[5].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[5].level, season)} label={levelToLabel(sortedRuns[5].level)} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedRuns[6].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[6].level, season)} label={levelToLabel(sortedRuns[6].level)} season={season} />
                        </Tooltip>
                        <Tooltip message={sortedRuns[7].name}>
                            <DungeonRun ilevel={levelToILevel(sortedRuns[7].level, season)} label={levelToLabel(sortedRuns[7].level)} season={season} />
                        </Tooltip>
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                {extraRuns.map((x, ix) => (
                    <DungeonRun key={ix} ilevel={levelToILevel(x.level, season)} label={levelToLabel(x.level)} season={season} />
                ))}
            </div>
        </div>
    )
}