import { Button, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AddBox, Close } from "@mui/icons-material";
import { Controls, Info, Layout, RiffInput, RiffList } from "./AddRiff.styles";
import { useAppContext } from "../../context/AppContext";
import { v4 as uuid } from "uuid";

const AddRiff = () => {
  const { song, send, setDisableShortcuts } = useAppContext();
  const [section, setSection] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tabs, setTabs] = useState<string[]>([]);
  const tabsRef = useRef<{ [id: string]: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Whenever a new tab input is added, the controls get pushed off the bottom of the screen.
    // This bumps the controls back into view when the tab inputs change and at least one exists.
    tabs.length && scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    // If tabs is ever reduced back to 0, the panel closes up. Reset the state.
    // Do not reset tabs itself...it's already at 0 and setting it will cause an infinite loop
    if (tabs.length === 0) {
      setSection("");
      setDesc("");
      tabsRef.current = {};
      setDisableShortcuts(false);
    }
  }, [tabs]);

  return (
    <Layout>
      {tabs.length > 0 && (
        <>
          <Info
            id="section"
            label="Section"
            variant="outlined"
            value={section}
            size="small"
            autoFocus
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSection(e.target.value);
            }}
          />

          <Info
            id="desc"
            label="Description"
            variant="outlined"
            value={desc}
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDesc(e.target.value);
            }}
          />

          <RiffList>
            {tabs.map((tabId, i) => (
              <RiffInput key={i}>
                <TextField
                  id="tab"
                  label={`Tab #${i + 1}`}
                  variant="outlined"
                  value={
                    tabsRef.current[tabId]
                      ? `${tabsRef.current[tabId].slice(
                          0,
                          20
                        )}...${tabsRef.current[tabId].slice(-30)}`
                      : ""
                  }
                  size="small"
                  fullWidth
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    // Interesting performance issue here.
                    // The data uri strings are so huge that if I try to update the state the usual way (by creating a new array from the existing one),
                    // the page immediately hangs for several seconds. By the time the 3rd or 4th riff is added its about a minute.
                    // Performance nose-dives very rapidly.
                    // Instead, I'm using a two-state approach, only keep the riff ids in a useState as pointers to a ref that holds the data.
                    tabsRef.current[tabId] = e.target.value;

                    // This isn't ideal but due to the performance issue above, I need some sort of state change to re-render based on the update to the ref.
                    // Resetting the tabs array does the trick.
                    setTabs([...tabs]);
                  }}
                />
                <IconButton
                  onClick={() => {
                    setTabs(tabs.filter((val) => val !== tabId));
                    delete tabsRef.current[tabId];
                  }}
                >
                  <Close />
                </IconButton>
              </RiffInput>
            ))}
          </RiffList>
        </>
      )}

      <Controls ref={scrollRef}>
        <Button
          variant="outlined"
          startIcon={<AddBox />}
          onClick={() => {
            setDisableShortcuts(true);
            if (
              tabs.length === 0 ||
              tabsRef.current[tabs.at(-1) ?? ""].length
            ) {
              const newId = tabs.length.toString();
              tabsRef.current[newId] = "";
              setTabs([...tabs, newId]);
            }
          }}
        >
          Add Riff
        </Button>

        {tabs.length > 0 && (
          <Button
            color="success"
            variant="contained"
            disabled={
              !section ||
              tabs.length === 0 ||
              tabs.some((tab) => tab.length === 0)
            }
            onClick={async () => {
              send("riffs", "add", {
                songId: song.id,
                id: uuid(),
                label: section,
                labelDesc: desc,
                uri: tabs.map((tabId) => tabsRef.current[tabId]),
              });
              setTabs([]);
            }}
          >
            Save
          </Button>
        )}
      </Controls>
    </Layout>
  );
};

export default AddRiff;
