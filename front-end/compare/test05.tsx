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
  IconMoreVertical, Skeleton, useInfiniteScroll
} from "customize-easy-ui-component";

import {Branding} from "./MiniBranding";
import { Component } from "react";
import useLocation from "wouter/use-location";

//import { globalHistory  } from "@reach/router";
import omit from "lodash.omit";
import useHistoryState from "use-history-state";

var faker = require('faker/locale/zh_CN');



export default function Example({name},props) {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [nowPath, setLocation] = useLocation(); 　//取得路由钩子, nowPath是整个url。

  const ref = React.useRef();
  const [items, setItems] = React.useState(
    Array.from(new Array(4)).map(() => faker.name.firstName())
  );

  function fetchdata() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }


  const [page, setPage] = React.useState(0);
  //customize-easy-ui-component.useInfiniteScroll必须内容撑开才可以滚动触发函数。
  const [fetching] = useInfiniteScroll({
    container: ref,
    hasMore: page <3,
    onFetch: () => {
      return fetchdata().then(() => {
        setItems([
          ...items,
          ...Array.from(new Array(3)).map(() => faker.name.firstName())
        ]);
        setPage(page + 1);
      });
    }
  });

  //const [option, setOption] = useHistoryState("", "option");
 //使用window.history.pushState(；必须刷新页面才有数据。

  //console.log("来看当前的items nowPath=",globalHistory.location.state&&globalHistory.location.state.option, omit(globalHistory.location.state,'key'), globalHistory.location.state);

 // console.log("来看当前的items nowPath=",globalHistory.location.state ,"option=",globalHistory);
  // @ts-ignore
 // ref.current && ( ref.current.scrollHeight=350);
  // @ts-ignore
  ref.current && console.log("来看", ref.current.offsetHeight,"+",ref.current.clientHeight,"大于",ref.current.scrollHeight);


  return (
    <ScrollView overflowY css={{ height: "230px" }} innerRef={ref}>
      <List>
        {items.map(item => (
          <ListItem key={item} primary={item}　title={item} />
        ))
        }
        {fetching && (
          <ListItem
            interactive={false}
            aria-live="polite"
            aria-busy="true"
            primary={<Skeleton animated css={{ width: "150px" }} />}
          />
        )}
      </List>
    </ScrollView>
  );
}



function getUser() {
  faker.seed(0);

  return {
    name: faker.name.firstName() + " " + faker.name.lastName(),
    uid: faker.random.uuid(),
    description: faker.lorem.sentence()
  };
}

