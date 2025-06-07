import { FieldValues, useForm } from "react-hook-form";
import { Stat, StatArray } from "../types/stats";
import {
  CharacterClass,
  ClassHitDie,
} from "../types/characterClasses/characterClasses";
import { CharacterSheetView } from "./CharacterSheetView";
import { useState } from "react";
import {
  basicFighter,
  generateCharacterAtEachLevel,
} from "../types/characterBuilder";

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
    useForm<FieldValues>({
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
        {Object.values(Stat).map((stat) => (
          <div key={stat} style={{ width: 300, height: 30 }}>
            <label style={{ float: "left" }} htmlFor={`starting-${stat}`}>
              {stat}:{" "}
            </label>
            <input
              style={{ float: "right" }}
              type="number"
              id={`starting-${stat}`}
              {...register(`baseStats.${stat}`, { valueAsNumber: true })}
            />
          </div>
        ))}
        {addedLevels.map((levelChoices: LevelChoices, levelIndex: number) => {
          const idPrefix = `levelChoices.${levelIndex}`;
          const hpId = `${idPrefix}.hp`;
          const chosenClassLevel = levelsInClass(
            levelChoices.characterClass,
            addedLevels.slice(0, levelIndex + 1),
          );
          return (
            <div key={idPrefix}>
              <b>
                Level {levelIndex + 1} ({levelChoices.characterClass}{" "}
                {chosenClassLevel}):
              </b>
              <div style={{ width: 300, height: 30 }}>
                <label style={{ float: "left" }} htmlFor={hpId}>
                  HP for level (1d{ClassHitDie[levelChoices.characterClass]}):{" "}
                </label>
                <input
                  style={{ float: "right" }}
                  type="number"
                  id={hpId}
                  min={1}
                  max={ClassHitDie[levelChoices.characterClass]}
                  {...register(`${idPrefix}.hp`, { valueAsNumber: true })}
                />
              </div>
              {chosenClassLevel % 4 === 0 && (
                <>
                  <div style={{ width: 300, height: 30 }}>
                    <label
                      style={{ float: "left" }}
                      htmlFor={`${idPrefix}.asi1`}
                    >
                      ASI 1:{" "}
                    </label>
                    <select
                      style={{ float: "right" }}
                      {...register(`${idPrefix}.asis[0]`)}
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
                      htmlFor={`${idPrefix}.asi1`}
                    >
                      ASI 2:{" "}
                    </label>
                    <select
                      style={{ float: "right" }}
                      {...register(`${idPrefix}.asis[1]`)}
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
            </div>
          );
        })}
        <input type="submit" />
      </form>
    </>
  );
};

export const CharacterSheetAndGeneratorView = () => {
  const [calculatedCharacter, setCalculatedCharacter] = useState(
    basicFighter[0],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <CharacterGeneratorView
        onSubmitCallback={(formData) => {
          const calculatedImportedCharacter = generateCharacterAtEachLevel(
            formData.baseStats,
            formData.levelChoices,
          );
          setCalculatedCharacter(
            calculatedImportedCharacter[calculatedImportedCharacter.length - 1],
          );
        }}
      />
      <CharacterSheetView calculatedCharacter={calculatedCharacter} />
    </div>
  );
};
