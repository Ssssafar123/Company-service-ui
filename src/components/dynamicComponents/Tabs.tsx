import React from "react";
import { Tabs } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const SimpleTabs = ({ tabs } : any) => {
  const navigate = useNavigate();

  return (
    <Tabs.Root defaultValue={tabs[0]?.value}>
      <Tabs.List>
        {tabs.map((tab : any) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};

export default SimpleTabs;