/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Toolbar,
  Navbar,
  useTheme,
  IconButton,
  Button,
  Tabs,
  Tab,
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
  Pager, IconArchive, ScrollView, Stack, useToast, LayerLoading, Text
} from "customize-easy-ui-component";

import { useSession,  useSignOut } from "../auth";
import { Link, useRoute, useLocation, Switch, Route } from "wouter";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { RelationList } from "../inspect/RelationList";
import { IspDetail } from "../inspect/IspDetail";
import { ReportSample } from "../inspect/ReportSample";
import { BoundReports } from "../inspect/report/BoundReports";
//潜入　嵌套在左边那　条
import { PrintReport } from "./PrintReport";
import { Branding } from "../Branding";
import { InternalItemHandResult, TemplateViewProps } from "./comp/base";
import { useCommitOriginalData } from "./db";
import throttle from 'throttle-asynchronous'
import { loadTemplate } from "./template";
import typeAsRoute from "../typeAsRoute.json";
import { Dispatch, SetStateAction } from "react";


//当作，模板在线文档的编辑数据的，临时存储。 子组件需要监听变化的数据。
interface EditStorageContextType {
  storage: any,
  setStorage: Dispatch<SetStateAction<any>>
}

export const EditStorageContext = React.createContext<EditStorageContextType | null>(
  null
);


interface RecordViewProps {
  id: string;
  action: string;
  source: any;
  template: React.ReactElement<React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>>;
}
//这才是右边的！，编辑，或原始记录的查看：
export const RecordView: React.FunctionComponent<RecordViewProps> = ({
                                                                       id,
                                                                       action,
                                                                       source,
                                                                       template,
                                                                       ...other
                                                                     }) => {
  const theme = useTheme();
  const toast = useToast();
  //初始化不可以直接取React.useState(source || {})，不然路由器切换就变成旧source。新修改被抛弃了。
  const {storage, setStorage} =React.useContext(EditStorageContext);
  const [enable, setEnable] = React.useState(true);
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
  const ref =React.useRef<InternalItemHandResult>(null);


  //ref可以共用current指向最新输入过的子组件；但父组件对.current的最新变化无法实时感知，只能被动刷新获知current变动。
  //子组件利用useImperativeHandle机制把数据回传给父组件，配套地父辈用ref来定位子组件。
  //保存按钮点击后必须首先触发template动态加载的子组件即TemplateView的做1次render()后，ref.current.inp才能收到儿孙组件的最新数据。
  const newOut={ ...(ref.current&&ref.current.inp) };

  //审核保存?对应数据deduction结论栏目＋审核手动修改；适用于出具正式报告，正式报告只读取deduction部分。依据审核保存>随后才是原始记录复检>初检data。
  //若复检保存 ，复检rexm，正检data。
  const {result, submit:updateFunc,loading } = useCommitOriginalData({
    id:227,  operationType:1,
    data:  JSON.stringify(storage || source) ,
    deduction:{emergencyElectric:'45,423'}
  });

  console.log("RecordView捕获,切花source=", source,"新storage=",storage);

  async function updateRecipe(
    id: string ) {
    let yes= result && result.id;
    try {
      //提交给后端， 这里将会引起底层变动，导致本组件即将要render3次。有更新的4次。更新比读取多了1次render。
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
      //很多错误是在这里捕获的。
      console.log("updateRecipe返回了,捕获err", err);
      return;
    }
    //这里无法获得result值，就算所在组件顶层已经获得result值，这里可能还是await () 前那样null;
    console.log("生成任务返回了＝", result,"yes=", yes);
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
  }

  const throttledUpdateBackend = throttle(updateRecipe,0);
  //延迟30秒才执行的; 可限制频繁操作，若很多下点击的30秒后触发2-3次。
  const throttledUpdateEnable = throttle(setEnable,10000);
  //可是这里return ；将会导致子孙组件都会umount!! 等于重新加载==路由模式刷新一样； 得权衡利弊。
  // if(updating)  return <LayerLoading loading={updating} label={'正在获取后端应答，加载中请稍后'}/>;
  //管道单线图，数量大，图像文件。可仅选定URL，预览图像。但是不全部显示出来，微缩摘要图模式，点击了才你能显示大的原图。

  if (!id) {
    return null;
  }

  //无法把<EditStorageContext.Provider value={{storage,setStorage}}>放这附近能产生效果，必须提升到顶级路由组件内去做。
  return (
    <React.Fragment>
      开头部分条

      {
        //useMemo使用后：各分区项目子组件inp各自独立的，分区项目子组件内若使用setInp(null) 清空重置后，无法靠重新拉取后端数据来保证恢复显示。
        //项目子组件使用setInp(null) 重置后，若上级组件重新取后端数据没变化的，也必须再次路由后再进入才可以让各分区项目子组件render恢复显示数据。
        React.cloneElement(template as React.ReactElement<any>, {
          ref: ref,
          inp: source,
          action
        })
      }

      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={!enable}
        loading ={loading}
        onPress={ async () => {
          //手机上更新模板TemplateView子组件重做render触发失效。只好采用延迟策略，每个分区项目的保存处理前准备，作一次render完了，才能发送数据给后端。
          setEnable(false);
          const {hasResolved,} =await throttledUpdateBackend('1');
          hasResolved&&throttledUpdateEnable(true);
        }}
      >保存到服务器</Button>
      <LayerLoading loading={loading} />
      <Text  css={{wordWrap: 'break-word'}}>{false && `当前(${JSON.stringify(newOut)})`}</Text>
    </React.Fragment>
  );
}





