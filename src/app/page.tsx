import CharacterPanel, { Character } from "./_components/characterPanel";

async function getData(): Promise<{ [key: string]: any }>  {
  return {
    "bixshift": {
      "raid": {
        "gnarlroot": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "igira": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "volocross": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "larodar": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "council": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "nymue": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "smolderon": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "tindral": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "fyrakk": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
      },
      "dungeons": [
        { "level": 18, "name": "Darkheart Thicket"},
        { "level": 18, "name": "Waycrest"},
        { "level": 18, "name": "Black Rook Hold"},
        { "level": 17, "name": "Throne of Tides"},
      ],
    },
    "bixsham": {
      "raid": {
        "gnarlroot": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "igira": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "volocross": {
          "mythic": false,
          "heroic": true,
          "normal": false,
          "lfr": false,
        },
        "larodar": {
          "mythic": false,
          "heroic": false,
          "normal": true,
          "lfr": false,
        },
        "council": {
          "mythic": false,
          "heroic": false,
          "normal": true,
          "lfr": false,
        },
        "nymue": {
          "mythic": false,
          "heroic": false,
          "normal": false,
          "lfr": false,
        },
        "smolderon": {
          "mythic": false,
          "heroic": false,
          "normal": false,
          "lfr": false,
        },
        "tindral": {
          "mythic": false,
          "heroic": false,
          "normal": false,
          "lfr": false,
        },
        "fyrakk": {
          "mythic": false,
          "heroic": false,
          "normal": false,
          "lfr": false,
        },
      },
      "dungeons": [
        { "level": 18, "name": "Darkheart Thicket"},
        { "level": 17, "name": "Darkheart Thicket"},
        { "level": 17, "name": "Darkheart Thicket"},
        { "level": 16, "name": "Darkheart Thicket"},
        { "level": 14, "name": "Darkheart Thicket"},
        { "level": 13, "name": "Darkheart Thicket"},
        { "level": 12, "name": "Darkheart Thicket"},
        { "level": 11, "name": "Darkheart Thicket"},
        { "level": 7, "name": "Darkheart Thicket"},
      ]
    }
  }
}

function getCharacters(): Character[] {
  return [
    {"name": "bixshift", "realm": "nagrand", "player_class": "druid"},
    {"name": "bixsham", "realm": "nagrand", "player_class": "shaman"},
    {"name": "bixmonk", "realm": "nagrand", "player_class": "monk"},
    {"name": "bixpriest", "realm": "nagrand", "player_class": "priest"},
    {"name": "bixadin", "realm": "nagrand", "player_class": "paladin"},
    {"name": "bixvoker", "realm": "nagrand", "player_class": "evoker"},
    {"name": "bixikong", "realm": "nagrand", "player_class": "deathknight"},
    {"name": "bixmage", "realm": "nagrand", "player_class": "mage"},
  ]
}

export default async function Home() {
  const data = await getData();
  const characters = getCharacters();

  return (
    <main className="flex flex-col items-center justify-between space-y-5 p-5">
      <h1>Great Vault Preview</h1>
      {characters.map(x => (
        <CharacterPanel key={x.name} character={x} data={data[x.name]} />
      ))}
    </main>
  );
}
