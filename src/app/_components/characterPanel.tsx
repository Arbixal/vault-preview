import MythicPlusPanel, { DungeonData } from "./mythicPlusPanel";
import RaidPanel, { RaidData } from "./raidPanel";

interface ICharacterPanelProps {
    character: Character;
    data: CharacterData;
}

export interface Character {
    name: string;
    realm: string;
    player_class: string;
}

export interface CharacterData {
    raid: RaidData;
    dungeons: DungeonData;
}

export default function CharacterPanel({character, data} : ICharacterPanelProps)
{
    return (
        <div className={`flex font-sans border rounded p-2 bg-${character.player_class}/15 border-${character.player_class}`}>
          <div className="flex-auto">
            <h1 className={`text-lg font-semibold capitalize text-${character.player_class}`}>{character.name} <span className={`text-sm text-${character.player_class}/50`}>{character.realm}</span></h1>
            <div className="flex text-center">
              <RaidPanel data={data?.raid} />

              <MythicPlusPanel data={data?.dungeons} />
            </div>
          </div>
        </div>
    )
}