import { useState } from "react";
import TabContainer from "./TabContainer";

export const TabIds = {
  Attacks: "attacks",
  Characters: "characters"
}

const App = () => {
  const [selectedId, setSelectedId] = useState(TabIds.Attacks);

  console.log(selectedId)

  return (
    <TabContainer selectedId={selectedId} setSelectedId={setSelectedId} />
  );
};

export default App;
