import useSWR from "swr";
import MythicPlusPanel, { DungeonData } from "./mythicPlusPanel";
import RaidPanel, { RaidData } from "./raidPanel";
import MessagePanel from "./messagePanel";

interface ICharacterPanelProps {
    character: Character;
}

export interface Character {
    region: string;
    name: string;
    realm: string;
}

export interface CharacterData {
    raid: RaidData;
    dungeons: DungeonData;
}

export default function CharacterPanel({character} : ICharacterPanelProps)
{
  const dataUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/vault-progress/${character.region}/${character.realm}/${character.name}`;
  const {data, error, isLoading} = useSWR(dataUrl, (url) => fetch(url).then((res) => res.json()));
 
  const characterData = data?.[`${character.name}-${character.realm}`]

  var classColour = "poor";

  if (characterData)
  {
    classColour = characterData.player_class;
  }

  var childElements = (
    <>
      <RaidPanel data={characterData?.raid} loading={isLoading} />

      <MythicPlusPanel data={characterData?.dungeons} loading={isLoading} />
    </>
  );

  if (error) {
    childElements = <MessagePanel message={"An error occured while loading data for this character."} />
  }

    return (
        <div className={`flex font-sans border rounded max-w-fit m-3 p-2 bg-${classColour}/15 border-${classColour}`}>
          <div className="flex-auto">
            <h1 className={`text-lg font-semibold capitalize text-${classColour}`}>{character.name} <span className={`text-sm text-${classColour}/50`}>{character.realm}</span></h1>
            <div className="flex-col text-center">
              {childElements}
            </div>
          </div>
        </div>
    )
}