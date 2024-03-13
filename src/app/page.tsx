"use client"

import CharacterPanel, { Character } from "./_components/characterPanel";

function getCharacters(): Character[] {
  return [
    {"region": "us", "name": "bixshift", "realm": "nagrand", "player_class": "druid"},
    {"region": "us", "name": "bixsham", "realm": "nagrand", "player_class": "shaman"},
    {"region": "us", "name": "bixmonk", "realm": "nagrand", "player_class": "monk"},
    {"region": "us", "name": "bixpriest", "realm": "nagrand", "player_class": "priest"},
    {"region": "us", "name": "bixadin", "realm": "nagrand", "player_class": "paladin"},
    {"region": "us", "name": "bixvoker", "realm": "nagrand", "player_class": "evoker"},
    {"region": "us", "name": "bixikong", "realm": "nagrand", "player_class": "deathknight"},
    {"region": "us", "name": "bixmage", "realm": "nagrand", "player_class": "mage"},
  ]
}

export default function Home() {
  const characters = getCharacters();

  return (
    <main className="flex flex-col items-center justify-between space-y-5 p-5">
      <h1>Great Vault Preview</h1>
      {characters.map(x => (
        <CharacterPanel key={`${x.name}-${x.realm}`} character={x} />
      ))}
    </main>
  );
}
