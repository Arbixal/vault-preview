import { delveToILevel } from "../seasonData";
import DungeonRun from "./dungeonRun";
import Tooltip from "./tooltip";
import VaultSlot from "./vaultSlot";

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
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={delveToILevel(sortedRuns[1], season)} loading={loading} season={season} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <DungeonRun ilevel={delveToILevel(sortedRuns[0], season)} label={levelToLabel(sortedRuns[0])} season={season} />
                        <DungeonRun ilevel={delveToILevel(sortedRuns[1], season)} label={levelToLabel(sortedRuns[1])} season={season} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={delveToILevel(sortedRuns[3], season)} loading={loading} season={season} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <DungeonRun ilevel={delveToILevel(sortedRuns[2], season)} label={levelToLabel(sortedRuns[2])} season={season} />
                        <DungeonRun ilevel={delveToILevel(sortedRuns[3], season)} label={levelToLabel(sortedRuns[3])} season={season} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={delveToILevel(sortedRuns[7], season)} loading={loading} season={season} />
                    <div className="grid grid-cols-4 gap-1 mt-2">
                        <DungeonRun ilevel={delveToILevel(sortedRuns[4], season)} label={levelToLabel(sortedRuns[4])} season={season} />
                        <DungeonRun ilevel={delveToILevel(sortedRuns[5], season)} label={levelToLabel(sortedRuns[5])} season={season} />
                        <DungeonRun ilevel={delveToILevel(sortedRuns[6], season)} label={levelToLabel(sortedRuns[6])} season={season} />
                        <DungeonRun ilevel={delveToILevel(sortedRuns[7], season)} label={levelToLabel(sortedRuns[7])} season={season} />
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                {extraRuns.map((x, ix) => (
                    <DungeonRun key={ix} ilevel={delveToILevel(x, season)} label={levelToLabel(x)} season={season} />
                ))}
            </div>
        </div>
    )
}