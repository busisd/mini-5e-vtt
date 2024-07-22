import { Character, WeaponAttack } from "../types/character";
import { DamageType } from "../types/damageTypes";
import { DamageDie } from "../types/dice";
import { Stat } from "../types/stats";
import { addResults } from "./rollDisplays";

const statDropdown = (id = "attackStat") => {
  const parentSpan = document.createElement("span");

  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = "Set attack stat: ";

  const select = document.createElement("select");
  select.name = id;
  select.id = id;

  for (const stat of Object.values(Stat)) {
    const option = document.createElement("option");
    option.value = stat;
    option.text = stat;
    select.appendChild(option);
  }

  parentSpan.append(label, select);

  return parentSpan;
};

const dieInput = (id = "damageDie") => {
  const parentSpan = document.createElement("span");

  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = "Set damage die: 1d";

  const input = document.createElement("input");
  input.name = id;
  input.id = id;
  input.type = "number";
  input.min = "1";
  input.value = "6";

  parentSpan.append(label, input);

  return parentSpan;
};

const submitButton = () => {
  const button = document.createElement("button");
  button.textContent = "Submit";
  button.type = "submit";
  return button;
};

const formTitle = document.createElement("h3");
formTitle.textContent = "Create a weapon attack";

const form = document.createElement("form");
form.appendChild(formTitle);
form.appendChild(statDropdown());
form.appendChild(document.createElement("br"));
form.appendChild(dieInput());
form.appendChild(document.createElement("br"));
form.appendChild(submitButton());
form.onsubmit = (ev) => {
  ev.preventDefault();
  const data = new FormData(form);
  console.log(JSON.stringify(Array.from(data.entries()), null, 2));

  const attackStat = data.get("attackStat") as Stat;
  const damageDieValue = parseInt(data.get("damageDie") as string);
  const damageDie = new DamageDie(damageDieValue, DamageType.SLASHING);

  const weaponAttack = new WeaponAttack(attackStat, [damageDie]);
  const results = goblin.useAttack(weaponAttack);
  addResults(results);
};

function makeStatArray(stats: number[]) {
  return {
    [Stat.STR]: stats[0],
    [Stat.DEX]: stats[1],
    [Stat.CON]: stats[2],
    [Stat.INT]: stats[3],
    [Stat.WIS]: stats[4],
    [Stat.CHA]: stats[5],
  };
}
const goblin = new Character(makeStatArray([8, 14, 10, 10, 8, 8]), 2);

document.body.appendChild(form);
