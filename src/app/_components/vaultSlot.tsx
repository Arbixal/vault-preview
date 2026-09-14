import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ilvlToRarity } from '../seasonData';

interface VaultSlotProps {
    ilevel: number;
    loading: boolean;
    season: number | undefined;
    emptyLabel?: string;
}

export default function VaultSlot({ilevel, loading, season, emptyLabel = 'No qualifying Vault reward'}: VaultSlotProps) {
    var rarity: string = ilvlToRarity(ilevel, season);
    var hasReward = ilevel > 0;
    
    var textClass = 'text-' + rarity;
    var borderClass = 'border-' + rarity;

    return (
        <div
            aria-label={loading ? "Loading Vault reward" : hasReward ? `Vault reward item level ${ilevel}` : emptyLabel}
            className={`relative flex h-12 w-24 items-center justify-center overflow-hidden rounded-lg border bg-neutral-950/90 text-2xl sm:h-16 sm:w-32 sm:text-3xl ${textClass} ${borderClass}`}
            role={loading ? "status" : "img"}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className={`relative flex items-center justify-center p-1.5 sm:p-3 ${!loading && !hasReward ? "text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-600" : ""}`} >
                {loading && <FontAwesomeIcon icon={faSpinner} className='fa-lg fa-spin' />}
                {!loading && (hasReward ? ilevel : emptyLabel)}
            </div>
        </div>
    )
}
