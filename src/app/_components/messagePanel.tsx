interface MessagePanelProps {
    message: string;
}

export default function MessagePanel({message}: MessagePanelProps) {

    return (
        <div className="border rounded bg-neutral-950 text-poor border-poor">{message}</div>
    )
}