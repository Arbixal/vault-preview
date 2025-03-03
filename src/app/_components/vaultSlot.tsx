import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ilvlToRarity } from '../seasonData';

interface VaultSlotProps {
    ilevel: number;
    loading: boolean;
    season: number | undefined;
}

export default function VaultSlot({ilevel, loading, season}: VaultSlotProps) {
    var rarity: string = ilvlToRarity(ilevel, season);
    
        var textClass = 'text-' + rarity;
        var borderClass = 'border-' + rarity;

    return (
        <div className={`relative w-24 sm:w-32 h-12 sm:h-16 border rounded text-2xl sm:text-3xl bg-neutral-950 bg-great-vault bg-cover ${textClass} ${borderClass}`}>
            <div className="absolute inset-0 align-middle bg-black/60 p-1.5 sm:p-3" >
                {loading && <FontAwesomeIcon icon={faSpinner} className='fa-lg fa-spin' />}
                {ilevel > 0 ? ilevel : ''}
            </div>
        </div>
    )
}