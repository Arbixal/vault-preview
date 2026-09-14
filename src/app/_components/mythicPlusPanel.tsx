import { levelToILevel } from "../seasonData";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultLane from "./vaultLane";

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
        <div className="flex-col">
            <div className="grid min-w-0 grid-cols-3 justify-center gap-2 sm:grid-cols-[repeat(3,9rem)] sm:gap-4">
                <VaultLane threshold="1 run" ilevel={levelToILevel(sortedRuns[0].level, season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-1">
                    <Tooltip message={loading ? "" : sortedRuns[0].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[0].level, season)} label={levelToLabel(sortedRuns[0].level)} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>
                <VaultLane threshold="4 runs" ilevel={levelToILevel(sortedRuns[3].level, season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-3">
                    <Tooltip message={loading ? "" : sortedRuns[1].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[1].level, season)} label={levelToLabel(sortedRuns[1].level)} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedRuns[2].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[2].level, season)} label={levelToLabel(sortedRuns[2].level)} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedRuns[3].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[3].level, season)} label={levelToLabel(sortedRuns[3].level)} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>
                <VaultLane threshold="8 runs" ilevel={levelToILevel(sortedRuns[7].level, season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-4">
                    <Tooltip message={loading ? "" : sortedRuns[4].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[4].level, season)} label={levelToLabel(sortedRuns[4].level)} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedRuns[5].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[5].level, season)} label={levelToLabel(sortedRuns[5].level)} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedRuns[6].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[6].level, season)} label={levelToLabel(sortedRuns[6].level)} loading={loading} season={season} />
                    </Tooltip>
                    <Tooltip message={loading ? "" : sortedRuns[7].name}>
                        <DungeonRun ilevel={levelToILevel(sortedRuns[7].level, season)} label={levelToLabel(sortedRuns[7].level)} loading={loading} season={season} />
                    </Tooltip>
                </VaultLane>


            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
                {extraRuns.map((x, ix) => (
                    <DungeonRun key={ix} ilevel={levelToILevel(x.level, season)} label={levelToLabel(x.level)} season={season} className="w-7" />
                ))}
            </div>
        </div>
    )
}
