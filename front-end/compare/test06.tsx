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
  Pager,
  IconUmbrella,
  IconTrash,
  IconArchive,
  IconAperture,
  IconActivity,
  Stack,
  StackTitle,
  StackItem,
  ScrollView,
  List,
  ListItem,
  IconChevronRight,
  Avatar,
  Sheet,
  MenuDivider,
  IconHome,
  IconList,
  IconUser,
  IconInstagram,
  IconPackage,
  IconMoreVertical,
  Skeleton,
  useInfiniteScroll,
  ComboBox,
  ComboBoxInput,
  ComboBoxList,
  ComboBoxOption,
  ComboBoxOptionText, Breadcrumbs, BreadcrumbItem, Link, Badge, AlertDialog, Alert, useToast,
  useCollapse, Collapse

} from "customize-easy-ui-component";

import {Branding} from "./MiniBranding";
import { Component } from "react";

var faker = require('faker/locale/zh_CN');



//import { storiesOf } from "@storybook/react";
import { useTouchable } from "touchable-hook";
import { usePanResponder } from "pan-responder-hook";


function TouchableHighlight({ options = {} }) {
  const [pressCount, setPressCount] = React.useState(0);

  function onPress() {
    console.log("Pressed!");
    setPressCount(pressCount + 1);
  }

  function onLongPress() {
    console.log("LONG PRESSED");
  }

  const { bind, active, hover } = useTouchable({
    onPress,
    onLongPress,
    behavior: "button",
    ...options
  });

  return (
    <div>
      {pressCount}
      <div
        role="button"
        tabIndex={0}
        {...bind}
        style={{
          border: hover ? "1px solid black" : "1px solid transparent",
          userSelect: "none",
          outline: "none",
          background: active ? "#08e" : "transparent"
        }}
      >
        This is a touchable highlight
      </div>
    </div>
  );
}

function Parent({ children }: any) {
  const { bind } = usePanResponder({
    onMoveShouldSet: () => true
  });

  return (
    <div {...bind} style={{ padding: "30px" }}>
      {children}
    </div>
  );
}
export  function Example() {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();

  return (
    <div>
      <TouchableHighlight />

      <div
        style={{
          border: "1px solid"
        }}
      >
        <Parent>
          <TouchableHighlight />
        </Parent>
      </div>
    </div>
);
}
/*
storiesOf("Hello", module)
  .add("Example", () => <TouchableHighlight />)
  .add("no delay", () => <TouchableHighlight options={{ delay: 0 }} />)
  .add("disabled", () => <TouchableHighlight options={{ disabled: true }} />)
  .add("within a scroll", () => (
    <div
      style={{
        height: "300px",
        overflowY: "scroll"
      }}
    >
      <div style={{ height: "350px" }} />
      <TouchableHighlight />
      <div style={{ height: "100px" }} />
    </div>
  ))
  .add("disables with parent responder", () => (
    <div>
      <TouchableHighlight />

      <div
        style={{
          border: "1px solid"
        }}
      >
        <Parent>
          <TouchableHighlight />
        </Parent>
      </div>
    </div>
  ))
  .add("without onPress", () => <TouchableWithoutPress />)
  .add("disable scroll terminate", () => (
    <div
      style={{
        overflow: "auto",
        height: "100px"
      }}
    >
      <div style={{ height: "200px" }}>
        <TouchableWithoutPress options={{ terminateOnScroll: false }} />
      </div>
    </div>
  ));
*/

function TouchableWithoutPress({ options = {} }) {
  const { bind, active, hover } = useTouchable({
    behavior: "button",
    onPress: undefined,
    ...options
  });

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        {...bind}
        style={{
          border: hover ? "1px solid black" : "1px solid transparent",
          userSelect: "none",
          outline: "none",
          background: active ? "#08e" : "transparent"
        }}
      >
        This is a touchable highlight
      </div>
    </div>
  );
}

