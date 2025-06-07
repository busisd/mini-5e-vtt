import {
  CalculatedCharacter,
  exampleCalculatedCharacter,
} from "../types/characterBuilder";
import { Proficiency, SkillsByStat } from "../types/skills";
import { Stat } from "../types/stats";

const STANDARD_PRINT_DPI = 96;
const STANDARD_PRINTABLE_WIDTH = 8;
const STANDARD_PRINTABLE_HEIGHT = 10.5;

const PIXEL_WIDTH = STANDARD_PRINT_DPI * STANDARD_PRINTABLE_WIDTH; // 768
const PIXEL_HEIGHT = STANDARD_PRINT_DPI * STANDARD_PRINTABLE_HEIGHT; // 1008

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
  character: CalculatedCharacter;
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

const CharacterSheet = ({ character }: { character: CalculatedCharacter }) => (
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
        Placeholder name
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 18 }}>
        Level: {character.totalLevel}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 18 }}>
        HP: {character.maxHp}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 18 }}>AC: {10}</div>
      <div style={{ fontFamily: "monospace", fontSize: 18 }}>
        PB: {bonusLabel(character.proficiencyBonus)}
      </div>
    </div>
    {Object.values(Stat).map((stat) => (
      <StatValues key={stat} character={character} stat={stat} />
    ))}
  </div>
);

export const CharacterSheetView = ({
  calculatedCharacter = exampleCalculatedCharacter[3],
}: {
  calculatedCharacter?: CalculatedCharacter;
}) => {
  // const [calculatedCharacter, setCalculatedCharacter] = useState(
  //   exampleCalculatedCharacter[3],
  // );
  // console.log('example', exampleCalculatedCharacter)

  // const { register, handleSubmit } =
  //   useForm<FieldValues>({
  //     defaultValues: {
  //       importedCharacter: "",
  //     },
  //   });

  return (
    <>
      {/* <form
        onSubmit={handleSubmit((data) => {
          const parsedCharacter: CharacterGeneratorFormData = JSON.parse(
            data.importedCharacter,
          );

          const calculatedImportedCharacter = generateCharacterAtEachLevel(
            parsedCharacter.baseStats,
            parsedCharacter.levelChoices,
          );
          console.log(calculatedImportedCharacter);
          setCalculatedCharacter(
            calculatedImportedCharacter[calculatedImportedCharacter.length - 1],
          );
        })}
      >
        <textarea {...register("importedCharacter")} />
        <input type="submit" />
      </form> */}
      <CharacterSheet character={calculatedCharacter} />
    </>
  );
};
