import {
  CalculatedCharacter,
  exampleCalculatedCharacter,
} from "../types/characterBuilder";
import { Stat } from "../types/stats";

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

const bonusLabel = (bonus: number) =>
  `${bonus < 0 ? "-" : "+"}${Math.abs(bonus)}`;

const CharacterSheet = ({ character }: { character: CalculatedCharacter }) => {
  return (
    <div
      style={{
        width: "620px",
        height: "800px",
        backgroundColor: "lightgray",
        position: "relative",
      }}
    >
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
      <StatBox
        left={20}
        top={100}
        label="STR"
        bonus={bonusLabel(character.saveBonuses[Stat.STR])}
        score={"Save"}
      />
      <StatBox
        left={120}
        top={100}
        label="DEX"
        bonus={bonusLabel(character.saveBonuses[Stat.DEX])}
        score={"Save"}
      />
      <StatBox
        left={220}
        top={100}
        label="CON"
        bonus={bonusLabel(character.saveBonuses[Stat.CON])}
        score={"Save"}
      />
      <StatBox
        left={320}
        top={100}
        label="INT"
        bonus={bonusLabel(character.saveBonuses[Stat.INT])}
        score={"Save"}
      />
      <StatBox
        left={420}
        top={100}
        label="WIS"
        bonus={bonusLabel(character.saveBonuses[Stat.WIS])}
        score={"Save"}
      />
      <StatBox
        left={520}
        top={100}
        label="CHA"
        bonus={bonusLabel(character.saveBonuses[Stat.CHA])}
        score={"Save"}
      />
    </div>
  );
};

export const CharacterBuilderView = () => {
  return (
    <>
      <CharacterSheet character={exampleCalculatedCharacter[3]} />
      <textarea
        style={{ width: "620px", height: "60px" }}
        value={JSON.stringify(exampleCalculatedCharacter, null, 2)}
        readOnly
      />
    </>
  );
};
