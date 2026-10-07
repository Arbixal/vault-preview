import { createPortal } from "react-dom"
import { type AriaRole, type ReactNode, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"

interface TooltipProps {
    message: ReactNode,
    children: ReactNode,
    role?: AriaRole,
}

const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

export default function Tooltip({message, children, role}: TooltipProps) {
    const tooltipId = useId();
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLSpanElement>(null);
    const isMounted = useSyncExternalStore(subscribeToMount, getClientMountSnapshot, getServerMountSnapshot);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({top: 0, left: 0, ready: false});
    const hasMessage = Boolean(message);
    const isOpen = hasMessage && (isHovered || isFocused);

    useEffect(() => {
        if (!isMounted || !isOpen) {
            return;
        }

        const updatePosition = () => {
            const trigger = triggerRef.current;
            const tooltip = tooltipRef.current;
            if (!trigger || !tooltip) {
                return;
            }

            const triggerRect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const margin = 8;
            const centeredLeft = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            const maxLeft = Math.max(margin, window.innerWidth - tooltipRect.width - margin);
            const left = Math.min(Math.max(centeredLeft, margin), maxLeft);
            let top = triggerRect.bottom + margin;
            const topLimit = window.innerHeight - tooltipRect.height - margin;
            if (top > topLimit && triggerRect.top - tooltipRect.height - margin >= margin) {
                top = triggerRect.top - tooltipRect.height - margin;
            }

            setPosition({
                top: Math.max(margin, Math.min(top, topLimit)),
                left,
                ready: true,
            });
        };

        const frame = window.requestAnimationFrame(updatePosition);
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isMounted, isOpen]);

    return (
        <>
        <div
            ref={triggerRef}
            aria-describedby={hasMessage ? tooltipId : undefined}
            className="relative flex min-w-0 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            onBlur={() => {
                setIsFocused(false);
                setPosition((current) => ({...current, ready: false}));
            }}
            onFocus={() => {
                setIsFocused(true);
                setPosition((current) => ({...current, ready: false}));
            }}
            onMouseEnter={() => {
                setIsHovered(true);
                setPosition((current) => ({...current, ready: false}));
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setPosition((current) => ({...current, ready: false}));
            }}
            role={role}
            tabIndex={hasMessage ? 0 : undefined}
        >
            {children}
        </div>
        {isMounted && hasMessage && createPortal(
            <span
                ref={tooltipRef}
                className="pointer-events-none fixed z-50 w-max max-w-[calc(100vw-1rem)] rounded bg-neutral-800 p-2 text-white shadow-xl transition-[opacity,transform] duration-150"
                id={tooltipId}
                role="tooltip"
                style={{
                    left: position.left,
                    opacity: isOpen && position.ready ? 1 : 0,
                    top: position.top,
                    transform: isOpen && position.ready ? "translateY(0)" : "translateY(-4px)",
                    visibility: isOpen && position.ready ? "visible" : "hidden",
                }}
            >
                {message}
            </span>,
            document.body,
        )}
        </>
    )
};
