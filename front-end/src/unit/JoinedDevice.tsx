/** @jsxImportSource @emotion/react */
//import { jsx, Global } from "@emotion/react";
import * as React from "react";

import {
  Text,
  useTheme,
  LayerLoading,
  Container,
  Button, IconArrowRight
} from "customize-easy-ui-component";

//import { useSession } from "../auth";
//import {Helmet} from "react-helmet";
import {  useLocation } from "wouter";
//import { Link as RouterLink } from "wouter";
//import { useCancellationTask } from "./task/db";
import { DevfilterContext } from "../context/DevfilterContext";


interface JoinedDeviceProps {
  id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  eqp?:any;
}

export const JoinedDevice: React.FunctionComponent<JoinedDeviceProps> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  eqp=null,
}) => {
  const theme = useTheme();
 // const toast = useToast();
  //const eqpId=id;
  const [loading, ] = React.useState(false);
 // const [editing, setEditing] = React.useState(!readOnly);
 // const [image, ] = React.useState(defaultImage);
 // const [title, setTitle] = React.useState(defaultTitle);
 // const [taskId, setTaskId] = React.useState(null);
  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();
  const {filter, setFilter} =React.useContext(DevfilterContext);
  /*const {result, submit:updateFunc, } = useCancellationTask({
    taskid: taskId, reason:'测试期直接删'
  });*/
  //过滤对象or参数取值K/V；有些保留key不能随意使用。
  const  devFilterArgs={"ownerId": id ,"useUid": undefined};
  const  devFilterArgsUseU={"useUid": id,"ownerId":undefined };

  console.log("页面刷新钩子AttachedTask entry=",　",设备id="+id+";task=",task,";eqp=",eqp ,"filter=",filter);
/*
  async function handleDelete(id: string) {
    try {
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端报错",
        subtitle: err.message,
        intent: "danger"
      });
      return;
    }
    setLocation("/device/"+eqpId,  { replace: true } );
  }
  */
  //跳转前分解步骤：点击doConfirm确认，异步完成了，然后才做路由切换。
  const [doConfirm, setDoConfirm] = React.useState(false);
  React.useEffect(() => {
    if(doConfirm){
      filter && ( setLocation('/device') );
    }
  }, [doConfirm,filter,setLocation]);


  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block"
        }
      }}
    >
      <hr/>
      <Text
        css={{
          flex: 1,
          textAlign: "center",
          [theme.mediaQueries.md]: {
            textAlign: "left"
          }
        }}
        wrap={false}
        variant="h5"
        gutter={false}
      >
        {eqp?.id}名下关联设备
      </Text>

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          [theme.mediaQueries.md]: {
            flex: "none"
          }
        }}
      >
        <div>

          <Container>
            <div
              css={{
                paddingTop: theme.spaces.lg,
                paddingBottom: theme.spaces.lg
              }}
            >
                <div >

                          <div
                            css={{
                              backgroundColor: false
                                ? theme.colors.palette.blue.lightest
                                : "transparent",
                              display: "flex",
                              marginBottom: theme.spaces.xs,
                              justifyContent: "space-between",
                              [theme.mediaQueries.md]: {
                                width: "600px"
                              }
                            }}
                          >
                            <Text
                              css={{
                                paddingRight: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                            设备 {id}
                            </Text>

                            <Text
                              css={{
                                paddingLeft: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              状态：{eqp.status||''}
                            </Text>

                           <Button
                              size="lg"
                              intent="primary"
                              iconAfter={<IconArrowRight />}
                              onPress={ async () => {
                                //这里派发出去editorSnapshot: outCome {...storage, ...outCome}都是按钮捕获的值，还要经过一轮render才会有最新值。
                                await setFilter({...filter, ...devFilterArgs});
                                await setDoConfirm(true);
                                //这里还要加上async await才能真的保证不报unmounted错;
                              } }
                            >
                              去找该单位设备
                            </Button>

                            <Button
                              size="lg"
                              intent="primary"
                              iconAfter={<IconArrowRight />}
                              onPress={ async () => {
                                //这里派发出去editorSnapshot: outCome {...storage, ...outCome}都是按钮捕获的值，还要经过一轮render才会有最新值。
                                await setFilter({...filter, ...devFilterArgsUseU});
                                await setDoConfirm(true);
                              } }
                            >
                              该单位正在使用设备
                            </Button>
                          </div>

                      </div>
            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

