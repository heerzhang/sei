/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
//import Editor, { tryValue } from "./Editor";
//import { ImageUpload } from "./ImageUpload";
//import { Image } from "./Image";
//import { Value } from "slate";
import debug from "debug";
//import initialValue from "./value.json";
//import { Ingredient } from "./RecipeList";
import {
  Navbar,
  Toolbar,
  Input,
  Text,
  Button,
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
  IconArrowLeft,
   MenuDivider, IconPackage
} from "customize-easy-ui-component";
import {   useCreateDevice, useUpdateEntry } from "./db";
import {Helmet} from "react-helmet";
import { Link,  useLocation } from "wouter";
import { Link as RouterLink } from "wouter";
//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。
//import toaster from "toasted-notes";

//这是给高亮注释的id/key的，DOM显示需要唯一标识符。
/*let n = 0;
function getHighlightKey() {
  return `highlight_${n++}`;
}
*/
const log = debug("app:Compose");

export interface ComposeProps {
  id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  dt?:any;
  task?:string;
}

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const ComposeDevice: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
  task=null,
}) => {
  const theme = useTheme();
  const toast = useToast();
  //const ref = React.useRef(null);
 // const {user,} = useSession();
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
  const [credit, setCredit] = React.useState(defaultCredit);
  //ingredients 原来是[]数组，改成对象。ingredients.length无定义了。
  const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();
  //这里hoverIngredient是当前高亮选择的某个食材;
 // const [hoverIngredient, setHoverIngredient] = React.useState(null);
  //const hoverIngredientRef = React.useRef(hoverIngredient);
  const [Options, setOptions] = React.useState({});
  const {result:entry, submit:submitfunc, error} = useCreateDevice({oid:"test暂且空着",  ...ingredients});
  const {result, submitfunc:updateFunc, } = useUpdateEntry({
    id: ingredients && ingredients.id,
    unt: 1,
    info: {...ingredients, id: undefined,isps:undefined,pos:undefined,ownerUnt:undefined,__typename:undefined
          ,address: "贵大厦" },
    });
  //useUpdateEntry({ id: ingredients && ingredients.id, info: {...ingredients, id: undefined,address: "大厦" }, });
  console.log("页面刷新钩子ComposeDevice Options=",Options,",id="+id+";task=",task,";dt=",dt,result);
/*
  function onIngredientChange(i: number, value: any) {
    //ingredients[i] = value;
    log("on ingredient change: %o", value);
    setIngredients(value);
  }

  function addNewIngredient() {
    ingredients.push({ name: "", amount: "" });
    setIngredients([...ingredients]);
  }

  function removeIngredient(i: number) {
    ingredients.splice(i, 1);
    setIngredients([...ingredients]);
  }
  */
  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function saveRecipe( a
  ) {
    try {
      setLoading(true);
      console.log("baochun等待之前１ ingredients=", ingredients );
      //这时才去修改submitfunc参数，已经来不及，setOptions异步执行；submitfunc会看见前面的取值。
      setOptions({oid:"test暂且空着",  ...ingredients});
      console.log("baochun等待之前２ ingredients=", ingredients );
      await submitfunc();   //要等待正常的结果应答从后端返回。
      //submitfunc(); 立刻执行后面代码，这样不会等待后端应答的。
      /*点击函数发送给后端服务器，即刻返回到这里了await submitfunc();　这个时候entry还不是后端的应答数据，要等到下一次entry被ＨＯＯＫ修正*/
      console.log("等半天createEntry返回error=",error,"结果",entry );

      //加了await 后的　submitfunc();似乎也不能确保entry非空的，必须等待下一次render()。
      entry && setLocation("/device/" + entry.id, true );
      //原型是 PushCallback = (to: Path, replace?: boolean) => void;
    } catch (err) {
      setLoading(false);
      toast({
        title: "捕获errcc错",
        subtitle: err.message,
        intent: "danger"
      });
      console.log("捕获err打了吗", err);
    }
  }

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
    console.log("updateRecipe更新: %s", id);
    setLoading(true);
    try {
      //这里放HOOK()报错＝Hooks can only be called inside of the body of a function component.
      await updateFunc();
      setEditing(false);
      setLoading(false);
    } catch (err) {
      //这里先要setLoading(),还有err.message而非err；否则很可能也能导致？setMessage:toast()显示异常。
      setLoading(false);
      toast({
        title: "联系出我",
        subtitle: 'title当前是＝:'+err.message+title,
        intent: "danger"
      });
      console.log("捕获err打了吗", err);
    }
    toast({
      title: "wa联系nchen 了",
      subtitle: 'title完成＝:'+title,
      intent: "info"
    });
  }



  //上面这里增加[hoverIngredient]

  //给孙组件slate配置的　注解高亮　装饰函数。
 /*
  function renderAnnotation(props, editor, next) {
    const { children, annotation, attributes } = props;
    const annotationId = annotation.get("data").get("id");
    //这里的annotationId 就是 某个ingredient对象
    const isHovering = hoverIngredientRef.current === annotationId;

    switch (annotation.type) {
      case "highlight":
        return (
          <Tooltip placement="top" content={annotationId.amount}>
            <span
              {...attributes}
              // onMouseEnter={() => {
              //   setHoverIngredient(annotation);
              // }}
              // onMouseLeave={() => {
              //   setHoverIngredient(null);
              // }}
              style={{
                transition: "background 0.3s ease",
                backgroundColor: isHovering
                  ? theme.colors.palette.blue.lightest
                  : hoverIngredientRef.current
                  ? "transparent"
                  : theme.colors.background.tint2
              }}
            >
              {children}
            </span>
          </Tooltip>
        );
      default:
        return next();
    }
  }
*/
  async function handleDelete(id: string) {
    try {
      setLoading(true);
     // await deleteEntry(id);
      setLocation("/",  true );
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast({
        title: "An error occurred. Please try again",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }

  //保存 编辑新的菜谱之后，要修正URL
  React.useEffect(() => {
    entry && ( setLocation("/device/" + entry.id) );
  }, [entry,setLocation]);



  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block"
        }
      }}
    >
      <Helmet title={title ? title : "设备数据维护"} />
      <Global
        styles={{
          ".filepond--wrapper": {
            padding: theme.spaces.lg,
            paddingBottom: 0
          },
          ".filepond--root": {
            marginBottom: 0
          },
          ".filepond--label-action": {
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          },
          ".filepond--label-action > svg": {
            width: "40px",
            height: "40px",
            fill: theme.colors.text.default
          },
          ".filepond--label-action > span": {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: "1px",
            width: "1px",
            margin: "-1px",
            padding: 0,
            overflow: "hidden",
            position: "absolute"
          },
          ".filepond--panel-root": {
            backgroundColor: theme.colors.background.tint1
          },
        }}
      />
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
          <IconButton
            icon={<IconArrowLeft />}
            label="后退"
            variant="ghost"
            css={{
              marginRight: theme.spaces.sm,
              [theme.mediaQueries.md]: {
                display: "none"     //大屏不需要
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
                placeholder="增加新的检验设备"
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
              {dt.cod}
            </Text>
          )}
          <div>
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
                  <MenuItem onPress={() => handleDelete(id)}>删除</MenuItem>
                  <MenuDivider />
                  <MenuItem contentBefore={<IconPackage />}  to={"/device/"+id+"/addTask"}>
                    生成任务
                  </MenuItem>
                  <MenuItem contentBefore={<IconPackage />}  to={"/device/"+id+"/task/"+task}>
                    准备派工给检验员
                  </MenuItem>
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
                disabled={false}
                css={{ marginLeft: theme.spaces.sm }}
                onPress={() => {
                  //按钮里面看不到最新的input取值的。
                  //const { text, content } = current.serialize();
                  const toSave = {
                    title,
                    description: content,
                    plain: '',
                    author: credit,
                    image,
                    ingredients
                  };

                  id ? updateRecipe(id, toSave) : saveRecipe(null);
                }}
               >
                保存
               </Button>
            )}
          </div>
        </Toolbar>
      </Navbar>

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
              {ingredients && (
                <div>
                  <Text variant="h5">设备明细信息</Text>

                      <div key={1}>
                        {editing ? (
                        <div>
                          <ContainLine display={'设备号'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="那一台电梯？"
                                value={ingredients.cod||''}
                                onChange={e => {
                                  setIngredients( {
                                    ...ingredients,
                                    cod: e.target.value
                                  });
                                }}
                              />
                          </ContainLine>
                          <ContainLine display={'监察识别码'}>
                            <TransparentInput
                              autoFocus={true}
                              placeholder="可以不要输入"
                              value={ingredients.oid||''}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  oid: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                        </div>
                        ) : (
                          <div
                            css={{
                              backgroundColor: false
                                ? theme.colors.palette.blue.lightest
                                : "transparent",
                              display: "flex",
                              marginLeft: "-0.25rem",
                              paddingLeft: "0.25rem",
                              marginRight: "-0.25rem",
                              paddingRight: "0.25rem",
                              // borderRadius: "0.25rem",
                              marginBottom: theme.spaces.xs,
                              justifyContent: "space-between",
                              [theme.mediaQueries.md]: {
                                width: "300px"
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
                              设备号：{dt.cod}
                            </Text>
                            <div
                              css={{
                                flex: 1,
                                borderBottom: `1px dashed ${
                                  theme.colors.border.muted
                                }`,
                                marginBottom: "6px"
                              }}
                            />
                            <Text
                              css={{
                                paddingLeft: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              监察识别码：{dt.oid}
                            </Text>
                          </div>
                        )}
                      </div>


                </div>
              )}

              <LayerLoading loading={loading} />
              {editing && <Button
                  intent="primary"
                  disabled={false}
                  css={{ marginLeft: theme.spaces.sm }}
                  onPress={() => {  //按钮里面看不到最新的input取值的。
                     saveRecipe(null);
                  }}
                  >
                从旧平台导入一个设备吧
                </Button>
              }
            </div>
          </Container>
        </div>
      </div>

    </div>
  );
};

interface TransparentInputProps extends InputBaseProps {}

const TransparentInput = (props: TransparentInputProps) => {

  return (
    <Input
      css={{
        background: "none",
        border: "none",
        boxShadow: "none",
        // paddingTop: theme.spaces.xs,
        // paddingBottom: theme.spaces.xs,
        ":focus": {
          outline: "none",
          boxShadow: "none",
          background: "none"
        }
      }}
      {...props}
    />
  );
};

const Contain = props => {
  return (
    <div
      css={{
        marginTop: "-0.25rem",
        marginLeft: "-0.75rem",
        marginRight: "-0.75rem"
      }}
      {...props}
    />
  );
};
//其余的属性，({ display, children, ...props })  => {
const ContainLine =({ display, children, ...props })  => {
  const theme = useTheme();
  return (
    <div
      css={{
     //   marginTop: "-0.25rem",
     //   marginLeft: "-0.75rem",
     //   marginRight: "-0.75rem"
      }}
      {...props}
    >

      <div
        css={{
          backgroundColor: false
            ? theme.colors.palette.blue.lightest
            : "transparent",
          display: "flex",
          [theme.mediaQueries.md]: {
            maxWidth: "400px"
          }
        }}
      >
        <Text
          css={{
            display: "block",
            width: "100%",
            padding: "0.5rem 0.75rem"   //无法和输入组建的大小联动。
          }}
        >
          {display}
          </Text>

        {children}

      </div>

    </div>
  );
};


//注意：component is changing an uncontrolled input of type undefined to be controlled：使得输入捕获异常．
