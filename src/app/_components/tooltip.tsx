import { ReactNode, useId } from "react"

interface TooltipProps {
    message: ReactNode,
    children: ReactNode,
}

export default function Tooltip({message, children}: TooltipProps) {
    const tooltipId = useId();
    const hasMessage = Boolean(message);

    return (
        <div aria-describedby={hasMessage ? tooltipId : undefined} className="group relative flex min-w-0 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500" tabIndex={hasMessage ? 0 : undefined}>
            {children}
            {hasMessage && <span className="pointer-events-none absolute top-10 z-10 min-w-max scale-0 rounded bg-neutral-800 p-2 text-white opacity-0 shadow-xl transition-all group-focus:scale-100 group-focus:opacity-100 group-hover:scale-100 group-hover:opacity-100" id={tooltipId} role="tooltip">{message}</span>}
        </div>
    )
};
