/** @jsxImportSource @emotion/react */
import { jsx, } from "@emotion/react";
import * as React from "react";
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
  IconArrowLeft,
} from "customize-easy-ui-component";
import {   useDispatchIspMen } from "./db";

import {Helmet} from "react-helmet";
import { Link as RouterLink } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";
import { useSession } from "../../auth";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

//const log = debug("app:Compose");

interface DispatchIspMenProps {
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

export const DispatchIspMen: React.FunctionComponent<DispatchIspMenProps> = ({
  readOnly,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
  params: { id, taskId},      //来自上级<Route path={"/device/:id/addTask"} />路由器给的:id。
}) => {
  const theme = useTheme();
  const toast = useToast();
  //const ref = React.useRef(null);
  const {user,} = useSession();
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
  console.log("来React.useruseState="+ JSON.stringify(title) +",user=",user);
  const [ingredients, setIngredients] = React.useState<any>( dt||{ispMen: user.username} );
  //const [, setLocation] = useLocation();


  const {result, submit:updateFunc, error:updateError, } = useDispatchIspMen({
    task: taskId,
    dev: id, username:ingredients && ingredients.ispMen,
    });
  console.log("AddToTask页面刷新 router-ID:", id,",dt=,",dt,";ingredients=", ingredients);

  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function updateRecipe(
    id: string
  ) {
    let yes= result && result.id;
    console.log("生成任务－更新: %s", id, yes);
    setLoading(true);
    try {
      //这里放HOOK()报错＝Hooks can only be called inside of the body of a function component.
      //考虑封装适配不同类型的接口，不采用这种：
      //const {data: { buildTask: some }} = await updateFunc();
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
      title: "派工返回了",
      subtitle: '新ISP的ID＝'+result?.id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
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
      <Helmet title={result ? '有结果了' : "新增任务"} />
      <Navbar
        css={{
          zIndex: theme.zIndices.sticky,
          backgroundColor: "white",
          boxShadow: theme.shadows.sm,
          position: "sticky",
          top: 0,
          [theme.mediaQueries.md]: {
            position: "static"
          }
        }}
      >
        <Toolbar
          css={{
            alignItems: "center",
            display: "flex"
          }}
        >
          <RouterLink to="/device">
            <IconButton  noBind  icon={<IconArrowLeft />}
                   variant="ghost"
                   label="后退"
                   size="md"
                   css={{
                     marginRight: theme.spaces.sm,
                     [theme.mediaQueries.md]: {
                       display: "none"
                     }
                   }}
            />
          </RouterLink>
          {editing ? (
            <div css={{ marginLeft: "-0.75rem", flex: 1 }}>
              <TransparentInput
                autoComplete="off"
                autoFocus
                inputSize="lg"
                value={title}
                placeholder="把任务派给某个检验员"
                aria-label="Recipe title"
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          ) : (
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
              { updateError?  '派工任务失败了':
                 '您已将该任务派工给检验员 '
              }
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
                  <MenuItem
                    onPress={() => {
                      setEditing(true);
                    }}
                  >
                    编辑
                  </MenuItem>
                  <MenuItem onPress={() => null }>删除</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  display: !editing && editable ? undefined : "none",
                  marginLeft: theme.spaces.sm
                }}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="显示菜单"
              />
            </ResponsivePopover>

            {editing && id && (
              <Button
                variant="ghost"
                css={{  //小屏这个按钮没有存在价值，顶条左角的后退就可以。
                  //display: "none",
                  [theme.mediaQueries.md]: {
                    display: "inline-flex"
                  },
                  marginLeft: theme.spaces.sm
                }}
                onPress={() => setEditing(false)}
              >
                取消
              </Button>
            )}
            {editing && (
              <Button
                intent="primary"
                disabled={loading}
                css={{ marginLeft: theme.spaces.sm }}
                onPress={() => {
                  if(id) updateRecipe(id);
                }}
               >
                把设备任务派工给该检验员
               </Button>
            )}
          </div>
        </Toolbar>
      </Navbar>

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          //minHeight: '100vh',
          [theme.mediaQueries.md]: {
            //flex: "none",
            //minHeight: "unset",
           // minHeight:'unset',
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
                minHeight: '85vh',
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
                  <Text variant="h5">任务派工向导</Text>
                    <Text
                      css={{
                        flex: 1,
                        textAlign: "center",
                        [theme.mediaQueries.md]: {
                          textAlign: "left"
                        }
                      }}
                      wrap={true}
                      variant="h6"
                      gutter={false}
                    >
                      填检验员账号，以 ,号 来分割多个人, 选择方式：开发中。  敬请期待。
                    </Text>
                    <hr/>
                      <div key={1}>
                        {editing ? (
                        <div>
                          <ContainLine display={'检验员'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="填检验员账号, 以后选择方式。"
                                value={ingredients.ispMen}
                                onChange={e => {
                                  setIngredients( {
                                    ...ingredients,
                                    ispMen: e.target.value
                                  });
                                }}
                              />
                          </ContainLine>

                        </div>
                        ) :
                          result && <Text
                            css={{
                              flex: 1,
                              textAlign: "center",
                              [theme.mediaQueries.md]: {
                                textAlign: "left"
                              }
                            }}
                            wrap={false}
                            variant="h4"
                            gutter={false}
                          >
                            派工结果，得到检验号：{result?.id} 。
                          </Text>
                        }
                      </div>
                </div>
              )}


            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

