
const DF_S4: number = 12;
const TWW_S1: number = 13;
const TWW_S2: number = 14;
const TWW_S3: number = 15;
const MIDNIGHT_S2: number = 18;

const MYTHIC_RAID: { [key: number]: number; } = { 
    12: 519, // DF_S4
    13: 623, // TWW_S1
    14: 662, // TWW_S2
    15: 707, // TWW_S3
    18: 334  // MIDNIGHT_S2 Great Vault
};

const HEROIC_RAID: { [key: number]: number; } = { 
    12: 506, // DF_S4
    13: 610, // TWW_S1
    14: 649, // TWW_S2
    15: 694, // TWW_S3
    18: 318  // MIDNIGHT_S2 Great Vault
};
const NORMAL_RAID: { [key: number]: number; } = { 
    12: 493, // DF_S4
    13: 597, // TWW_S1
    14: 636, // TWW_S2
    15: 681, // TWW_S3
    18: 305  // MIDNIGHT_S2 Great Vault
};

const LFR_RAID: { [key: number]: number; } = { 
    12: 480, // DF_S4
    13: 584, // TWW_S1
    14: 623, // TWW_S2
    15: 668, // TWW_S3
    18: 292  // MIDNIGHT_S2 Great Vault
};

const MPLUS_LEVELS: { [key: number]: [number, number][] } = {
    12: [ [10, 522], [8, 519], [6, 515], [4, 512], [2, 509] ],              // DF_S4 Fated
    13: [ [10, 623], [8, 619], [7, 616], [5, 613], [3, 610], [2, 606] ],    // TWW_S1 Nerubar
    14: [ [10, 662], [7, 658], [6, 655], [4, 652], [2, 649] ],              // TWW_S2 Undermine
    15: [ [10, 707], [7, 704], [6, 701], [4, 697], [2, 694] ],              // TWW_S3 Manaforge
    18: [ [10, 318], [7, 315], [6, 311], [4, 308], [2, 305] ]               // MIDNIGHT_S2
}

const DELVE_LEVELS: { [key: number]: [number, number][] } = {
    14: [ [8, 649], [7, 645], [5, 642], [4, 636], [3, 626], [1, 623] ],     // TWW_S2 Undermine
    15: [ [8, 694], [7, 691], [6, 688], [5, 681], [4, 678], [3, 675], [2, 671], [1, 668] ],  // TWW_S3 Manaforge
    18: [ [8, 305], [7, 302], [6, 298], [5, 292], [4, 289], [3, 285], [2, 282], [1, 279] ]   // MIDNIGHT_S2
}

const RARITY_THRESHOLDS: { [key: number]: RarityThresholds } = {
    18: {
        legendary: 318,
        epic: 305,
        rare: 292,
        uncommon: 279,
    },
};

