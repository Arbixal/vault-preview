import { ilvlToRarity } from "../seasonData";


interface DungeonRunProps {
    ilevel: number;
    label: string;
    season: number | undefined;
}

export default function DungeonRun({ilevel, label, season}: DungeonRunProps) {
    
    var rarity: string = ilvlToRarity(ilevel, season);

    var textClass = 'text-' + rarity;
    var borderClass = 'border-' + rarity;

    return (
        <div className={`border rounded bg-neutral-950 container ${textClass} ${borderClass}`}>{label}</div>
    )
}