import { Fragment } from "react";
import { Stat } from "../../types/stats";

const StatDropdown = () => {
  return (
    <select defaultValue="initial">
      <option hidden disabled value="initial">
        -- Select a stat --
      </option>
      {Object.entries(Stat).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export const StatRadio = ({ name }: { name: string }) => {
  return Object.entries(Stat).map(([key, value]) => (
    <Fragment key={key}>
      <input value={value} id={value} name={name} type="radio" />
      <label htmlFor={value}>{value}</label>
    </Fragment>
  ));
};

export default StatDropdown;
