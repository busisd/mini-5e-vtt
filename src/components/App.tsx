import { useMemo, useState } from "react";
import TabContainer from "./TabContainer";
import AttacksView from "./attacks/AttacksView";
import CharactersView from "./character/CharactersView";
import MapView from "./map/MapView";
import DiceRollerView from "./dicerolls/DiceRollerView";
import { CharacterSheetAndGeneratorView } from "./character/CharacterGeneratorView";

export const Tabs = {
  Attacks: "attacks",
  Characters: "characters",
  CharacterGenerator: "characterGenerator",
  Map: "map",
  DiceRoller: "dice roller",
};
const TabIds = Object.values(Tabs);

const TabViews = {
  [Tabs.Attacks]: AttacksView,
  [Tabs.Characters]: CharactersView,
  [Tabs.CharacterGenerator]: CharacterSheetAndGeneratorView,
  [Tabs.Map]: MapView,
  [Tabs.DiceRoller]: DiceRollerView,
};

const App = () => {
  const [selectedId, setSelectedId] = useState(Tabs.CharacterGenerator);

  const MainView = useMemo(() => TabViews[selectedId], [selectedId]);

  return (
    <>
      <TabContainer
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        tabIds={TabIds}
      />
      <div className="main-content">
        <MainView />
      </div>
    </>
  );
};

export default App;
