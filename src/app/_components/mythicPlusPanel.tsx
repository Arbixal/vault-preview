import DungeonRun from "./dungeonRun";
import VaultSlot from "./vaultSlot";

interface MythicPlusPanelProps {
    data: DungeonData;
}

export type DungeonData = DungeonRun[];

type DungeonRun = {
    level: number;
    name: string;
}

function levelToILevel(level: number) {
    if (level >= 20)
        return 483;
    else if (level >= 18)
        return 480;
    else if (level >= 15)
        return 476;
    else if (level >= 12)
        return 473;
    else if (level >= 10)
        return 470;
    else if (level >= 8)
        return 467;
    else if (level >= 6)
        return 463;
    else if (level >= 4)
        return 460;
    else if (level >= 3)
        return 457;
    else if (level >= 2)
        return 454;
    else
        return -1;
}

function levelToLabel(level: number) {
    return level > 0 ? level.toString() : '-';
}

export default function MythicPlusPanel({data}: MythicPlusPanelProps) {
    var sortedRuns = [...(data ?? []).sort((a, b) => b.level - a.level)];

    // Ensure there are 8 runs
    for (var i = sortedRuns.length; i < 8; ++i) {
        sortedRuns.push({ level: -1, name: ''});
    }

    const extraRuns = sortedRuns.length > 8 ? sortedRuns.slice(8) : [];

    return (
        <div className="flex-col ml-5">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[0].level)} />
                    <div className="grid grid-cols-1 gap-1 mt-2">
                        <DungeonRun ilevel={levelToILevel(sortedRuns[0].level)} label={levelToLabel(sortedRuns[0].level)} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[3].level)} />
                    <div className="grid grid-cols-3 gap-1 mt-2">
                        <DungeonRun ilevel={levelToILevel(sortedRuns[1].level)} label={levelToLabel(sortedRuns[1].level)} />
                        <DungeonRun ilevel={levelToILevel(sortedRuns[2].level)} label={levelToLabel(sortedRuns[2].level)} />
                        <DungeonRun ilevel={levelToILevel(sortedRuns[3].level)} label={levelToLabel(sortedRuns[3].level)} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={levelToILevel(sortedRuns[7].level)} />
                    <div className="grid grid-cols-4 gap-1 mt-2">
                        <DungeonRun ilevel={levelToILevel(sortedRuns[4].level)} label={levelToLabel(sortedRuns[4].level)} />
                        <DungeonRun ilevel={levelToILevel(sortedRuns[5].level)} label={levelToLabel(sortedRuns[5].level)} />
                        <DungeonRun ilevel={levelToILevel(sortedRuns[6].level)} label={levelToLabel(sortedRuns[6].level)} />
                        <DungeonRun ilevel={levelToILevel(sortedRuns[7].level)} label={levelToLabel(sortedRuns[7].level)} />
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                {extraRuns.map((x, ix) => (
                    <DungeonRun key={ix} ilevel={levelToILevel(x.level)} label={levelToLabel(x.level)} />
                ))}
            </div>
        </div>
    )
}