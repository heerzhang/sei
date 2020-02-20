/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  Text,
  useTheme,
  Button, MenuItem, MenuList,
  InputGroupLine,
  SuffixInput,  Input, ResponsivePopover, IconChevronDown, Layer, TextArea, Select, Touchable
} from "customize-easy-ui-component";
import {Table, TableBody,  TableRow, Cell, CCell} from "../../comp/TableExt";
import {
  IndentationLayText,  InspectRecordLayout,
  SelectHookfork, OriginalViewProps,
  useItemInputControl, useProjectListAs
} from "../comp/base";
import {  InternalItemHandResult, InternalItemProps } from "../comp/base";
import {  mergeEditorItemRefs  } from "../../utils/tools";
//import isEqual from "lodash.isequal";
import {  ReportView } from "./PeriodicalInspection.R-1";
import { Link as RouterLink } from "wouter";
import { EditStorageContext } from "../StorageContext";
import throttle from 'throttle-asynchronous'
import { ItemConclusion, ItemRecheckResult, ItemUniversal } from "../editor/base";
import { ItemAppendixB, ItemRemarks } from "./base";
import { ItemGapMeasure, ItemSurveyLinkMan } from "./rarelyVary";
import { ItemInstrumentTable } from "../editor/rarelyVary";
import { createItem, getInspectionItemsLength, verifyAction } from "../editor/helper";
import { inspectionContent } from "./Periodical/main";
import { generalFormat } from "./Periodical/editor";

//模板的动态加载入口文件：  原始记录，一一对应的报告的录入编辑数据，可打印。

const maxItemsSeq=getInspectionItemsLength(inspectionContent);


//forwardRef实际上已经没用了，ref，也可改成简易组件模式。
export const OriginalView: React.RefForwardingComponent<InternalItemHandResult,OriginalViewProps>=
  React.forwardRef((
    { action, children, verId}, ref
  ) => {
    const {storage, setStorage} =React.useContext(EditStorageContext);
    let editorRefCount=recordPrintList.length+maxItemsSeq;
    const clRefs =useProjectListAs({count: editorRefCount});
    //同名字的字段：清除／覆盖，编辑器未定义的字段数据可保留。
    const outCome=mergeEditorItemRefs( ...clRefs.current! );
    //旧的模式：两次暴露传递，返回给了爷爷辈组件。
    //React.useImperativeHandle( ref,() => ({ inp: outCome }), [outCome] );
    const [enableBtn, setEnableBtn] = React.useState(true);
    //延迟5秒才执行的; 可限制频繁操作。
    const throttledUpdateEnableBtn =throttle(setEnableBtn,5000);
    const [doConfirmModify, setDoConfirmModify] = React.useState(false);
    //useReducer我这里不用它的state，只用action，简化变成消息通知或异步的命令。
    //多次点击按钮useReducer这里却不会多次触发的，只有在状态修改了才能触发执行？。
    //useReducer底下state不能简化和省略，会导致不正常。为什么按钮点击会触发了两次一样action？
    //必须从false到true的变化才能触发执行。 true->true不能执行的。  useLayoutEffect
    React.useEffect(() => {
      if(doConfirmModify){
        setStorage({...storage, ...outCome});
        setDoConfirmModify(false);
        throttledUpdateEnableBtn(true);
      }
   }, [doConfirmModify, outCome, storage, setStorage, throttledUpdateEnableBtn] );


    const renderItemsContent =React.useMemo(() => {
      let seq = 0;
      let htmlTxts =[];
      inspectionContent.forEach((rowBigItem, x) => {
        rowBigItem && rowBigItem.items.forEach((item, y) => {
          if(item){
            seq += 1;
            const rowHead =<ItemUniversal key={seq} ref={clRefs.current![recordPrintList.length+seq-1]}  x={x}  y={y}
                                          show={action==='printAll'} inspectionContent={inspectionContent}
                                   alone={false}  procedure={generalFormat[x].items[y].procedure}  details={generalFormat[x].items[y].details}
            />;
            htmlTxts.push(rowHead);
          }
        });
      });
      return ( <React.Fragment key={'item1.1'}>
        {htmlTxts}
      </React.Fragment> );
    }, [action,  clRefs]);

    const {isItemNo, x, y} =verifyAction(action,generalFormat);
    //这里action是 '2.1' ALL none printAll 这样的路由参数 ?readOnly=1&。
    const recordList= React.useMemo(() =>
      {
        if(isItemNo){
          return <React.Fragment>
            <ItemUniversal key={0} ref={null}  x={x}  y={y} show={true} inspectionContent={inspectionContent}
                           procedure={generalFormat[x].items[y].procedure}  details={generalFormat[x].items[y].details}
            />
          </React.Fragment>;
        }else{
          const itemA=recordPrintList.find((one)=>one.itemArea===action);
          if(itemA){
            return <React.Fragment>
              {
                React.cloneElement(itemA.zoneContent as React.ReactElement<any>, {
                  ref: null,
                  key: itemA.itemArea,
                  repId: '227',
                  show: true
                })
              }
            </React.Fragment>;
          }else if(action==='ALL' || action==='printAll'){
            return recordPrintList.map((each, i) => {
              if(each.itemArea==='item1.1')
                return  renderItemsContent;
              else
                return React.cloneElement(each.zoneContent as React.ReactElement<any>, {
                  ref: clRefs.current![i],
                  show: action==='printAll',
                  alone: false,
                  repId: '227',
                  key: i
                });
            });
          }
        }
        return  null;
      }
      ,[action, isItemNo,x,y,clRefs,renderItemsContent]);

    //  console.log("公用配置对象--isItemNo=",isItemNo,"x=", x,"y=",y, generalFormat, "inspectionContent=", inspectionContent);

    return <React.Fragment>
      {recordList}
      { (action==='ALL' || action==='printAll') &&
          <Button size="lg" intent={'primary'}  disabled ={!enableBtn}
                onPress={() =>{   setEnableBtn(false);
                 //这里派发出去editorSnapshot: outCome都是按钮捕获的值，还要经过一轮render才会有最新值。
                 setDoConfirmModify(true);
              }
            }>
            全部输入一起确认
          </Button>
      }
    </React.Fragment>;
  } );

//对应某报告模板下所有编辑修改组件；原始记录打印展示全部列表。項目標記符不能用ALL none preview printAll item1.1保留字。
const recordPrintList =[
  createItem('Survey', <ItemSurveyLinkMan/>),
  createItem('Instrument', <ItemInstrumentTable/>),
  createItem('item1.1', <ItemUniversal x={0} y={0} inspectionContent={inspectionContent}/>),
  createItem('gap', <ItemGapMeasure/>),
  createItem('Appendix', <ItemAppendixB/>),
  createItem('Remark', <ItemRemarks/>),
  createItem('ReCheck', <ItemRecheckResult/>),
  createItem('Conclusion', <ItemConclusion/>),
];

