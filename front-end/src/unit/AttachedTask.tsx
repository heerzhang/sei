/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";

import {
  Navbar,
  Toolbar,
  Input,
  Text,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  InputBaseProps,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconMoreVertical,
  MenuDivider, IconPackage, Button, IconChevronDown
} from "customize-easy-ui-component";

//import { useSession } from "../auth";
import {Helmet} from "react-helmet";
import { Link,  useLocation } from "wouter";
import { Link as RouterLink } from "wouter";
import { useCancellationTask } from "./task/db";


interface AttachedTaskProps {
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

export const AttachedTask: React.FunctionComponent<AttachedTaskProps> = ({
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
  const toast = useToast();
  const eqpId=id;
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
  const [taskId, setTaskId] = React.useState(null);
  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();
  const {result, submit:updateFunc, } = useCancellationTask({
    taskid: taskId, reason:'测试期直接删'
  });
  //console.log("页面刷新钩子AttachedTask entry=",　",设备id="+id+";task=",task,";eqp=",eqp);

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
    setLocation("/device/"+eqpId,  true );
  }


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
        {eqp.cod}关联活动任务
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
              {task && task.map(each => {
                let myIsp= each.isps?.find((it,i)=>{return  it.dev?.id===eqp.id });
                //let hasIsp= (myIsp!==null);  不好使！　undefined的！
                let hasIsp= !!myIsp;
                console.log("刷新 奇怪啊hasIsp:", hasIsp,",myIsp=",myIsp,";each.isps=", each.isps);
                return <div key={each.id}>
                        {
                          (
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
                            任务号 {each.id}
                            </Text>

                            <Text
                              css={{
                                paddingLeft: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              状态：{each.status||''}
                            </Text>
                            {hasIsp? <Link  to={"/inspect/" + myIsp.id}>
                                {myIsp? '检验ISP详情' : '逻辑异常'}
                              </Link>
                               :
                              <Link  to={"/device/"+eqp.id+"/task/"+each.id+'/dispatch'}>
                                先要去派工
                              </Link>
                            }
                            <ResponsivePopover
                              content={
                                <MenuList>
                                  <MenuItem disabled={hasIsp} onPress={ async () => {
                                      await setTaskId(each.id);
                                      handleDelete(each.id)
                                    }
                                  }>注销任务
                                  </MenuItem>
                                  <MenuItem contentBefore={<IconPackage />}  disabled={hasIsp}
                                    onPress={() => {
                                       setLocation("/device/"+eqp.id+"/task/"+each.id+'/dispatch', true);
                                     } }>
                                  有任务就派工给检验员
                                  </MenuItem>
                                </MenuList>
                              }
                            >
                              <Button  size="md" iconAfter={<IconChevronDown />} variant="ghost" css={{whiteSpace:'unset'}}>
                                {`${each.date||''}`}
                              </Button>
                            </ResponsivePopover>
                          </div>
                        )
                        }
                      </div>
              } )}

            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

