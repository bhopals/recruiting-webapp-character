import React, { useState, useEffect } from "react";
import { getCharacters, saveCharacters } from "./services/api";
import CharacterCard from "./components/CharacterCard";
import { Character } from "./types";

import "./App.css";
import SkillCheck from "./components/SkillCheck";

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      const data = await getCharacters();
      const characters = data?.body?.characters;
      if (!!characters?.length) setCharacters(characters);
    };
    loadCharacters();
  }, []);

  const handleSaveAllCharacters = async () => {
    await saveCharacters({ characters });
  };

  const handleAddCharacter = () => {
    const newCharacter: Character = {
      attributes: {
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10,
      },
      skills: {},
    };
    setCharacters([...characters, newCharacter]);
  };

  const handleRemoveAllCharacters = () => {
    setCharacters([]);
  };

  const handleUpdateCharacter = (
    index: number,
    updatedCharacter: Character
  ) => {
    characters[index] = updatedCharacter;
    setCharacters([...characters]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Management</h1>

        <div className="App-actions">
          <button onClick={handleAddCharacter}>Add New Character</button>
          <button onClick={handleRemoveAllCharacters}>
            Remove All Characters
          </button>
          <button onClick={handleSaveAllCharacters}>Save All Characters</button>
        </div>
      </header>

      <div className="App-section">
        {characters.map((character, index) => (
          <div key={index} className="character-container">
            <h2>Character {index + 1}</h2>
            <SkillCheck character={character} />
            <CharacterCard
              character={character}
              onSave={(character) => handleUpdateCharacter(index, character)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
