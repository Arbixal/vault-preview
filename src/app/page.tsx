"use client"

import { useState, useEffect, FormEvent } from "react";
import CharacterPanel, { Character } from "./_components/characterPanel";

function characterKey(character: Character): string {
  return `${character.region}-${character.realm}-${character.name}`;
}

export default function Home() {

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const normalizedRealm = realm.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();

    if (!normalizedRealm || !normalizedName) {
      setFormError("Enter both a realm and a character name.");
      return;
    }

    const newCharacter = { region, realm: normalizedRealm, name: normalizedName };

    if (characters.some((character) => characterKey(character) === characterKey(newCharacter))) {
      setFormError("That character is already being tracked.");
      return;
    }

    setCharacters((existing) => {
      const newArray = [...existing, newCharacter];
      localStorage.setItem("characters", JSON.stringify(newArray));
      return newArray;
    });

    setRealm("");
    setName("");
    setFormError("");
  }

  const handleRemove = (characterToRemove: Character) => {
    setCharacters(existing => {
      const removedKey = characterKey(characterToRemove);
      const newArray = existing.filter((character) => characterKey(character) !== removedKey);
      localStorage.setItem("characters", JSON.stringify(newArray));

      return newArray;
    });
  }

  const [region, setRegion] = useState("us");
  const [realm, setRealm] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("characters");
      const initialValue = JSON.parse(saved ?? "[]");

      if (Array.isArray(initialValue)) {
        setCharacters(initialValue);
      }
    } catch {
      localStorage.removeItem("characters");
    } finally {
      setIsHydrated(true);
    }
  }, [])

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-6 text-neutral-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl border border-neutral-700 bg-neutral-900 text-sm font-black tracking-[-0.12em] text-neutral-200">GV</div>
            <div>
              <div className="text-sm font-black tracking-[0.16em]">VAULT / PREVIEW</div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Azeroth progression desk</div>
            </div>
          </div>
          <div className="hidden rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-neutral-400 sm:block">Midnight · Season 2</div>
        </header>

        <section className="grid items-center gap-6 py-10 md:grid-cols-[1fr_220px] lg:py-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Great Vault intelligence</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-100 sm:text-5xl lg:text-6xl">Know what your next Vault can be.</h1>
            <p className="mt-4 max-w-2xl text-base leading-6 text-neutral-500">Track raid, Mythic+, and Delve progress across your characters. Add a character to turn a week of runs into a clear set of choices.</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl shadow-black/20">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Live data set</div>
            <strong className="mt-1 block text-2xl font-black tracking-[-0.05em] text-amber-300">Season 2</strong>
            <small className="block text-neutral-500">Midnight · API season 18</small>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] text-neutral-300"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> API online</div>
          </div>
        </section>

        <form className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4" onSubmit={handleSubmit} aria-busy={!isHydrated}>
          <fieldset className="contents" disabled={!isHydrated}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[130px_1fr_1fr_auto] lg:items-end">
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500" htmlFor="region">Region</label>
              <select className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-neutral-100 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-700" id="region" name="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="us">US</option>
                <option value="eu">EU</option>
                <option value="kr">KR</option>
                <option value="tw">TW</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500" htmlFor="realm">Realm</label>
              <input className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-700" id="realm" name="realm" placeholder="Nagrand" value={realm} onChange={(e) => setRealm(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500" htmlFor="character">Character</label>
              <input className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-700" id="character" name="character" placeholder="Bixposter" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button className="rounded-lg border border-neutral-500 bg-neutral-100 px-5 py-2.5 font-bold text-neutral-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900" type="submit">Add character</button>
            </div>
          </fieldset>
          {!isHydrated && <p className="mt-3 text-sm text-neutral-600">Loading saved characters...</p>}
          {formError && <p className="mt-3 text-sm text-red-300" role="alert">{formError}</p>}
        </form>

        {characters.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500"><span className="mr-1 uppercase tracking-[0.08em]">Saved characters</span>{characters.map((character) => <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-neutral-400" key={characterKey(character)}>{character.region.toUpperCase()} · {character.name} · {character.realm}</span>)}</div>}

        {characters.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 px-6 py-12 text-center"><p className="text-lg font-semibold text-neutral-300">Your Vault desk is empty.</p><p className="mt-2 text-sm text-neutral-600">Add a character above to start tracking this week&apos;s progress.</p></div>}

        <div className={`mx-auto mt-5 grid w-full gap-5 ${characters.length > 1 ? "xl:grid-cols-2" : "max-w-6xl"}`}>
          {characters.map((character) => <CharacterPanel character={character} key={characterKey(character)} onRemove={() => handleRemove(character)} />)}
        </div>
      </div>
    </main>
  );
}