const BOSS_NAMES: { [key: number]: BossName[] } = {
    9: [    // Vault of the Incarnates
        { label: 'E', key: "eranog", name: "Eranog" },
        { label: 'T', key: "terros", name: "Terros" },
        { label: 'PC', key: "the-primal-council", name: "The Primal Council" },
        { label: 'SCB', key: "sennarth", name: "Sennarth, the Cold Breath" },
        { label: 'D', key: "dathea", name: "Dathea, Ascended" },
        { label: 'KG', key: "kurog-grimtotem", name: "Kurog Grimtotem" },
        { label: 'BD', key: "broodkeeper-diurna", name: "Broodkeeper Diurna" },
        { label: 'R', key: "raszageth-the-storm-eater", name: "Raszageth the Storm Eater" },
    ],
    10: [   // Aberrus
        { label: 'K', key: "kazzara", name: "Kazzara, the Hellforged" },
        { label: 'AC', key: "the-amalgamation-chamber", name: "The Amalgamation Chamber" },
        { label: 'FE', key: "the-forgotten-experiments", name: "The Forgotten Experiments" },
        { label: 'AotZ', key: "assault-of-the-zaqali", name: "Assault of the Zaqali" },
        { label: 'Rte', key: "rashok", name: "Rashok, the Elder" },
        { label: 'Z', key: "the-vigilant-steward", name: "The Vigilant Steward, Zskarn" },
        { label: 'M', key: "magmorax", name: "Magmorax" },
        { label: 'EN', key: "echo-of-neltharion", name: "Echo of Neltharion" },
        { label: 'SS', key: "scalecommander-sarkareth", name: "Scalecommander Sarkareth" },
    ],
    11: [   // Amirdrassil
        { label: 'G', key: "gnarlroot", name: "Gnarlroot" },
        { label: 'I', key: "igira-the-cruel", name: "Igira the Cruel" },
        { label: 'V', key: "volcoross", name: "Volcoross" },
        { label: 'L', key: "larodar", name: "Larodar, Keeper of the Flame" },
        { label: 'CoD', key: "council-of-dreams", name: "Council of Dreams" },
        { label: 'N', key: "nymue", name: "Nymue, Weaver of the Cycle" },
        { label: 'S', key: "smolderon", name: "Smolderon" },
        { label: 'TS', key: "tindral-sageswift", name: "Tindral Sageswift" },
        { label: 'F', key: "fyrakk-the-blazing", name: "Fyrakk the Blazing" },
    ],
    12: [   // Fated S4
        { label: 'E', key: "eranog", name: "Eranog" },
        { label: 'T', key: "terros", name: "Terros" },
        { label: 'PC', key: "the-primal-council", name: "The Primal Council" },
        { label: 'SCB', key: "sennarth", name: "Sennarth, the Cold Breath" },
        { label: 'D', key: "dathea", name: "Dathea, Ascended" },
        { label: 'KG', key: "kurog-grimtotem", name: "Kurog Grimtotem" },
        { label: 'BD', key: "broodkeeper-diurna", name: "Broodkeeper Diurna" },
        { label: 'R', key: "raszageth-the-storm-eater", name: "Raszageth the Storm Eater" },
        { label: 'K', key: "kazzara", name: "Kazzara, the Hellforged" },
        { label: 'AC', key: "the-amalgamation-chamber", name: "The Amalgamation Chamber" },
        { label: 'FE', key: "the-forgotten-experiments", name: "The Forgotten Experiments" },
        { label: 'AotZ', key: "assault-of-the-zaqali", name: "Assault of the Zaqali" },
        { label: 'Rte', key: "rashok", name: "Rashok, the Elder" },
        { label: 'Z', key: "the-vigilant-steward", name: "The Vigilant Steward, Zskarn" },
        { label: 'M', key: "magmorax", name: "Magmorax" },
        { label: 'EN', key: "echo-of-neltharion", name: "Echo of Neltharion" },
        { label: 'SS', key: "scalecommander-sarkareth", name: "Scalecommander Sarkareth" },
        { label: 'G', key: "gnarlroot", name: "Gnarlroot" },
        { label: 'I', key: "igira-the-cruel", name: "Igira the Cruel" },
        { label: 'V', key: "volcoross", name: "Volcoross" },
        { label: 'L', key: "larodar", name: "Larodar, Keeper of the Flame" },
        { label: 'CoD', key: "council-of-dreams", name: "Council of Dreams" },
        { label: 'N', key: "nymue", name: "Nymue, Weaver of the Cycle" },
        { label: 'S', key: "smolderon", name: "Smolderon" },
        { label: 'TS', key: "tindral-sageswift", name: "Tindral Sageswift" },
        { label: 'F', key: "fyrakk-the-blazing", name: "Fyrakk the Blazing" },
    ],
    13: [   // Nerubar Palace
        { label: 'U', key: "ulgrax-the-devourer", name: "Ulgrax" },
        { label: 'B', key: "the-bloodbound-horror", name: "Bloodbound Horror" },
        { label: 'S', key: "sikran", name: "Sikran" },
        { label: 'R', key: "rashanan", name: "Rasha'nan" },
        { label: 'BO', key: "broodtwister-ovinax", name: "Broodtwister Ovi'nax" },
        { label: 'K', key: "nexus-princess-kyveza", name: "Nexus-Princess Ky'veza" },
        { label: 'SC', key: "the-silken-court", name: "Silken Court" },
        { label: 'A', key: "queen-ansurek", name: "Queen Ansurek" },
    ],
    14: [   // Liberation of Undermine
        { label: 'V', key: "vexie-and-the-geargrinders", name: "Vexie and the Geargrinders" },
        { label: 'CoC', key: "cauldron-of-carnage", name: "Cauldron of Carnage" },
        { label: 'R', key: "rik-reverb", name: "Rik Reverb" },
        { label: 'SB', key: "stix-bunkjunker", name: "Stix Bunkjunker" },
        { label: 'SL', key: "sprocketmonger-lockenstock", name: "Sprocketmonger Lockenstock" },
        { label: 'OAB', key: "the-one-armed-bandit", name: "The One-Armed Bandit" },
        { label: 'M', key: "mug'zee", name: "Mug'zee" },
        { label: 'G', key: "chrome-king-gallywix", name: "Gallywix" },
    ],
    15: [   // Manaforge Omega
        { label: 'P', key: "plexus-sentinel", name: "Plexus Sentinel" },
        { label: 'L', key: "loom'ithar", name: "Loom'ithar" },
        { label: 'S', key: "soulbinder-naazindhri", name: "Soulbinder Naazindhri" },
        { label: 'FA', key: "forgeweaver-araz", name: "Forgeweaver Araz" },
        { label: 'SH', key: "the-soul-hunters", name: "The Soul Hunters" },
        { label: 'F', key: "fractillus", name: "Fractillus" },
        { label: 'N', key: "nexus-king-salhadaar", name: "Nexus-King Salhadaar" },
        { label: 'D', key: "dimensius", name: "Dimensius" },
    ],
    18: [   // Midnight S2: Venomous Abyss and Tidebound Grotto
        { label: 'N', key: "nek'zali-the-soulcoiler", name: "Nek'zali the Soulcoiler" },
        { label: 'ES', key: "entombed-sentinels", name: "Entombed Sentinels" },
        { label: 'V', key: "vashnik-the-malignant", name: "Vashnik the Malignant" },
        { label: 'LE', key: "the-lost-explorers", name: "The Lost Explorers" },
        { label: 'S', key: "sszorak", name: "Sszorak" },
        { label: 'TF', key: "the-twin-fangs", name: "The Twin Fangs" },
        { label: 'CA', key: "the-coiled-altar", name: "The Coiled Altar" },
        { label: 'U', key: "ula'tek", name: "Ula'tek" },
        { label: 'NW', key: "nymrissa-wavecaller", name: "Nymrissa Wavecaller", lfrLabel: "World" },
    ]
}

