import { useMemo, useState } from "react";
import TabContainer from "./TabContainer";
import AttacksView from "./AttacksView";
import CharactersView from "./CharactersView";
import MapView from "./MapView";
import DiceRollerView from "./DiceRollerView";
import { CharacterSheetView } from "./CharacterSheetView";
import { CharacterGeneratorView } from "./CharacterGeneratorView";

export const Tabs = {
  Attacks: "attacks",
  Characters: "characters",
  CharacterGenerator: "characterGenerator",
  CharacterSheet: "CharacterSheet",
  Map: "map",
  DiceRoller: "dice roller",
};
const TabIds = Object.values(Tabs);

const TabViews = {
  [Tabs.Attacks]: AttacksView,
  [Tabs.Characters]: CharactersView,
  [Tabs.CharacterGenerator]: CharacterGeneratorView,
  [Tabs.CharacterSheet]: CharacterSheetView,
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
