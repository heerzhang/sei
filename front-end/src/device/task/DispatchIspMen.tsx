/** @jsx jsx */
import { jsx, } from "@emotion/core";
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
import { Link,  } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

//const log = debug("app:Compose");

export interface ComposeProps {
  //id?: string;
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

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const DispatchIspMen: React.FunctionComponent<ComposeProps> = ({
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
  //const {user,} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, ] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
  //弹框钩子 toast({  }) 必须放在组件顶层，不能放在一般函数(异步/回调/触发函数)里面？。
  //没办法，必须要添加setMessage配合toast({ });可以多次setMessage()=异步地。
 // const [message, setMessage] = React.useState(null);
  //特别注意！！
  //父辈们的组件id!缺少key导致：遇到小屏幕轮转显示正常，大屏整个显示模式却必须手动刷新才能切换内容。
  //父组件缺key引起异常：这个组件不会重新render的，defaultTitle变更了，但是title却是没有跟随变化，没有更新本组件？。
  //console.log("来React.useState="+ JSON.stringify(title) +",id="+id+";title="+title+";defaultTitle="+JSON.stringify(defaultTitle));
  const [credit, ] = React.useState(defaultCredit);
  //ingredients 原来是[]数组，改成对象。ingredients.length无定义了。
  const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  //const [, setLocation] = useLocation();
  //这里hoverIngredient是当前高亮选择的某个食材;
 // const [hoverIngredient, setHoverIngredient] = React.useState(null);
  //const hoverIngredientRef = React.useRef(hoverIngredient);
  //const [Options, setOptions] = React.useState({});
  //const {userList:entry, submitfunc, error} = useCreateEntry(Options);

  const {result, submit:updateFunc, error:updateError, } = useDispatchIspMen({
    task: taskId,
    dev: id, username:ingredients && ingredients.ispMen,
    });
  //const {buildTask:returnD} =data||{};
  //useUpdateEntry({ id: ingredients && ingredients.id, info: {...ingredients, id: undefined,address: "大厦" }, });
  //const { params: { id: idww } } = {...props.params};
  console.log("AddToTask页面刷新 router-ID:", id,",dt=,",dt,";ingredients=", ingredients);


  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function updateRecipe(
    id: string,
    {
      title,
      plain,
      ingredients,
      description,
      author,
      image
    }: {
      title: string;
      plain: string;
      ingredients: any[];
      description: string;
      author: string;
      image: string;
    }
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
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
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
          <IconButton
            icon={<IconArrowLeft />}
            component={Link}
            to="/device"
            label="后退"
            replace
            variant="ghost"
            css={{
              marginRight: theme.spaces.sm,
              [theme.mediaQueries.md]: {
                display: "none"     //大屏不需要
              }
            }}
          />
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
              { updateError?  '添加任务失败了':
                 '您已将该任务派工给检验员，检验id号：'+(result && result.id)
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
                  //这里serialize是　src/Editor.jsx:120　自定义函数
                  //const { text, content } = current.serialize();
                  const toSave = {
                    title,
                    description: content,
                    plain: '',
                    author: credit,
                    image,
                    ingredients
                  };
                  if(id) updateRecipe(id, toSave);
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

                      <div key={1}>
                        {editing ? (
                        <div>
                          <ContainLine display={'检验员'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="检验员"
                                value={ingredients.ispMen}
                                onChange={e => {
                                  setIngredients( {
                                    ...ingredients,
                                    ispMen: e.target.value
                                  });
                                }}
                              />
                          </ContainLine>
                          <ContainLine display={'任务日期'}>
                            <TransparentInput
                              autoFocus={true}
                              placeholder="输入日期格式2019-08-03"
                              value={ingredients.date}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  date: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                        </div>
                        ) : null }
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

