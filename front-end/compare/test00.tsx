/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Text,
  Toolbar,
  Navbar,
  useTheme,
  IconButton,
  Button,
  Tabs,
  Tab,
  TabIcon,
  Layer,
  TabPanel,
  MenuList,
  MenuItem,
  Tooltip,
  ResponsivePopover,
  IconChevronDown,
  IconPlus,
  DarkMode,
  LightMode,
  Pager, IconUmbrella, IconTrash, IconArchive, IconAperture, IconActivity
} from "customize-easy-ui-component";

import {Branding} from "./MiniBranding";

export  function Example() {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();

  return (
    <Layer css={{ maxWidth: "500px", height: '100vh', margin: "0 auto", overflow: "hidden" }}>
      <Pager
        css={{ height: `calc(100vh - ${theme.spaces.lg} - ${theme.spaces.lg})` }}
        value={index}
        onRequestChange={i => setIndex(i)}
      >
        <TabPanel id="you" className="Tab-panel">
          <Text>What's up, you!</Text>
        </TabPanel>
        <TabPanel id="sports" className="Tab-panel">
          <Text>Sport is fun</Text>
        </TabPanel>
        <TabPanel id="entertainment" className="Tab-panel">
          <Text>We don't need no education</Text>
        </TabPanel>
        <TabPanel id="news" className="Tab-panel">
          <Text>No news is good news</Text>
        </TabPanel>
        <TabPanel id="fun" className="Tab-panel"
                  css={{  overflowY:'scroll' }}
        >
          <Branding/>
        </TabPanel>
      </Pager>

      <DarkMode>
        {darkTheme => (
          <div css={{ background: darkTheme.colors.background.tint2 }}>
            <Tabs
              variant="evenly-spaced"
              value={index}
              slider={false}
              onChange={i => setIndex(i)}
            >
              <Tab id={'1'}>
                <TabIcon icon={<IconUmbrella />} label="Annotation" />
              </Tab>
              <Tab id='2' >
                <TabIcon icon={<IconTrash />} label="Chat" />
              </Tab>
              <Tab id='3'>
                <TabIcon icon={<IconArchive />} label="Box" />
              </Tab>
              <Tab id='4'>
                <TabIcon icon={<IconAperture />} label="Camera" />
              </Tab>
              <Tab id={'5'}>
                <TabIcon icon={<IconActivity />} label="Chart" />
              </Tab>
            </Tabs>
          </div>
        )}
      </DarkMode>
    </Layer>
  );
}

