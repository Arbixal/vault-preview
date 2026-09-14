interface MessagePanelProps {
    message: string;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export default function MessagePanel({message, onRetry, isRetrying = false}: MessagePanelProps) {

    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-700 bg-neutral-900/60 p-3 text-sm text-neutral-400" role="alert">
            <p>{message}</p>
            {onRetry && <button className="shrink-0 rounded-md border border-neutral-600 px-2.5 py-1 text-xs font-semibold text-neutral-200 transition hover:border-neutral-400 hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-50" type="button" onClick={onRetry} disabled={isRetrying}>{isRetrying ? "Retrying..." : "Retry"}</button>}
        </div>
    )
}
