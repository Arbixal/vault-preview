import DungeonRun from "./dungeonRun";
import VaultSlot from "./vaultSlot";

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
}

function bossDataToILevel(bossData: BossData | undefined) {
    if (bossData === undefined)
        return -1;

    if (bossData.mythic)
        return 480;
    else if (bossData.heroic)
        return 467;
    else if (bossData.normal)
        return 454;
    else if (bossData.lfr)
        return 441;

    return -1;
}

export default function RaidPanel({ data, loading }: RaidPanelProps) {

    var bosses: IBossEncounter[] = [];

    bosses.push({ label: 'G', ilvl: bossDataToILevel(data?.['gnarlroot'])});
    bosses.push({ label: 'I', ilvl: bossDataToILevel(data?.['igira-the-cruel'])});
    bosses.push({ label: 'V', ilvl: bossDataToILevel(data?.['volcoross'])});
    bosses.push({ label: 'L', ilvl: bossDataToILevel(data?.['larodar'])});
    bosses.push({ label: 'C', ilvl: bossDataToILevel(data?.['council-of-dreams'])});
    bosses.push({ label: 'N', ilvl: bossDataToILevel(data?.['nymue'])});
    bosses.push({ label: 'S', ilvl: bossDataToILevel(data?.['smolderon'])});
    bosses.push({ label: 'T', ilvl: bossDataToILevel(data?.['tindral-sageswift'])});
    bosses.push({ label: 'F', ilvl: bossDataToILevel(data?.['fyrakk-the-blazing'])});

    const sortedBosses = [...bosses.sort((a, b) => b.ilvl - a.ilvl)];

    return (
        <div className="flex-col">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[1].ilvl} loading={loading} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <DungeonRun ilevel={sortedBosses[0].ilvl} label={sortedBosses[0].label} />
                        <DungeonRun ilevel={sortedBosses[1].ilvl} label={sortedBosses[1].label} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[3].ilvl} loading={loading} />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <DungeonRun ilevel={sortedBosses[2].ilvl} label={sortedBosses[2].label} />
                        <DungeonRun ilevel={sortedBosses[3].ilvl} label={sortedBosses[3].label} />
                    </div>
                </div>
                <div className="flex-col">
                    <VaultSlot ilevel={sortedBosses[6].ilvl} loading={loading} />
                    <div className="grid grid-cols-3 gap-1 mt-2">
                        <DungeonRun ilevel={sortedBosses[4].ilvl} label={sortedBosses[4].label} />
                        <DungeonRun ilevel={sortedBosses[5].ilvl} label={sortedBosses[5].label} />
                        <DungeonRun ilevel={sortedBosses[6].ilvl} label={sortedBosses[6].label} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-9 gap-1 mt-2">
                <DungeonRun ilevel={sortedBosses[7].ilvl} label={sortedBosses[7].label} />
                <DungeonRun ilevel={sortedBosses[8].ilvl} label={sortedBosses[8].label} />
            </div>
        </div>
    );
}