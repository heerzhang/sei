/** @jsxImportSource @emotion/react */
import { jsx, Global } from "@emotion/react";
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
  MenuDivider, IconPackage, Check
} from "customize-easy-ui-component";
import {   useCreateDevice, useUpdateEntry } from "./db";
import {Helmet} from "react-helmet";
import { Link,  useLocation } from "wouter";
import { Link as RouterLink } from "wouter";


const log = debug("app:Compose");

interface ComposeDeviceProps {
  id?: string;
  readOnly?: boolean;
  dt?:any;
}

export const ComposeDevice: React.FunctionComponent<ComposeDeviceProps> = ({
  readOnly,
  id,
  dt=null,
}) => {
  const theme = useTheme();
  const toast = useToast();
 // const {user,} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  /* const [content, ] = React.useState(() => {
        return defaultDescription
          ? ''
          : null;
      });　 */

  //这里ingredients挂载初始化后只能setIngredients改了，useState()后面参数变动就不再起作用了。
  const [ingredients, setIngredients] = React.useState<any>( dt||{ unit:{company:true} } );
  console.log("刚ComposeDevice经过EQPis",dt,"进行中id=",id,"ingredients=",ingredients);
  const [, setLocation] = useLocation();

  const [Options, setOptions] = React.useState({});
  const {result:entry, submit:submitfunc, error} = useCreateDevice({id:"1",  ...ingredients});
  /*
  const {result, submitfunc:updateFunc, } = useUpdateEntry({
    id: ingredients && ingredients.id,
    unt: 1,
    info: {...ingredients, id: undefined,isps:undefined,pos:undefined,ownerUnt:undefined,__typename:undefined
          ,address: "贵大厦" },
    });
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
      entry && setLocation("/unit/" + entry.id, { replace: true } );
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

  //保存 编辑新的菜谱之后，要修正URL
  React.useEffect(() => {
    entry && ( setLocation("/unit/" + entry.id) );
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
      <Helmet title={"单位信息"} />

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
                  <Text variant="h5">单位相关信息</Text>

                      <div key={1}>
                        {editing ? (
                        <div>
                          <ContainLine display={'选择类型，是组织企业还是个人'}>
                            <Check label={'是企业'}
                                   checked= {ingredients.unit?.company}
                                   onChange={e => {
                                     setIngredients( {
                                       ...ingredients,
                                       unit: { ...ingredients.unit, company: !ingredients.unit?.company }
                                     });
                                   }  }
                            />
                          </ContainLine>
                          <ContainLine display={ingredients.unit?.company? '组织企业名称':'个人姓名'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="那一台电梯？"
                                value={ingredients.unit?.name||''}
                                onChange={e => {
                                  setIngredients( {
                                    ...ingredients,
                                    unit: { ...ingredients.unit, name: e.target.value }
                                  });
                                }}
                              />
                          </ContainLine>
                          <ContainLine display={'统一社会信用代码/身份证号码'}>
                            <TransparentInput
                              autoFocus={true}
                              placeholder="导入的情形可以不填写"
                              value={ingredients.unit?.no||''}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  unit: {...ingredients.unit, no: e.target.value}
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
                                width: "500px"
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
                              单位名称：{dt?.company?.name ||dt?.person?.name}
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
                              单位识别码：{dt?.company?.no ||dt?.person?.no}
                            </Text>
                          </div>
                        )}
                        <br/>
                        <Text>暂时无独立单位库，待完善</Text>
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
                从外部库关联生成一个单位吧
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
