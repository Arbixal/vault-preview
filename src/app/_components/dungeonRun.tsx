import { ilvlToRarity } from "../seasonData";


interface DungeonRunProps {
    ilevel: number;
    label: string;
    loading?: boolean;
    season: number | undefined;
    className?: string;
}

export default function DungeonRun({ilevel, label, loading = false, season, className = 'w-7 sm:w-full'}: DungeonRunProps) {
    
    var rarity: string = ilvlToRarity(ilevel, season);

    var textClass = 'text-' + rarity;
    var borderClass = 'border-' + rarity;

    return (
        <div aria-label={loading ? "Loading run" : label === '-' ? "No qualifying run" : `Run ${label}`} className={`flex h-7 shrink-0 items-center justify-center rounded border bg-neutral-950 px-1 text-center text-[11px] leading-none whitespace-nowrap sm:text-xs ${className} ${textClass} ${borderClass}`}>
            {loading ? <span aria-hidden="true" className="h-1.5 w-3/4 animate-pulse rounded-full bg-neutral-700" /> : label}
        </div>
    )
}
