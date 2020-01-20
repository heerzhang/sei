/** @jsx jsx */
import { jsx,} from "@emotion/core";
import * as React from "react";
import {
    useTheme,
    Button,Text,
    useToast, LayerLoading, Layer,
} from "customize-easy-ui-component";
//import {Table, TableBody, TableHead, TableRow, Cell, CCell} from "../comp/TableExt";
//import useLocation from "wouter/use-location";

import { useCommitOriginalData,  } from "./db";
import throttle from 'throttle-asynchronous'

//import PropTypes from "prop-types";
//import { useMeasure } from "customize-easy-ui-component/esm/Hooks/use-measure";
//import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";
//import food from "../images/food.svg";
//import { Link as RouterLink, useRoute } from "wouter";

import {
  InternalItemHandResult,
  TemplateViewProps,
} from "./comp/base";

interface RecordViewProps {
  inp: any;
  printing?: boolean;
  showAll?: boolean;
  template: React.ReactElement<React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>>;
}
//viewAll是否是整个报表都一起显示。
//export default function RecordView({printing, inp}:{printing?:boolean,inp:any },props) {
export const RecordView: React.FunctionComponent<RecordViewProps> = ({
                                                                       printing,
                                                                       inp,
                                                                       showAll=false,
                                                                       template,
                                                                       ...other
                                                                     }) => {
  const theme = useTheme();
  const toast = useToast();
  const [enable, setEnable] = React.useState(true);
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
  const [outlet, setOutlet] = React.useState(null);
  const ref =React.useRef<InternalItemHandResult>(null);

  //  console.log("错误RecordView  变化 ref.current=", ref.current, "template=",template);
  // let filtercomp={ id:227 };

  //ref可以共用current指向最新输入过的子组件；但父组件对.current的最新变化无法实时感知，只能被动刷新获知current变动。
  //子组件利用useImperativeHandle机制把数据回传给父组件，配套地父辈用ref来定位子组件。
  //保存按钮点击后必须首先触发template动态加载的子组件即TemplateView的做1次render()后，ref.current.inp才能收到儿孙组件的最新数据。
  const newOut={ ...(ref.current&&ref.current.inp) };

  //审核保存?对应数据deduction结论栏目＋审核手动修改；适用于出具正式报告，正式报告只读取deduction部分。依据审核保存>随后才是原始记录复检>初检data。
  //若复检保存 ，复检rexm，正检data。
  const {result, submit:updateFunc,loading } = useCommitOriginalData({
    id:227,  operationType:1,
    data:  JSON.stringify(newOut) ,
    deduction:{emergencyElectric:'45,423'}
  });

  console.log("RecordView捕获 ｀｀｀ inp=", inp);

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
    console.log("生成任务返回了＝", result,"yes=", yes, outlet);
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
  }
  //延迟几秒才执行的。
  const throttledUpdateStory = throttle(updateRecipe,0);
  const throttledUpdateEnable = throttle(setEnable,30000);
  //可是这里return ；将会导致子孙组件都会umount!! 等于重新加载==路由模式刷新一样； 得权衡利弊。
  // if(updating)  return <LayerLoading loading={updating} label={'正在获取后端应答，加载中请稍后'}/>;
  //管道单线图，数量大，图像文件。可仅选定URL，预览图像。但是不全部显示出来，微缩摘要图模式，点击了才你能显示大的原图。

  return (
    <React.Fragment>
      {
       //useMemo使用后：各分区项目子组件inp各自独立的，分区项目子组件内若使用setInp(null) 清空重置后，无法靠重新拉取后端数据来保证恢复显示。
       //项目子组件使用setInp(null) 重置后，若上级组件重新取后端数据没变化的，也必须再次路由后再进入才可以让各分区项目子组件render恢复显示数据。
        React.cloneElement(template as React.ReactElement<any>, {
          ref: ref,
          inp: inp,
          showAll: showAll
        })
      }
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={!enable}
        loading ={loading}
        onPress={ async () => {
          //这两个函数执行时刻看见的odata是一样的。 setOdata异步的，会提前触发底下子组件的更新render，随后才继续执行updateRecipe函数。
          //实际上随便搞个能够触发底下的模板TemplateView子组件重做render就可以的； 这里用setOutlet(该变量必须变动)触发来更新。
            setOutlet(newOut);
            //手机上更新触发失效。只好采用延迟策略，每个分区项目的保存处理前准备，作一次render完了，才能发送数据给后端。
            /*setTimeout(() => {
                updateRecipe('1');
            }, 0);*/
          setEnable(false);
            const { hasResolved, value } =await throttledUpdateStory('1');
          console.log("throttledUpdateStory＝", value,"hasResolved=",hasResolved);
          if (hasResolved) {
            throttledUpdateEnable(true);
            console.log("throttledUpdateStory返回了＝", value);
          }
        }}
      >保存到服务器</Button>
        <LayerLoading loading={loading} />
    </React.Fragment>
  );
}


//jsx文件内在组件定义体之外的代码，只执行一次，除非URL刷新重来的。

//用来显示队列重组排序的；支持按照检验流程图来排列，而打印按照索引标号排列。 不规则序号的可额外编排项目号数。
//登记入该种类子类别的原始记录所有的页面核查的项目列表。按检验步骤流程排序和按报告序号排列方式。
