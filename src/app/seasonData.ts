
const DF_S4: number = 12;
const TWW_S1: number = 13;
const TWW_S2: number = 14;

const MYTHIC_RAID: { [key: number]: number; } = { 
    12: 519, // DF_S4
    13: 623, // TWW_S1
    14: 662  // TWW_S2
};

const HEROIC_RAID: { [key: number]: number; } = { 
    12: 506, // DF_S4
    13: 610, // TWW_S1
    14: 649 // TWW_S2
};
const NORMAL_RAID: { [key: number]: number; } = { 
    12: 493, // DF_S4
    13: 597, // TWW_S1
    14: 636 // TWW_S2
};

const LFR_RAID: { [key: number]: number; } = { 
    12: 480, // DF_S4
    13: 584, // TWW_S1
    14: 623 // TWW_S2
};

const MPLUS_LEVELS: { [key: number]: [number, number][] } = {
    12: [ [10, 522], [8, 519], [6, 515], [4, 512], [2, 509] ],              // DF_S4 Fated
    13: [ [10, 623], [8, 619], [7, 616], [5, 613], [3, 610], [2, 606] ],    // TWW_S1 Nerubar
    14: [ [10, 662], [7, 658], [6, 655], [4, 652], [2, 649] ]               // TWW_S2 Undermine
}


export function levelToILevel(level: number, season: number | undefined) {
    if (season === undefined)
        return -1;

    var levels = MPLUS_LEVELS[season] ?? []

    for (var i = 0; i < levels.length; ++i) {
        let [breakpoint, ilvl] = levels[i];

        if (level >= breakpoint)
            return ilvl;
    }

    return -1;
}

export function bossDataToILevel(bossData: BossData | undefined, season: number | undefined) {
    if (bossData === undefined || season === undefined)
        return -1;

    if (bossData.mythic)
        return MYTHIC_RAID[season];
    else if (bossData.heroic)
        return HEROIC_RAID[season];
    else if (bossData.normal)
        return NORMAL_RAID[season];
    else if (bossData.lfr)
        return LFR_RAID[season];

    return -1;
}

export function ilvlToRarity(level: number, season: number | undefined): string {
    if (season === undefined 
        || MYTHIC_RAID[season] === undefined 
        || HEROIC_RAID[season] === undefined 
        || NORMAL_RAID[season] === undefined
        || LFR_RAID[season] === undefined)
        return "poor";

    if (level >= MYTHIC_RAID[season])
        return "legendary";

    if (level >= HEROIC_RAID[season])
        return "epic";

    if (level >= NORMAL_RAID[season])
        return "rare";

    if (level >= LFR_RAID[season])
        return "uncommon";

    return "poor";
}

export type BossData = {
    mythic: boolean;
    heroic: boolean;
    normal: boolean;
    lfr: boolean;
};
