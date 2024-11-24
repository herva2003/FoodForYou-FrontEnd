// Community.tsx
import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import SidebarPage from "../components/SidebarPage";
import CommunityContent from "../components/CommunityContent";
import Forum from "../components/Forum";
import TutorialCommunity from "../components/Tutorials/TutorialCommunity";
import CommunityWelcomeCard from "../components/WelcomeCards/CommunityWelcomeCard";
import ForumWelcomeCard from "../components/WelcomeCards/ForumWelcomeCard";

const tabs = [
  { index: 0, label: "Comunidade" },
  { index: 1, label: "Fórum" },
];

const Community: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <SidebarPage headerTitle={tabs[selectedTab].label}>
      <div id="h-[100vh] pr-[100px] overflow-y-auto">
        <TutorialCommunity />
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          id="tabs"
          aria-label="Community and Forum Tabs"
        >
          {tabs.map((tab) => (
            <Tab key={tab.index} label={tab.label} />
          ))}
        </Tabs>
        <div className="mt-4 mr-24">
          {selectedTab === 0 ? <CommunityWelcomeCard /> : <ForumWelcomeCard />}
        </div>
        <div className="mt-4">
          {selectedTab === 0 && <CommunityContent />}
          {selectedTab === 1 && <Forum />}
        </div>
      </div>
    </SidebarPage>
  );
};

export default Community;
