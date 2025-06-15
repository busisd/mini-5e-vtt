import { useEffect, useMemo, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import {
  CharacterClass,
  CharacterClassLevels,
  ClassHitDie,
} from "../../types/characterClasses";
import { Stat, StatArray } from "../../types/stats";
import { generateCharacterSheetDataAtEachLevel } from "./characterBuilder";
import { CharacterSheet } from "./CharacterSheet";
import { exampleCharacterSheetData } from "./exampleCharacters";

const defaultBaseStats = Object.fromEntries(
  Object.values(Stat).map((stat) => [stat, "10"]),
);

export type LevelChoices = {
  characterClass: CharacterClass;
  hp: number;
  asis?: Stat[];
};

export type CharacterGeneratorFormData = {
  // Relevant to final output
  characterName?: string;
  baseStats: StatArray;
  levelChoices: LevelChoices[];

  // Used within the form itself
  characterClassToAdd: CharacterClass;
};

const levelsInClass = (
  characterClass: CharacterClass,
  chosenClasses: LevelChoices[],
) =>
  chosenClasses.filter(
    (chosenClass) => chosenClass.characterClass === characterClass,
  ).length;

export const CharacterGeneratorView = ({
  onSubmitCallback,
}: {
  onSubmitCallback?: (data: CharacterGeneratorFormData) => void;
}) => {
  const { register, handleSubmit, getValues, watch, setValue } =
    useForm<CharacterGeneratorFormData>({
      defaultValues: {
        baseStats: { ...defaultBaseStats },
        characterClassToAdd: CharacterClass.FIGHTER,
        levelChoices: [],
      },
    });
  const addedLevels = watch("levelChoices");

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
          onSubmitCallback?.(data as CharacterGeneratorFormData);
        })}
      >
        <p>
          <label htmlFor="characterName">Name:</label>{" "}
          <input id="characterName" {...register("characterName")} />
        </p>
        <p>
          <select {...register("characterClassToAdd")}>
            {Object.values(CharacterClass).map((characterClass) => (
              <option key={characterClass} value={characterClass}>
                {characterClass}
              </option>
            ))}
          </select>{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const addedClass: CharacterClass = getValues(
                "characterClassToAdd",
              );
              const totalLevels = addedLevels.length;

              setValue("levelChoices", [
                ...addedLevels,
                {
                  characterClass: addedClass,
                  hp:
                    totalLevels === 0
                      ? ClassHitDie[addedClass]
                      : ClassHitDie[addedClass] / 2 + 1,
                },
              ]);
            }}
          >
            Add level
          </button>
        </p>
        <b>Starting stats:</b>
        <BaseStatsSelector register={register} />
        {addedLevels.map((levelChoices: LevelChoices, levelIndex: number) => (
          <LevelChoicesSelector
            register={register}
            levelChoices={levelChoices}
            levelIndex={levelIndex}
            allLevelChoices={addedLevels}
            key={`levelChoices.${levelIndex}`}
          />
        ))}
        <input type="submit" />
      </form>
    </>
  );
};

type FormSectionProps = {
  register: UseFormRegister<CharacterGeneratorFormData>;
};

const BaseStatsSelector = ({ register }: FormSectionProps) => {
  return Object.values(Stat).map((stat) => (
    <div key={stat} style={{ width: 300, height: 30 }}>
      <label style={{ float: "left" }} htmlFor={`starting-${stat}`}>
        {stat}:{" "}
      </label>
      <input
        style={{ float: "right" }}
        type="number"
        id={`starting-${stat}`}
        min={1}
        max={20}
        {...register(`baseStats.${stat}`, { valueAsNumber: true })}
      />
    </div>
  ));
};

const LevelChoicesSelector = ({
  register,
  levelChoices,
  levelIndex,
  allLevelChoices,
}: FormSectionProps & {
  levelChoices: LevelChoices;
  levelIndex: number;
  allLevelChoices: LevelChoices[];
}) => {
  const chosenClassLevel = levelsInClass(
    levelChoices.characterClass,
    allLevelChoices.slice(0, levelIndex + 1),
  );

  const miscFeatures =
    CharacterClassLevels[levelChoices.characterClass][chosenClassLevel];

  return (
    <div>
      <h3>
        Level {levelIndex + 1} ({levelChoices.characterClass} {chosenClassLevel}
        ):
      </h3>
      <div style={{ width: 300, height: 30 }}>
        <label
          style={{ float: "left" }}
          htmlFor={`levelChoices.${levelIndex}.id`}
        >
          HP for level (1d{ClassHitDie[levelChoices.characterClass]}):{" "}
        </label>
        <input
          style={{ float: "right" }}
          type="number"
          id={`levelChoices.${levelIndex}.id`}
          min={1}
          max={ClassHitDie[levelChoices.characterClass]}
          {...register(`levelChoices.${levelIndex}.hp`, {
            valueAsNumber: true,
          })}
        />
      </div>
      {chosenClassLevel % 4 === 0 && (
        <>
          <div style={{ width: 300, height: 30 }}>
            <label
              style={{ float: "left" }}
              htmlFor={`levelChoices.${levelIndex}.asi1`}
            >
              ASI 1:{" "}
            </label>
            <select
              style={{ float: "right" }}
              {...register(`levelChoices.${levelIndex}.asis.0`)}
            >
              {Object.values(Stat).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: 300, height: 30 }}>
            <label
              style={{ float: "left" }}
              htmlFor={`levelChoices.${levelIndex}.asi1`}
            >
              ASI 2:{" "}
            </label>
            <select
              style={{ float: "right" }}
              {...register(`levelChoices.${levelIndex}.asis.1`)}
            >
              {Object.values(Stat).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      {miscFeatures?.length > 0 && (
        <>
          <b>Features:</b>
          <ul>
            {miscFeatures.map((miscFeature) => (
              <li key={`${miscFeature.id}`}>
                {miscFeature.id} {miscFeature.tier && `(${miscFeature.tier})`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export const CharacterSheetAndGeneratorView = () => {
  const [calculatedCharacter, setCalculatedCharacter] = useState([
    exampleCharacterSheetData,
  ]);

  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      levelToView: 0,
    },
  });
  const levelToView = watch("levelToView");

  const levelViewOptions = useMemo(() => {
    return calculatedCharacter.map((_character, charLevel) => (
      <option key={charLevel} value={charLevel}>
        Level {charLevel + 1}
      </option>
    ));
  }, [calculatedCharacter]);

  /**
   * We do this in a separate use-effect to avoid race condition between changing
   * available selection options and setting the chosen option in the select
   */
  useEffect(() => {
    setValue("levelToView", levelViewOptions.length - 1);
  }, [levelViewOptions, setValue]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 150,
      }}
    >
      <CharacterGeneratorView
        onSubmitCallback={(formData) => {
          const calculatedImportedCharacter =
            generateCharacterSheetDataAtEachLevel(formData);
          if (calculatedImportedCharacter.length > 0) {
            setCalculatedCharacter(calculatedImportedCharacter);
          }
        }}
      />
      <div>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <label htmlFor="levelToView">See character at: </label>
          <select
            id="levelToView"
            {...register("levelToView", { valueAsNumber: true })}
          >
            {levelViewOptions}
          </select>
        </form>
        <br />
        <CharacterSheet data={calculatedCharacter[levelToView]} />
      </div>
    </div>
  );
};
