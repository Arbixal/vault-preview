interface DungeonRunProps {
    ilevel: number;
    label: string;
}

export default function DungeonRun({ilevel, label}: DungeonRunProps) {
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
        <div className={`border rounded bg-neutral-950 container ${textClass} ${borderClass}`}>{label}</div>
    )
}