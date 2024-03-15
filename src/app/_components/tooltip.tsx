import { ReactNode } from "react"

interface TooltipProps {
    message: ReactNode,
    children: ReactNode,
}

export default function Tooltip({message, children}: TooltipProps) {
    return (
        <div className="group relative flex container">
            {children}
            {message && <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-white group-hover:scale-100 z-10 min-w-max">{message}</span>}
        </div>
    )
};