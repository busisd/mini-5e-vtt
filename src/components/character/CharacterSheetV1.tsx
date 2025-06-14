import { CalculatedCharacterV1 } from "./characterBuilder";
import { Stat } from "../../types/stats";

const StatBox = ({
  left,
  top,
  label,
  score,
  bonus,
}: {
  left: number;
  top: number;
  label: string;
  score: string;
  bonus: string;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: "80px",
        height: "80px",
        left,
        top,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "60px",
          height: "24px",
          lineHeight: "20px",
          left: 10,
          top: 0,
          textAlign: "center",
          boxSizing: "border-box",
          border: "solid",
          borderWidth: "2px",
          borderColor: "black",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "36px",
          lineHeight: "32px",
          left: 0,
          top: 22,
          textAlign: "center",
          boxSizing: "border-box",
          border: "solid",
          borderWidth: "2px",
          borderColor: "black",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            fontSize: "26px",
            fontFamily: "monospace",
          }}
        >
          {bonus}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          width: "60px",
          height: "24px",
          lineHeight: "20px",
          left: 10,
          top: 24 + 32,
          textAlign: "center",
          boxSizing: "border-box",
          border: "solid",
          borderWidth: "2px",
          borderColor: "black",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontFamily: "monospace",
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

const StatBoxes = ({ character }: { character: CalculatedCharacterV1 }) => {
  return (
    <>
      <StatBox
        left={20}
        top={10}
        label="STR"
        bonus={bonusLabel(character.statMods[Stat.STR])}
        score={character.stats[Stat.STR].toString()}
      />
      <StatBox
        left={120}
        top={10}
        label="DEX"
        bonus={bonusLabel(character.statMods[Stat.DEX])}
        score={character.stats[Stat.DEX].toString()}
      />
      <StatBox
        left={220}
        top={10}
        label="CON"
        bonus={bonusLabel(character.statMods[Stat.CON])}
        score={character.stats[Stat.CON].toString()}
      />
      <StatBox
        left={320}
        top={10}
        label="INT"
        bonus={bonusLabel(character.statMods[Stat.INT])}
        score={character.stats[Stat.INT].toString()}
      />
      <StatBox
        left={420}
        top={10}
        label="WIS"
        bonus={bonusLabel(character.statMods[Stat.WIS])}
        score={character.stats[Stat.WIS].toString()}
      />
      <StatBox
        left={520}
        top={10}
        label="CHA"
        bonus={bonusLabel(character.statMods[Stat.CHA])}
        score={character.stats[Stat.CHA].toString()}
      />
    </>
  );
};

const bonusLabel = (bonus: number) =>
  `${bonus < 0 ? "-" : "+"}${Math.abs(bonus)}`;

const SaveBox = ({
  label,
  bonus,
  proficient,
  left,
  top,
}: {
  label: string;
  bonus: string;
  proficient: boolean;
  left: number;
  top: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100px",
        height: "20px",
        left,
        top,
        textAlign: "left",
      }}
    >
      <span
        style={{
          fontSize: "20px",
          fontFamily: "monospace",
        }}
      >
        {proficient ? "•" : "◦"}
        {label}: {bonus}
      </span>
    </div>
  );
};

export const CharacterSheetV1 = ({
  character,
}: {
  character: CalculatedCharacterV1;
}) => {
  return (
    <div
      style={{
        width: "620px",
        height: "800px",
        backgroundColor: "lightgray",
        position: "relative",
      }}
    >
      <StatBoxes character={character} />
      <div
        style={{
          position: "absolute",
          width: 160,
          height: "22px",
          lineHeight: "20px",
          left: 80,
          top: 98,
          textAlign: "center",
          boxSizing: "border-box",
          border: "solid",
          borderWidth: "2px",
          borderColor: "black",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          Saving throws
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 124,
          left: 20,
          top: 120,
          boxSizing: "border-box",
          border: "solid",
          borderWidth: 2,
          borderRadius: 5,
        }}
      >
        <SaveBox
          label={"STR"}
          bonus={bonusLabel(character.saveBonuses[Stat.STR])}
          proficient={character.saveProficiencies[Stat.STR]}
          left={10}
          top={10}
        />
        <SaveBox
          label={"DEX"}
          bonus={bonusLabel(character.saveBonuses[Stat.DEX])}
          proficient={character.saveProficiencies[Stat.DEX]}
          left={10}
          top={50}
        />
        <SaveBox
          label={"CON"}
          bonus={bonusLabel(character.saveBonuses[Stat.CON])}
          proficient={character.saveProficiencies[Stat.CON]}
          left={10}
          top={90}
        />
        <SaveBox
          label={"INT"}
          bonus={bonusLabel(character.saveBonuses[Stat.INT])}
          proficient={character.saveProficiencies[Stat.INT]}
          left={150}
          top={10}
        />
        <SaveBox
          label={"WIS"}
          bonus={bonusLabel(character.saveBonuses[Stat.WIS])}
          proficient={character.saveProficiencies[Stat.WIS]}
          left={150}
          top={50}
        />
        <SaveBox
          label={"CHA"}
          bonus={bonusLabel(character.saveBonuses[Stat.CHA])}
          proficient={character.saveProficiencies[Stat.CHA]}
          left={150}
          top={90}
        />
      </div>
    </div>
  );
};
