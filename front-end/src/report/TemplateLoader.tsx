/** @jsxImportSource @emotion/react */
//import { jsx, } from "@emotion/react";
import * as React from "react";
import {
  useTheme,
  Button,
  useToast,
  LayerLoading,
  Text,
  Navbar,
  Toolbar,
  IconButton,
  IconArrowLeft,
  ResponsivePopover,
  MenuList,
  MenuItem,
  IconMoreVertical
} from "customize-easy-ui-component";

import { InternalItemHandResult, OriginalViewProps, ReportViewProps } from "./comp/base";
import { useCommitOriginalData } from "./db";

import { EditStorageContext } from "./StorageContext";
import { Link as RouterLink } from "wouter";
import { TransparentInput } from "../comp/base";
import { useThrottle } from "../hooks/useHelpers";

/*
错误！ 本地重复定义了外部全局实例，结果本文件内只能看到 自己的EditStorageContext，而不是公用的哪一个。
export const EditStorageContext = React.createContext<EditStorageContextType | null>(
  null
);
*/


interface RecordStarterProps {
  id: string;
  action: string;
  source: any;
  template: React.ReactElement<React.ForwardRefRenderFunction<InternalItemHandResult,OriginalViewProps>>;
  templateID: string;
  verId: string;
}
//这才是右边的！，编辑，或原始记录的查看：
export const RecordStarter: React.FunctionComponent<RecordStarterProps> = ({
    id,
    action,
    source,
    template,
    templateID,
    verId,
    ...other
 }) => {
  const theme = useTheme();
  const toast = useToast();
  //初始化不可以直接取React.useState(source || {})，不然路由器切换就变成旧source。新修改被抛弃了。
  const {storage, } =React.useContext(EditStorageContext);
  //const [enable, setEnable] = React.useState(true);
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
//旧模式淘汰！  const ref =React.useRef<InternalItemHandResult>(null);

  //ref可以共用current指向最新输入过的子组件；但父组件对.current的最新变化无法实时感知，只能被动刷新获知current变动。
  //子组件利用useImperativeHandle机制把数据回传给父组件，配套地父辈用ref来定位子组件。
  //保存按钮点击后必须首先触发template动态加载的子组件即TemplateView的做1次render()后，ref.current.inp才能收到儿孙组件的最新数据。
//  const newOut={ ...(ref.current&&ref.current.inp) };

  //审核保存?对应数据deduction结论栏目＋审核手动修改；适用于出具正式报告，正式报告只读取deduction部分。依据审核保存>随后才是原始记录复检>初检data。
  //若复检保存 ，复检rexm，正检data。
  const {result, submit:updateFunc,loading } = useCommitOriginalData({
    id,  operationType:1,
    data:  JSON.stringify(storage || source) ,
    deduction:{emergencyElectric:'45,423'}
  });

  //console.log("RecordView捕获,切花source=", source,"新storage=",storage);

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
    console.log("保存返回了＝", result,"yes=", yes);
    toast({
      title: "保存返回了",
      subtitle: '报告ID：'+id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
  }

  //const [throttledUpdateBackend, timer1]= useThrottle(updateRecipe,0);
  //延迟3秒才执行的; 可限制频繁操作，若很多下点击的3秒后触发2次。
  //【注意】延迟时间设置后，页面切换会报错，组件已经卸载，还来setEnable啊，状态错误！
  const {doFunc:throttledUpdateRecipe, ready} = useThrottle(updateRecipe,5000);
  const refEditor =React.useRef<InternalItemHandResult>(null);
  const {doFunc:throttleDoConfirm, ready:confirmEnable} =useThrottle((refEditor as any)?.current?.doConfirm);
  //const [throttledUpdateEnable, isReady] = useThrottle(setEnable, 5000);
  /*
  React.useEffect(() => {
    return () => {
      clearTimeout(timer2);
    };
  }, [timer2]);
  */
  //可是这里return ；将会导致子孙组件都会umount!! 等于重新加载==路由模式刷新一样； 得权衡利弊。
  // if(updating)  return <LayerLoading loading={updating} label={'正在获取后端应答，加载中请稍后'}/>;
  //管道单线图，数量大，图像文件。可仅选定URL，预览图像。但是不全部显示出来，微缩摘要图模式，点击了才你能显示大的原图。
  /*
  async function toSaveBackEnd() {
      //手机上更新模板TemplateView子组件重做render触发失效。只好采用延迟策略，每个分区项目的保存处理前准备，作一次render完了，才能发送数据给后端。
      setEnable(false);
      await updateRecipe('1');    //阻塞了await关键字只能用在aync定义的函数内。

    throttledUpdateEnable(true);
  }
*/

  if (!id) {
    return null;
  }

  //无法把<EditStorageContext.Provider value={{storage,setStorage}}>放这附近能产生效果，必须提升到顶级路由组件内去做。
  return (
    <React.Fragment>
      <Navbar
        css={{
          zIndex: theme.zIndices.sticky,
          backgroundColor: "white",
          boxShadow: theme.shadows.sm,
          position: "sticky",
          top: 0,
          "@media (min-width:800px)": {
            position: "static"
          },
          "@media print": {
            display: "none"
          }
        }}
      >
        <Toolbar
          css={{
            alignItems: "center",
            display: "flex"
          }}
        >
          <RouterLink  to={`/report/${templateID}/ver/${verId}/none/${id}`}>
            <IconButton  noBind
              icon={<IconArrowLeft />}
              label="后退"
              variant="ghost"
              css={{
                marginRight: theme.spaces.sm,
                "@media (min-width:800px)": {
                  display: "none"
                }
              }}
            />
          </RouterLink>
          {(action==='ALL'|| action==='printAll') ? (
            <div css={{ marginLeft: "-0.75rem", flex: 1 }}>
              <TransparentInput
                autoComplete="off"
                autoFocus
                inputSize="lg"
                value={action}
                placeholder="报告的详细可打印信息"
                aria-label="Recipe title"
                onChange={e => {
                }}
              />
            </div>
          ) : (
            <Text
              css={{
                flex: 1,
                textAlign: "center",
                "@media (min-width:800px)": {
                  textAlign: "left"
                }
              }}
              wrap={false}
              variant="h5"
              gutter={false}
            >
              报告ID：{id}
            </Text>
          )}
          <div
            css={{
              display: 'inline-flex',
            }}
          >
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem disabled={!ready} onPress={ ()=>throttledUpdateRecipe(id) }>
                    保存到服务器
                  </MenuItem>
                  <MenuItem
                    onPress={() => {
                    }}
                  >
                    编辑
                  </MenuItem>
                  <MenuItem disabled={!confirmEnable}
                       onPress={() => {
                           if(throttleDoConfirm)  throttleDoConfirm(true);
                           else (refEditor as any).current!.doConfirm(true);
                       } }>
                  全部项目一起确认
                  </MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  display: true ? undefined : "none",
                  marginLeft: theme.spaces.sm,
                }}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="显示菜单"
              />
            </ResponsivePopover>
            {(
              <Button
                css={{
                  marginLeft: theme.spaces.sm,
                  "@media (max-width:799px)": {
                    display: "none"
                  }
                }}
                intent={'warning'}
                disabled ={!ready}
                loading ={loading}
                onPress={ ()=>throttledUpdateRecipe(id) }
              >
              保存到服务器
              </Button>
            )}
          </div>
        </Toolbar>
      </Navbar>
      <div  css={{
        "@media not print": {
          display: "none"
        }
      }}>
        <Text variant="h4" css={{textAlign:'center'}}>福建省特种设备检验研究院</Text>
         <Text>
         本原始记录对应的报告模板类型：{templateID}，版本：{verId}，报告ID：{id}
         </Text>
        <hr/>
      </div>
      {
        //useMemo使用后：各分区项目子组件inp各自独立的，分区项目子组件内若使用setInp(null) 清空重置后，无法靠重新拉取后端数据来保证恢复显示。
        //项目子组件使用setInp(null) 重置后，若上级组件重新取后端数据没变化的，也必须再次路由后再进入才可以让各分区项目子组件render恢复显示数据。
        React.cloneElement(template as React.ReactElement<any>, {
          ref: refEditor,
          inp: source,
          action,
          repId: id,
        })
      }
     {/*确认修改按钮，需要每个当前检验项目的编辑器inp，所以无法提升到这个层次做触发*/}
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={!ready}
        loading ={loading}
        onPress={ ()=>throttledUpdateRecipe(id) }
      >保存到服务器</Button>
      <LayerLoading loading={loading} />
    </React.Fragment>
  );
}





