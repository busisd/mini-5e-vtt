import StatDropdown, { StatRadio } from "./forms/StatDropdown";
import TestForm from "./forms/TestForm";

const AttacksView = () => {
  return (
    <>
      <StatDropdown />
      <StatRadio name="stats" />
      <br />
      <br />
      <br />
      <TestForm />
    </>
  );
};

export default AttacksView;
