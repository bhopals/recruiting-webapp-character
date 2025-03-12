import React, { useMemo, useState } from "react";
import { SKILL_LIST } from "../consts";
import { Character } from "../types";
import "./SkillCheck.css";

type Props = { character: Character; name?: string };

const SkillCheck: React.FC<Props> = ({ character, name }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(SKILL_LIST[0].name);
  const [dc, setDc] = useState<number>(20);
  const [roll, setRoll] = useState<number>(0);

  const rollSkillCheck = () => {
    setRoll(Math.floor(Math.random() * 20) + 1);
  };

  const total = useMemo(
    () => roll + (character.skills[selectedSkill] || 0),
    [roll, character.skills, selectedSkill]
  );

  return (
    <div className="skill-check-container">
      <h3 className="title">Skill Check</h3>
      <div className="input-container">
        <label className="label">Skill:</label>
        <select className="select" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
          {SKILL_LIST.map((skill) => (
            <option key={skill.name} value={skill.name}>{skill.name}</option>
          ))}
        </select>

        <label className="label">DC:</label>
        <input
          type="number"
          className="input"
          value={dc}
          onChange={(e) => setDc(Number(e.target.value))}
        />

        <button className="button" onClick={rollSkillCheck}>Roll</button>
      </div>

      {roll > 0 && (
        <div className="result-container">
          {name && <div className="label">Character: {name}</div>}
          <div className="label">Skill: {selectedSkill}: {character.skills[selectedSkill] ?? 0}</div>
          <div className="label">You Rolled: {roll}</div>
          <div className="label">The DC Was: {dc}</div>
          <div className="label result">Result: {total >= dc ? "Successful" : "Failure"}</div>
        </div>
      )}
    </div>
  );
};

export default SkillCheck;