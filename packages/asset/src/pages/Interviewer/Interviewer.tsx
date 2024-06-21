import { useState } from "react";
import { RemoteEditor } from "../../components/Editor/RemoteEditor.js";
import { useStyles } from "./styles.js";

const TABS = ["Question", "Actions"];

export const Interviewer = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const styles = useStyles();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 1,
          minHeight: 200,
          maxHeight: 200,
        }}
      >
        <div className={styles.tabContainer}>
          {TABS.map((tab, tabIndex) => {
            return (
              <button
              key={`${tab}-tab`}
                className={styles.tab}
                onClick={() => setActiveTab(tabIndex)}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {activeTab === 0 && (
          <RemoteEditor
            type="question"
            language="html"
            options={{ wordWrap: "on" }}
          />
        )}
        {activeTab === 1 && (
          <>
            <h2>Interviewer Actions</h2>
            <button
              onClick={() => {
                const query = new URLSearchParams(window.location.search);
                fetch(`${query.get("endpoint")}:6969/selectDaily`);
              }}
            >
              Load Daily Question
            </button>
          </>
        )}
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <RemoteEditor
            type="candidate"
            language="typescript"
            options={{ wordWrap: "on" }}
          />
        </div>
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ flex: 6 }}>
            <RemoteEditor
              type="interviewer"
              language="markdown"
              options={{ wordWrap: "on" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