export function getBossNames(season: number | undefined): BossName[] {
    if (season === undefined)
        return [];

    return BOSS_NAMES[season] ?? [];
}

export function delveToILevel(level: number, season: number | undefined): number {
    if (season === undefined)
        return -1;

    var levels = DELVE_LEVELS[season] ?? [];

    for (var i = 0; i < levels.length; ++i) {
        let [breakpoint, ilvl] = levels[i];

        if (level >= breakpoint)
            return ilvl;
    }

    return -1;
}


export function levelToILevel(level: number, season: number | undefined): number {
    if (season === undefined)
        return -1;

    var levels = MPLUS_LEVELS[season] ?? [];

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
    if (season === undefined)
        return "poor";

    let thresholds = RARITY_THRESHOLDS[season];

    if (thresholds === undefined) {
        if (MYTHIC_RAID[season] === undefined
            || HEROIC_RAID[season] === undefined
            || NORMAL_RAID[season] === undefined
            || LFR_RAID[season] === undefined)
            return "poor";

        thresholds = {
            legendary: MYTHIC_RAID[season],
            epic: HEROIC_RAID[season],
            rare: NORMAL_RAID[season],
            uncommon: LFR_RAID[season],
        };
    }

    if (level >= thresholds.legendary)
        return "legendary";

    if (level >= thresholds.epic)
        return "epic";

    if (level >= thresholds.rare)
        return "rare";

    if (level >= thresholds.uncommon)
        return "uncommon";

    return "poor";
}

export type BossData = {
    mythic: boolean;
    heroic: boolean;
    normal: boolean;
    lfr: boolean;
};

export type BossName = {
    label: string;
    key: string;
    name: string;
    lfrLabel?: string;
}

type RarityThresholds = {
    legendary: number;
    epic: number;
    rare: number;
    uncommon: number;
}
