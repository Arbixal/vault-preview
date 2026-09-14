import { ReactNode } from "react";
import VaultSlot from "./vaultSlot";

interface VaultLaneProps {
    threshold: string;
    ilevel: number;
    loading: boolean;
    season: number | undefined;
    runLayoutClassName: string;
    children: ReactNode;
}

export default function VaultLane({ threshold, ilevel, loading, season, runLayoutClassName, children }: VaultLaneProps) {
    return (
        <div className="flex min-w-0 flex-col items-center">
            <span className="mb-1 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.1em] text-neutral-600">{threshold}</span>
            <VaultSlot emptyLabel={`Need ${threshold}`} ilevel={ilevel} loading={loading} season={season} />
            <div className={`mt-1 flex w-full max-w-24 flex-wrap justify-center gap-1 sm:max-w-32 sm:grid ${runLayoutClassName}`}>
                {children}
            </div>
        </div>
    );
}
