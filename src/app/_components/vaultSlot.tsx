interface VaultSlotProps {
    ilevel: number;
}

export default function VaultSlot({ilevel}: VaultSlotProps) {
    var textClass = 'text-poor';
    var borderClass = 'border-poor';

    if (ilevel >= 480) {
        textClass = 'text-legendary';
        borderClass = 'border-legendary';
    } else if (ilevel >= 467) {
        textClass = 'text-epic';
        borderClass = 'border-epic';
    } else if (ilevel >= 454) {
        textClass = 'text-rare';
        borderClass = 'border-rare';
    } else if (ilevel >= 441) {
        textClass = 'text-uncommon';
        borderClass = 'border-uncommon';
    }

    return (
        <div className={`w-32 h-16 border rounded text-3xl bg-neutral-950 ${textClass} ${borderClass}`}>
            <div className="mt-3">{ilevel > 0 ? ilevel : '-'}</div>
        </div>
    )
}