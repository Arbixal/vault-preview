import { delveToILevel } from "../seasonData";
import DungeonRun from "./dungeonRun";
import VaultLane from "./vaultLane";

interface DelvePanelProps {
    data: DelveData;
    season: number | undefined;
    loading: boolean;
}

export type DelveData = { [key: number]: number; };

function levelToLabel(level: number) {
    return level > 0 ? level.toString() : '-';
}

function addRunByLevel(sortedRuns: number[], level: number, count: number) {
    for (var i = 0; i < count; ++i) {
        sortedRuns.push(level);
    }
}

export default function DelvePanel({data, season, loading}: DelvePanelProps) {
    var sortedRuns: number[] = [];

    if (data !== undefined) {
        for (var j = 11; j > 0; --j) {
            addRunByLevel(sortedRuns, j, data[j]);
        }
    }

    // Ensure there are 8 runs
    for (var i = sortedRuns.length; i < 8; ++i) {
        sortedRuns.push(-1);
    }

    const extraRuns = sortedRuns.length > 8 ? sortedRuns.slice(8) : [];

    return (
        <div className="flex-col">
            <div className="grid min-w-0 grid-cols-3 justify-center gap-2 sm:grid-cols-[repeat(3,9rem)] sm:gap-4">
                <VaultLane threshold="2 delves" ilevel={delveToILevel(sortedRuns[1], season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-2">
                    <DungeonRun ilevel={delveToILevel(sortedRuns[0], season)} label={levelToLabel(sortedRuns[0])} loading={loading} season={season} />
                    <DungeonRun ilevel={delveToILevel(sortedRuns[1], season)} label={levelToLabel(sortedRuns[1])} loading={loading} season={season} />
                </VaultLane>
                <VaultLane threshold="4 delves" ilevel={delveToILevel(sortedRuns[3], season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-2">
                    <DungeonRun ilevel={delveToILevel(sortedRuns[2], season)} label={levelToLabel(sortedRuns[2])} loading={loading} season={season} />
                    <DungeonRun ilevel={delveToILevel(sortedRuns[3], season)} label={levelToLabel(sortedRuns[3])} loading={loading} season={season} />
                </VaultLane>
                <VaultLane threshold="8 delves" ilevel={delveToILevel(sortedRuns[7], season)} loading={loading} season={season} runLayoutClassName="sm:grid-cols-4">
                    <DungeonRun ilevel={delveToILevel(sortedRuns[4], season)} label={levelToLabel(sortedRuns[4])} loading={loading} season={season} />
                    <DungeonRun ilevel={delveToILevel(sortedRuns[5], season)} label={levelToLabel(sortedRuns[5])} loading={loading} season={season} />
                    <DungeonRun ilevel={delveToILevel(sortedRuns[6], season)} label={levelToLabel(sortedRuns[6])} loading={loading} season={season} />
                    <DungeonRun ilevel={delveToILevel(sortedRuns[7], season)} label={levelToLabel(sortedRuns[7])} loading={loading} season={season} />
                </VaultLane>


            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
                {extraRuns.map((x, ix) => (
                    <DungeonRun key={ix} ilevel={delveToILevel(x, season)} label={levelToLabel(x)} season={season} className="w-7" />
                ))}
            </div>
        </div>
    )
}
