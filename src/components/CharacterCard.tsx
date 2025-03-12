import { useMemo, useState } from "react";
import {
  ATTRIBUTE_LIST,
  CLASS_LIST,
  SKILL_LIST,
  MAX_ATTRIBUTE_TOTAL,
} from "../consts";
import { Attributes, Character, Class } from "../types";
import { getModifier } from "../services/utils";
import "./CharacterCard.css";

interface Props {
  character: Character;
  onSave: (character: Character) => void;
}

function CharacterCard({ character, onSave }: Props) {
  const [attributes, setAttributes] = useState<Attributes>(
    character.attributes
  );
  const [skills, setSkills] = useState<{ [key: string]: number }>(
    character.skills || {}
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const totalAttributes = Object.values(attributes).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalSkillPoints = 10 + 4 * getModifier(attributes.Intelligence);
  const totalSkills = useMemo(() => {
    const result = { ...(skills || {}) };
    for (const skill of SKILL_LIST) {
      const skillModifier = getModifier(
        attributes[skill.attributeModifier as keyof Attributes]
      );
      result[skill.name] = (skills[skill.name] || 0) + skillModifier;
    }
    return result;
  }, [skills, attributes]);
  const currentSkillPoints = Object.values(totalSkills).reduce(
    (sum, val) => sum + val,
    0
  );

  const handleAttributeChange = (attr: string, change: number): void => {
    const newValue = attributes[attr] + change;
    if (newValue >= 0 && totalAttributes + change <= MAX_ATTRIBUTE_TOTAL) {
      const newAttributes = { ...attributes, [attr]: newValue };
      setAttributes(newAttributes);
      onSave?.({ ...character, attributes: newAttributes });
    }
  };

  const handleSkillChange = (skill: string, change: number): void => {
    if (
      (change > 0 && currentSkillPoints < totalSkillPoints) ||
      (change < 0 && (skills[skill] || 0) > 0)
    ) {
      const newSkills = { ...skills, [skill]: (skills[skill] || 0) + change };
      setSkills(newSkills);

      onSave?.({ ...character, skills: newSkills });
    }
  };

  const eligibleClasses = (Object.keys(CLASS_LIST) as Class[]).filter(
    (charClass) =>
      Object.entries(CLASS_LIST[charClass]).every(
        ([attr, min]) => attributes[attr as keyof Attributes] >= min
      )
  );

  return (
    <div className="character-content">
      <section className="attribute-list">
        <h3>Attributes</h3>
        {ATTRIBUTE_LIST.map((attr) => (
          <div key={attr} className="attribute-item">
            <span>
              {attr}: {attributes[attr]} (Modifier:{" "}
              {getModifier(attributes[attr])})
            </span>
            <button onClick={() => handleAttributeChange(attr, 1)}>+</button>
            <button onClick={() => handleAttributeChange(attr, -1)}>-</button>
          </div>
        ))}
      </section>

      <section className="class-list">
        <h3>Available Classes</h3>
        {Object.keys(CLASS_LIST).map((charClass) => (
          <div
            key={charClass}
            className={`class-item ${
              eligibleClasses.includes(charClass as Class) ? "eligible" : ""
            }`}
            onClick={() => setSelectedClass(charClass)}
          >
            {charClass}
          </div>
        ))}

        {selectedClass && (
          <div className="class-requirements">
            <h3>{selectedClass} Minimum Requirements</h3>
            {Object.keys(CLASS_LIST[selectedClass]).map((attr) => (
              <div key={attr}>
                {attr}: {CLASS_LIST[selectedClass][attr]}
              </div>
            ))}
            <button onClick={() => setSelectedClass(null)}>Close</button>
          </div>
        )}
      </section>

      <section className="skill-list">
        <h3>Skills</h3>
        <p>
          Total Skill Points: {currentSkillPoints}/{totalSkillPoints}
        </p>
        {SKILL_LIST.map((skill) => (
          <div key={skill.name} className="skill-item">
            <span>
              {skill.name}: {skills[skill.name] || 0} (Modifier-
              {skill.attributeModifier}:{" "}
              {getModifier(
                attributes[skill.attributeModifier as keyof Attributes]
              )}
              ) &nbsp;
              <button onClick={() => handleSkillChange(skill.name, 1)}>
                +
              </button>
              <button onClick={() => handleSkillChange(skill.name, -1)}>
                -
              </button>
              &nbsp; Total: {totalSkills[skill.name]}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default CharacterCard;
