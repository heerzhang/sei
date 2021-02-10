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
  DarkMode,
  IconChevronDown,
  Tooltip,
  IconPlus,
  IconArchive,
  Tabs,
  Tab,
  Pager,
  TabPanel,
  Layer,
  Touchable,
  IconX,
  InputGroupLine
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
export const UnitOrChoose= ( { id, onCancel, onDialog, emodel, field }
) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  //const [getUnit, { loading, data }] = useLazyQuery(GET_UNIT_DETAIL);  https://www.apollographql.com/docs/react/data/queries/
  const { loading, error, data, networkStatus } = useQuery(GET_UNIT_DETAIL, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });

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
            setLocation(`/unit/${id? id:''}?&emodel=${emodel}&field=${field}`,  { replace: true } );
              } }
      >
        <Input readOnly value={data.unit?.company?.name||data.unit?.person.name||''}
               onChange={e => (0) }
        />
      </Touchable>
      { data.unit && <IconButton
        css={{ marginLeft: theme.spaces.sm}}
        variant="ghost"
        icon={<IconX />}
        label="删除"
        onPress={onCancel}
      />
      }
    </React.Fragment>
  );
}

