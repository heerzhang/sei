
import { jsx, } from "@emotion/react";
import * as React from "react";
//import { Value } from "slate";
import {
  Navbar,
  Toolbar,
  Text,
  Button,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconMoreVertical,
  IconArrowLeft, Input, InputGroupLine
} from "customize-easy-ui-component";
import {   useAddToTask } from "../db";
//import { useSession } from "../auth";
import { Helmet } from "react-helmet";
import { Link as RouterLink, Link } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";
//import { awaitExpression } from "@babel/types";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。


export interface ComposeProps {
  id: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  dt?:any;
  params?:any;   //上级路由器传入的参数。
}
//这种路由写法：params:{ id }是空的，不会接收上级<Route />路由器给的:id。
export const AddToTask: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
  id
}) => {
  const theme = useTheme();
  const toast = useToast();
//  const ref = React.useRef(null);
//  const {user,} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, ] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });
  const [image, ] = React.useState(defaultImage);

  const [title, setTitle] = React.useState(defaultTitle);

  const [credit, ] = React.useState(defaultCredit);
  //ingredients 原来是[]数组，改成对象。ingredients.length无定义了。
  const [ingredients, setIngredients] = React.useState<any>( {dep:'二部'　} );

  console.log("AddToTask页面刷新id:", id ,"dt=",dt);

  const {result, submit:updateFunc, error:updateError, } = useAddToTask({
    dep: ingredients && ingredients.dep,
    devs: id, date:ingredients && ingredients.date,
    });

  async function updateRecipe(
    id: string
  ) {
    let yes= result && result.id;
    setLoading(true);
    try {
      await updateFunc();
      //等待后端服务器处理完成才能继续运行下面的代码。可长时间等待，挂着页面10分钟都允许。
       setEditing(false);
      setLoading(false);
    } catch (err) {
      //这里先要setLoading(),还有err.message而非err；否则很可能也能导致？setMessage:toast()显示异常。
      setLoading(false);
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
      //很多错误是在这里捕获的。
      console.log("useAddToTask返回 捕获err", err);
    }
    //这里无法获得result值，就算所在组件顶层已经获得result值，这里可能还是await () 前那样null;
     console.log("生成任务返回了＝", result,"yes=", yes);
    toast({
      title: "生成任务返回了",
      subtitle: '加入，dev ID＝'+id,
      intent: "info"
    });

  }


  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={"新增检验任务"} />
      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          [theme.mediaQueries.md]: {
            height: "auto",
            display: "block",
          }
        }}
      >
        <div>

          <Container>
            <div
              css={{
                display: 'flex',
                alignItems:'center',
                justifyContent:'center',
                minHeight: '75vh',
                [theme.mediaQueries.md]: {
                  paddingTop: theme.spaces.lg,
                  paddingBottom: theme.spaces.lg,
                  minHeight:'unset',
                }
              }}
            >
              {ingredients && (
                <div
                  css={{
                  width:'100%',
                }}
                >
                  <Text variant="h5">任务明细信息</Text>

                      <div key={1}>
                        {editing ? (
                        <div>
                          <Text  variant="h6">任务号已经有的要填（合并任务），否则自动生成新的任务号；任务到期日必填</Text>
                          <ContainLine display={'任务号'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="已有任务号的可填，也可自动生成"
                                value={ingredients.task}
                                onChange={e => {
                                  setIngredients( {
                                    ...ingredients,
                                    task: e.target.value
                                  });
                                }}
                              />
                          </ContainLine>
                          <ContainLine display={'部门号'}>
                            <TransparentInput
                              autoFocus={true}
                              placeholder="输入部门号"
                              value={ingredients.dep}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  dep: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                          <ContainLine display={'任务到期日期'}>
                            <TransparentInput
                              type='date'
                              value={ingredients.date||''}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  date: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                        </div>
                        )
                        :
                        <Text variant="h6">生成的新任务ID： {result?.id}</Text>
                        }
                      </div>


                </div>
              )}


            </div>
            {editing && <Button size={'lg'}
                  intent="primary"
                  disabled={loading || !(ingredients?.date)}
                  css={{ marginLeft: theme.spaces.sm }}
                  onPress={() => {
                    if(id) updateRecipe(id);
                  }}
                >
                  为该设备添加任务
                </Button>
            }
          </Container>

        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

