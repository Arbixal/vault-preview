"use client"

import { useState, MouseEvent, FormEvent } from "react";
import CharacterPanel, { Character } from "./_components/characterPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";

function getCharacters(): Character[] {
  return [
    //{"region": "us", "name": "bixshift", "realm": "nagrand"},
    //{"region": "us", "name": "bixsham", "realm": "nagrand"},
    //{"region": "us", "name": "bixmonk", "realm": "nagrand"},
    //{"region": "us", "name": "bixpriest", "realm": "nagrand"},
    //{"region": "us", "name": "bixadin", "realm": "nagrand"},
    //{"region": "us", "name": "bixvoker", "realm": "nagrand"},
    //{"region": "us", "name": "bixikong", "realm": "nagrand"},
  ]
}

export default function Home() {

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (realm !== null && name !== null) {
      setCharacters(existing => [...existing, { "region": region.toLowerCase(), "realm": realm.toLowerCase(), "name": name.toLowerCase()}]);
    }
    
    e.currentTarget.reset();
  }

  const handleRemove = (realm: string, name: string) => {
    setCharacters(existing => existing.filter(x => x.realm !== realm || x.name !== name));
  }

  const [region, setRegion] = useState("us");
  const [realm, setRealm] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [characters, setCharacters] = useState(getCharacters());

  return (
    <main className="flex flex-col items-center p-5">
      <h1 className="text-2xl">Great Vault Preview</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mt-3 mb-3">
            <div className="flex flex-col">
                <label className="text-sm">Region</label>
                <select className="bg-neutral-700" name="region" onChange={(e) => setRegion(e.target.value)}>
                    <option value="us">US</option>
                    <option value="eu">EU</option>
                    <option value="kr">KR</option>
                    <option value="tw">TW</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-sm">Realm</label>
                <input className="bg-neutral-700" type="text" onChange={(e) => setRealm(e.target.value)} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm">Character</label>
                <input className="bg-neutral-700" type="text" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm">&nbsp;</label>
                <button className="hover:bg-neutral-700 pl-1 pr-1" type="submit">Add</button>
            </div>
        </div>
      </form>
      <div className="flex flex-wrap justify-center">
      {characters.map(x => (
        <div key={`${x.name}-${x.realm}`} className="relative">
          <CharacterPanel character={x} />
          <FontAwesomeIcon icon={faXmark} className="fa-solid absolute top-5 right-5 cursor-pointer hover:text-red-500" onClick={() => handleRemove(x.realm, x.name)} />
        </div>
      ))}
      </div>
    </main>
  );
}
