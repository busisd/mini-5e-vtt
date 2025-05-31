import { FieldValues, useForm } from "react-hook-form";
import { Stat, StatArray } from "../types/stats";
import { useState } from "react";
import { CharacterClass, ClassHitDie } from "../types/classes/classes";

const defaultBaseStats = Object.fromEntries(
  Object.values(Stat).map((stat) => [stat, "10"]),
);

type LevelChoices = { hp: number };

export type CharacterGeneratorFormData = {
  // Relevant to final output
  baseStats: StatArray;
  levelChoices: LevelChoices[];

  // Used within the form itself
  characterClassToAdd: CharacterClass;
};

const levelsInClass = (
  characterClass: CharacterClass,
  chosenClasses: CharacterClass[],
) =>
  chosenClasses.filter((chosenClass) => chosenClass === characterClass).length;

export const CharacterGeneratorView = () => {
  const [levels, setLevels] = useState<CharacterClass[]>([]);

  const { register, handleSubmit, getValues } = useForm<FieldValues>({
    defaultValues: {
      baseStats: { ...defaultBaseStats },
      characterClassToAdd: CharacterClass.FIGHTER,
      levelChoices: [],
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
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
              setLevels([...levels, getValues("characterClassToAdd")]);
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
              {...register(`baseStats.${stat}`)}
            />
          </div>
        ))}
        {levels.map((characterClass, levelIndex) => {
          const idPrefix = `levelChoices.${levelIndex}`;
          const hpId = `${idPrefix}.hp`;
          const chosenClassLevel = levelsInClass(
            characterClass,
            levels.slice(0, levelIndex + 1),
          );
          return (
            <div key={idPrefix}>
              <b>
                Level {levelIndex + 1} ({characterClass} {chosenClassLevel}):
              </b>
              <div style={{ width: 300, height: 30 }}>
                <label style={{ float: "left" }} htmlFor={hpId}>
                  HP for level (1d{ClassHitDie[characterClass]}):{" "}
                </label>
                <input
                  style={{ float: "right" }}
                  type="number"
                  id={hpId}
                  min={1}
                  max={ClassHitDie[characterClass]}
                  defaultValue={(levelIndex === 0
                    ? ClassHitDie[characterClass]
                    : ClassHitDie[characterClass] / 2 + 1
                  ).toString()}
                  {...register(`${idPrefix}.hp`)}
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
                      {...register(`${idPrefix}.asi[0]`)}
                    >
                      {Object.entries(Stat).map(([key, value]) => (
                        <option key={key} value={key}>
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
                      {...register(`${idPrefix}.asi[1]`)}
                    >
                      {Object.entries(Stat).map(([key, value]) => (
                        <option key={key} value={key}>
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
