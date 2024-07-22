import { useState } from "react";
import TabContainer from "./TabContainer";
import StatDropdown, { StatRadio } from "./forms/StatDropdown";
import TestForm from "./forms/TestForm";

export const Tabs = {
  Attacks: "attacks",
  Characters: "characters",
  Map: "map",
};
const TabIds = Object.values(Tabs);

const App = () => {
  const [selectedId, setSelectedId] = useState(Tabs.Attacks);

  return (
    <>
      <TabContainer
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        tabIds={TabIds}
      />
      <div className="main-content">
        <StatDropdown />
        <StatRadio name="stats" />
        <br />
        <br />
        <br />
        <TestForm />
      </div>
    </>
  );
};

export default App;
