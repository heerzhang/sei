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
  useCollapse, Collapse,  IconArrowRight, IconAlignCenter ,
  Input, InputGroup,  Select, Check, InputGroupLine, TextArea
} from "customize-easy-ui-component";
import {Table, TableBody, TableHead, TableRow, Cell, CCell} from "../src/comp/TableExt";


import {Branding} from "./MiniBranding";
import { Component } from "react";


//import { storiesOf } from "@storybook/react";
import { useTouchable } from "touchable-hook";
import { usePanResponder } from "pan-responder-hook";
import pick from "lodash.pick";
import ReactToPrint from 'react-to-print';
import { lazy } from "react";
import OriginalRecord from "../src/original/OriginalRecord";




var faker = require("faker/locale/zh_CN");



class ComponentToPrint extends React.Component {
  render() {
    return (
      <OriginalRecord></OriginalRecord>
    );
  }
}

class ComponentToPrint22 extends React.Component {
  render() {
    return (
      <table>
        <thead>
        <th>column 1</th>
        <th>column 2</th>
        <th>column 3</th>
        </thead>
        <tbody>
        <tr>
          <td>data 1</td>
          <td>data 2</td>
          <td>data 3</td>
        </tr>
        </tbody>
      </table>
    );
  }
}


//父组件获取子组件数据的3中方式 https://blog.csdn.net/kuangshp128/article/details/90483321
export  function Example() {
  const componentRef = React.useRef();
  return (
    <div>
      <ReactToPrint
        trigger={() =>     <button>按这个 你就饿可以打印了!</button>        }
        content={() => componentRef.current}
      />
      <ComponentToPrint ref={componentRef} />
    </div>
  );
}