interface ReportStarterProps {
  id: string;
  source: any;
  template: React.ReactElement<React.ForwardRefRenderFunction<InternalItemHandResult,ReportViewProps>>;
}
//这才是右边的！，编辑，或原始记录的查看：
export const ReportStarter: React.FunctionComponent<ReportStarterProps> = ({
                                                                             id,
                                                                             source,
                                                                             template,
                                                                             ...other
                                                                           }) => {
  //初始化不可以直接取React.useState(source || {})，不然路由器切换就变成旧source。新修改被抛弃了。
 // const {storage, } =React.useContext(EditStorageContext);
  //console.log("ReportStarter捕获,切花source=", source,"新storage=",storage);
  if (!id) {
    return null;
  }

  //无法把<EditStorageContext.Provider value={{storage,setStorage}}>放这附近能产生效果，必须提升到顶级路由组件内去做。
  return (
    <React.Fragment>
      {
        //useMemo使用后：各分区项目子组件inp各自独立的，分区项目子组件内若使用setInp(null) 清空重置后，无法靠重新拉取后端数据来保证恢复显示。
        //项目子组件使用setInp(null) 重置后，若上级组件重新取后端数据没变化的，也必须再次路由后再进入才可以让各分区项目子组件render恢复显示数据。
        React.cloneElement(template as React.ReactElement<any>, {
          source,
          repId: id,
        })
      }
    </React.Fragment>
  );
}

