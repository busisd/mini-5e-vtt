import { ReactNode } from "react";
import { TabIds } from "./App";
import upperFirst from "lodash/upperFirst";
import "./TabContainer.css"

const TAB_SELECTED = "tab-selected";
const TAB_UNSELECTED = "tab-unselected";

type SetState<T> = (input: T) => void;

const Tab = ({
  children,
  id,
  selectedId,
  setSelectedId,
}: {
  children?: ReactNode;
  id: string;
  selectedId: string;
  setSelectedId: SetState<string>;
}) => {
  const isSelected = id === selectedId;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (!isSelected) {
          setSelectedId(id);
        }
      }}
      className={`tab ${isSelected ? TAB_SELECTED : TAB_UNSELECTED}`}
    >
      {children}
    </div>
  );
};

const TabContainer = ({
  selectedId,
  setSelectedId,
}: {
  selectedId: string;
  setSelectedId: SetState<string>;
}) => {
  return (
    <div className="tab-container">
      {Object.values(TabIds).map((id) => (
        <Tab
          id={id}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          key={id}
        >
          {upperFirst(id)}
        </Tab>
      ))}
    </div>
  );
};

export default TabContainer;
