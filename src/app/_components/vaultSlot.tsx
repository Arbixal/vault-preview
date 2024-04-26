import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface VaultSlotProps {
    ilevel: number;
    loading: boolean;
}

export default function VaultSlot({ilevel, loading}: VaultSlotProps) {
    var textClass = 'text-poor';
    var borderClass = 'border-poor';

    if (ilevel >= 519) {
        textClass = 'text-legendary';
        borderClass = 'border-legendary';
    } else if (ilevel >= 506) {
        textClass = 'text-epic';
        borderClass = 'border-epic';
    } else if (ilevel >= 493) {
        textClass = 'text-rare';
        borderClass = 'border-rare';
    } else if (ilevel >= 480) {
        textClass = 'text-uncommon';
        borderClass = 'border-uncommon';
    }

    return (
        <div className={`relative w-24 sm:w-32 h-12 sm:h-16 border rounded text-2xl sm:text-3xl bg-neutral-950 bg-great-vault bg-cover ${textClass} ${borderClass}`}>
            <div className="absolute inset-0 align-middle bg-black/60 p-1.5 sm:p-3" >
                {loading && <FontAwesomeIcon icon={faSpinner} className='fa-lg fa-spin' />}
                {ilevel > 0 ? ilevel : ''}
            </div>
        </div>
    )
}