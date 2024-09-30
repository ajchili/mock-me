import { useState, type ReactNode } from "react";

export interface TabPaneProps {
  tabs: Array<{
    title: string;
    children: ReactNode;
  }>;
}

export const TabPane = ({ tabs }: TabPaneProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-1 flex-col max-h-[40vh]">
      <div className="flex flex-row">
        {tabs.map(({ title }, index) => (
          <button
            key={`tab-selector-${index}`}
            className={`p-2 ${
              index === activeTab && "bg-gray-500"
            } hover:bg-gray-400`}
            onClick={() => setActiveTab(index)}
          >
            {title}
          </button>
        ))}
      </div>
      <div
        key={`tab-content-${activeTab}`}
        className="flex flex-1 overflow-scroll"
      >
        {tabs[activeTab].children}
      </div>
    </div>
  );
};
