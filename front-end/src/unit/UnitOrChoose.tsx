/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
import * as React from "react";
import {
  InputGroup,
  Input,
  useTheme,
  VisuallyHidden,
  Button,
  useResponsiveContainerPadding,
  IconSearch,
  IconLayers,
  IconButton,
  Dialog,
  Text,
  Navbar,
  Toolbar,
  LightMode,
  ResponsivePopover,
  MenuList,
  MenuItem,
  DarkMode, IconChevronDown, Tooltip, IconPlus, IconArchive, Tabs, Tab, Pager, TabPanel, Layer, Touchable
} from "customize-easy-ui-component";
//import { Link } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { Link as RouterLink, useLocation } from "wouter";
import { UnitList } from "./UnitList";
import { TaskList } from "./task/TaskList";
import { DialogEnterReturn } from "../context/DialogEnterReturn";




//根据unitID查具体
const GET_UNIT_DETAIL = gql`
    query Unit($id: ID) {
        unit(id: $id) {
            id name company{id name no} person{id name no}
        }
    }
`;

//页面和数据分离后又要被迫整合在一块了？
//非高层次通用的组件。语义整合：　数据获取和规格化显示部分组合在一个文件内。前端graphql底层缓存：不见得每次都会发送请求给后端的。
//graphQL想把多个Query同时都坐在一个Hook函数里面一次性向后端读取，有许多障碍：页面分割，公用组件嵌套，父辈组件知晓子孙辈组件数据请求和参数还得传递数据，不过前端有缓存。
/**
 * @param id 目前选择好的单位id
 * @param onCancel 取消该参数的单位选择
 * @param onDialog 保存当前用户编辑器的所有输入框编制新数值。
 * @constructor
 */
export const UnitOrChoose= ( { id, onCancel, onDialog }
) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  //const [getUnit, { loading, data }] = useLazyQuery(GET_UNIT_DETAIL);  https://www.apollographql.com/docs/react/data/queries/
  const { loading, error, data, networkStatus } = useQuery(GET_UNIT_DETAIL, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });
  const [open, setOpen] = React.useState(false);
  const [, setLocation] = useLocation();
  const {ndt, setNdt} =React.useContext(DialogEnterReturn);
  //Hooks必须放在条件分支if 前面，确保每一次render时刻hook执行顺序一致。
  if (networkStatus === NetworkStatus.refetch) return <React.Fragment>Refetching!</React.Fragment>;
  if (loading)   return null;
  if (error) return <React.Fragment>Error! ${error}</React.Fragment>;
  //<button onClick={() => refetch()}>Refetch!</button>
  console.log("UnitOrChoose跑来  ndt=",ndt);

  return (
    <React.Fragment>
      <Touchable component={'div'}
          onPress={ async () => {
            await onDialog();   //编辑器来源，context已确定的；
            setLocation(`/unit/${id? id:''}`,  { replace: true } );
              } }
      >
        <TransparentInput
          readOnly
          value={ id ||''}
        />
      </Touchable>
      <IconButton
        css={{ marginLeft: theme.spaces.sm}}
        variant="ghost"
        icon={<IconLayers />}
        label="删除"
        //onPress={onCancel}
        onPress={() => setOpen(true)}
      />


      <Dialog
        mobileFullscreen
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        title="选择参数缩小查询的范围"
      >
        <div
          css={[
            {
              width: "100%",
              top: 0,
              background: theme.colors.palette.gray.base,
              zIndex: theme.zIndices.sticky,
              position: "sticky",
            }
          ]}
        >
          <Navbar
            position="static"
            css={{
              flex: "0 0 auto",
              background: theme.colors.palette.gray.base,
              color: "white"
            }}
          >
            <Toolbar
              css={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div css={{ width: "42px" }} />
              <LightMode>
                <ResponsivePopover
                  content={
                    <MenuList>
                      <MenuItem onPress={()=>0}>退出登录帐户</MenuItem>
                    </MenuList>
                  }
                >
                  <DarkMode>
                    <Button
                      size="md"
                      iconAfter={<IconChevronDown />}
                      variant="ghost"
                    >
                      {''}
                    </Button>
                  </DarkMode>
                </ResponsivePopover>
              </LightMode>
              <Tooltip content="单位新增">
                <div>
                  <DarkMode>
                    <RouterLink to="/unit/new">
                      <IconButton  noBind
                                   variant="ghost"
                                   label="加设备"
                                   size="md"
                                   icon={<IconPlus />}
                      />
                    </RouterLink>
                  </DarkMode>
                </div>
              </Tooltip>
              <Tooltip content="返回首页">
                <div>
                  <DarkMode>
                    <RouterLink to="/">
                      <IconButton noBind
                                  variant="ghost"
                                  label="首页"
                                  size="md"
                                  icon={<IconArchive />}
                      />
                    </RouterLink>
                  </DarkMode>
                </div>
              </Tooltip>
            </Toolbar>
          </Navbar>
          <div css={{ flex: "0 0 auto", zIndex: 2 }}>
            <DarkMode>
              <Tabs
                css={{
                  position: "sticky",
                  top: 0,
                  background: theme.colors.palette.gray.base
                }}
                onChange={i => setActiveTab(i)}
                value={activeTab}
                variant="evenly-spaced"
              >
                <Tab id="company">
                  找企业
                </Tab>
                <Tab id="person">
                  找个人
                </Tab>
              </Tabs>
            </DarkMode>
          </div>
        </div>

        <Pager
          enableScrollLock={false}
          value={activeTab}
          onRequestChange={i => setActiveTab(i)}
          lazyLoad
        >
          <TabPanel id="company">
            <UnitList company />
          </TabPanel>
          <TabPanel id="person">
            <UnitList  />
          </TabPanel>
        </Pager>
      </Dialog>
    </React.Fragment>
  );
}


