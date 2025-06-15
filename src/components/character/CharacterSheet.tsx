import { ReactNode, useMemo } from "react";
import {
  CharacterClassLevelData,
  CharacterSheetData,
  HitDice,
  MiscProficiency,
} from "../../types/characterSheetData";
import { Movement } from "../../types/movement";
import { Proficiency, SkillsByStat } from "../../types/skills";
import { Stat } from "../../types/stats";

const STANDARD_PRINT_DPI = 96;
const STANDARD_PRINTABLE_WIDTH = 8;
const STANDARD_PRINTABLE_HEIGHT = 10.5;

const PIXEL_WIDTH = STANDARD_PRINT_DPI * STANDARD_PRINTABLE_WIDTH; // 768
const PIXEL_HEIGHT = STANDARD_PRINT_DPI * STANDARD_PRINTABLE_HEIGHT; // 1008

const TopOfSheetValue = ({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) => (
  <div style={{ fontFamily: "monospace", fontSize: 18 }}>
    <b>{label}:</b> {children}
  </div>
);

const classLevelString = (classLevel: CharacterClassLevelData): string =>
  [classLevel.characterSubclass, classLevel.characterClass, classLevel.level]
    .filter((entry) => entry != null)
    .join(" ");
const LevelDisplay = ({
  classLevels,
}: {
  classLevels: CharacterClassLevelData[];
}) => {
  const totalLevel = classLevels.reduce(
    (accum, classLevelsEntry) => accum + classLevelsEntry.level,
    0,
  );
  const isSingleClass = classLevels.length === 1;

  const displayString = useMemo(() => {
    return isSingleClass
      ? classLevelString(classLevels[0])
      : `${totalLevel} (${classLevels.map(classLevelString).join(", ")})`;
  }, [classLevels, isSingleClass, totalLevel]);

  return <span>{displayString}</span>;
};

const movementString = (movement: Movement) =>
  `${movement.type} ${movement.amount}'`;
const MovementDisplay = ({ movement }: { movement: Movement[] }) => {
  return movement.map(movementString).join(", ");
};

const hitDiceString = (hitDice: HitDice) => `${hitDice.number}d${hitDice.size}`;
const HitDiceDisplay = ({ hitDice }: { hitDice: HitDice[] }) => {
  return hitDice.map(hitDiceString).join(" + ");
};

const bonusLabel = (bonus: number) =>
  `${bonus < 0 ? "-" : "+"}${Math.abs(bonus)}`;

const proficiencyDot = (proficient: boolean) => (proficient ? "●" : "○");
const proficiencySymbol = (proficiency: Proficiency) => {
  switch (proficiency) {
    case Proficiency.EXPERTISE:
      return "x";
    case Proficiency.PROFICIENT:
      return "●";
    case Proficiency.NOT_PROFICIENT:
      return "○";
  }
};

const StatValues = ({
  character,
  stat,
}: {
  character: CharacterSheetData;
  stat: Stat;
}) => {
  return (
    <div
      style={{
        border: "solid",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: stat === Stat.STR ? 2 : 1,
        borderRightWidth: stat === Stat.CHA ? 2 : 1,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textAlign: "center",
          width: "100%",
          fontSize: 18,
          fontFamily: "Georgia",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <span>{stat}</span>
      </div>
      <div
        style={{
          borderTop: "solid",
          borderBottom: "solid",
          borderWidth: 2,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              marginLeft: 4,
            }}
          >
            Score:
          </span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              fontWeight: 700,
              marginRight: 4,
              float: "right",
            }}
          >
            {character.stats[stat]}
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              marginLeft: 4,
            }}
          >
            Mod:
          </span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              fontWeight: 700,
              marginRight: 4,
              float: "right",
            }}
          >
            {bonusLabel(character.statMods[stat])}
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              marginLeft: 4,
            }}
          >
            {proficiencyDot(character.saveProficiencies[stat])} Save:
          </span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              fontWeight: 700,
              marginRight: 4,
              float: "right",
            }}
          >
            {bonusLabel(character.saveBonuses[stat])}
          </span>
        </div>
      </div>
      {SkillsByStat[stat].length > 0 && (
        <div style={{ paddingTop: 10, paddingBottom: 10, width: "100%" }}>
          {SkillsByStat[stat].map((skill) => (
            <div key={skill} style={{ width: "100%", height: 14 }}>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  marginLeft: 4,
                  float: "left",
                }}
              >
                {proficiencySymbol(character.skillProficiencies[skill])} {skill}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  marginRight: 4,
                  float: "right",
                }}
              >
                {bonusLabel(character.skillBonuses[skill])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MiscProficienciesDisplay = ({
  miscProficiencies,
}: {
  miscProficiencies: MiscProficiency[];
}) => {
  if (miscProficiencies.length === 0) {
    return null;
  }

  return (
    <div style={{ fontFamily: "monospace", fontSize: 18 }}>
      <b>Other proficiencies:</b>
      <ul>
        {miscProficiencies.map((miscProficiency) => (
          <li key={miscProficiency.name}>
            {miscProficiency.name}
            {miscProficiency.proficiency === Proficiency.EXPERTISE
              ? " (Expertise)"
              : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FeaturesDisplay = ({ features }: { features: string[] }) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <div style={{ fontFamily: "monospace", fontSize: 18 }}>
      <b>Features:</b>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export const CharacterSheet = ({ data }: { data: CharacterSheetData }) => {
  return (
    <div
      style={{
        width: PIXEL_WIDTH,
        height: PIXEL_HEIGHT,
        backgroundColor: "lightgray",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "min-content min-content",
      }}
    >
      <div style={{ gridColumnStart: 1, gridColumnEnd: 7, padding: 4 }}>
        <div style={{ fontFamily: "Georgia", fontSize: 20, fontWeight: 700 }}>
          {data.name}
        </div>
        <TopOfSheetValue label="Level">
          <LevelDisplay classLevels={data.classLevels} />
        </TopOfSheetValue>
        <TopOfSheetValue label="Race">{data.race}</TopOfSheetValue>
        <TopOfSheetValue label="Background">{data.background}</TopOfSheetValue>
        {data.alignment && (
          <TopOfSheetValue label="Alignment">{data.alignment}</TopOfSheetValue>
        )}
        <TopOfSheetValue label="HP">{data.maxHp}</TopOfSheetValue>
        <TopOfSheetValue label="Hit Dice">
          <HitDiceDisplay hitDice={data.hitDice} />
        </TopOfSheetValue>
        <TopOfSheetValue label="AC">{data.armorClass}</TopOfSheetValue>
        <TopOfSheetValue label="PB">
          {bonusLabel(data.proficiencyBonus)}
        </TopOfSheetValue>
        <TopOfSheetValue label="Move">
          <MovementDisplay movement={data.movement} />
        </TopOfSheetValue>
      </div>
      {Object.values(Stat).map((stat) => (
        <StatValues key={stat} character={data} stat={stat} />
      ))}
      <div style={{ gridColumnStart: 1, gridColumnEnd: 7, padding: 4 }}>
        <MiscProficienciesDisplay miscProficiencies={data.miscProficiencies} />
        <FeaturesDisplay features={data.features} />
      </div>
    </div>
  );
};
