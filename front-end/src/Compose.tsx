
import { jsx, Global } from "@emotion/react";
import * as React from "react";
import Editor, { tryValue } from "./Editor";
import { ImageUpload } from "./ImageUpload";
import { Image } from "./Image";
import { Value } from "slate";
import debug from "debug";
import initialValue from "./value.json";
import { Ingredient } from "./RecipeList";
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
  IconX,
  IconMoreVertical,
  IconArrowLeft,
  Tooltip
} from "customize-easy-ui-component";
import { getUserFields,  deleteEntry, updateEntry, useCreateEntry  } from "./db";
import { useSession } from "./auth";
import {Helmet} from "react-helmet";
import { Link,  useLocation } from "wouter";


//这是给高亮注释的id/key的，DOM显示需要唯一标识符。
let n = 0;

function getHighlightKey() {
  return `highlight_${n++}`;
}

const log = debug("app:Compose");

export interface ComposeProps {
  id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: Ingredient[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
}

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const Compose: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = ""
}) => {
  const theme = useTheme();
  const toast = useToast();
  const ref = React.useRef(null);
  const {user,} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, setContent] = React.useState(() => {
    return defaultDescription
      ? tryValue(defaultDescription)
      : Value.fromJSON(initialValue);
  });
  const [image, setImage] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
  //特别注意！！
  //父辈们的组件id!缺少key导致：遇到小屏幕轮转显示正常，大屏整个显示模式却必须手动刷新才能切换内容。
  //父组件缺key引起异常：这个组件不会重新render的，defaultTitle变更了，但是title却是没有跟随变化，没有更新本组件？。
  //console.log("来React.useState="+ JSON.stringify(title) +",id="+id+";title="+title+";defaultTitle="+JSON.stringify(defaultTitle));
  const [credit, setCredit] = React.useState(defaultCredit);
  const [ingredients, setIngredients] = React.useState<Ingredient[]>(
    defaultIngredients || [
      {
        name: "",
        amount: ""
      }
    ]
  );
  const [, setLocation] = useLocation();
  //这里hoverIngredient是当前高亮选择的某个食材;
  const [hoverIngredient, setHoverIngredient] = React.useState(null);
  const hoverIngredientRef = React.useRef(hoverIngredient);
  //无法使用云函数，改成graphQL的钩子模式。
  const {setOptions,userList:entry, submitfunc, } = useCreateEntry();

  console.log("ComposeCreateEntry钩子entry="+ JSON.stringify(entry) +",id="+id+";title="+title+";defaultTitle="+defaultTitle);

  React.useEffect(() => {
    hoverIngredientRef.current = hoverIngredient;
  }, [hoverIngredient]);

  function onIngredientChange(i: number, value: Ingredient) {
    ingredients[i] = value;
    log("on ingredient change: %o", ingredients);
    setIngredients([...ingredients]);
  }

  function addNewIngredient() {
    ingredients.push({ name: "", amount: "" });
    setIngredients([...ingredients]);
  }

  function removeIngredient(i: number) {
    ingredients.splice(i, 1);
    setIngredients([...ingredients]);
  }
  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function saveRecipe({
    title,
    plain,
    ingredients,
    description,
    author,
    image
  }: {
    title: string;
    plain: string;
    ingredients: Ingredient[];
    description: string;
    author: string;
    image: string;
  }) {
    log("create entry");

    try {
      setLoading(true);
      console.log("进入createEntry　ingredients="+ JSON.stringify(ingredients) );
      setOptions({
        title,
        plain,
        userId: user.uid,
        description,
        createdBy: getUserFields(user),
        ingredients: JSON.stringify( ingredients.filter(ing => ing.name) ),
        image,
        author
      });
      await submitfunc();
      /*点击函数发送给后端服务器，即刻返回到这里了await submitfunc();　这个时候entry还不是后端的应答数据，要等到下一次entry被ＨＯＯＫ修正*/
      console.log("等半天createEntry返回entry="+ JSON.stringify(entry) );
     /* const entry = await createEntry({
        title,
        plain,
        userId: user.uid,
        description,
        createdBy: getUserFields(user),
        ingredients: ingredients.filter(ing => ing.name),
        image,
        author
      });*/
      //加了await 后的　submitfunc();似乎也不能确保entry非空的，必须等待下一次render()。
      entry && setLocation("/chaipu/" + entry.id,  { replace: true }  );
      //原型是 PushCallback = (to: Path, replace?: boolean) => void;
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast({
        title: "错误！. Please try again",
        subtitle: err.message,
        intent: "danger"
      });
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
      ingredients: Ingredient[];
      description: string;
      author: string;
      image: string;
    }
  ) {
    log("update entry: %s", id);
    setLoading(true);
    try {
      await updateEntry(id, {
        title,
        plain,
        description,
        createdBy: getUserFields(user),
        ingredients: ingredients.filter(ing => ing.name),
        image,
        author
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred. Please try again",
        subtitle: err.message,
        intent: "danger"
      });
    }
    setLoading(false);
  }

  //副作用钩子useEffect(,)第二参数null是每次都要做的，第二参数若是[]数组的就是只做一次的。
  // this is horribly inefficient...
  React.useEffect(() => {
    const slate = ref.current;    　//这是菜谱描述description/plain的编辑器组件。
    if (!slate) {
      return;
    }
    const { editor } = slate;
    const { value } = editor;
    const { document, annotations } = value;
    console.log("副作用钩子ingredients=",ingredients ,",描述编辑器=",document,";annotations=",annotations);
    //从菜谱描述description编辑器，查找出和另外一个组件的文字相匹配的关键字，特别显示处理。
    editor.withoutSaving(() => {
      annotations.forEach((ann: any) => {
        if (ann.type === "highlight") {
          editor.removeAnnotation(ann);
        }
      });
      //清楚旧的highlight显示；　依照新的ingredients重来。
      for (const [node, path] of document.texts()) {
        const { key, text } = node;
          //这里key就是一行文字的标识符。
        //console.log("副作用钩子of .texts key=",key,",text=",text);
        ingredients.forEach(ing => {
          const normalized = ing.name.toLowerCase();
          if(normalized.length<=0)   return;    //必须非空否则死循环
          const parts = text.toLowerCase().split(normalized);
          let offset = 0;
        　//根据材料表ingredients的各材料的名字来，对描述description文本突出显示某食材名。
          parts.forEach((part, i) => {
            if (i !== 0) {
              editor.addAnnotation({
                key: getHighlightKey(),
                type: "highlight",
                data: { id: ing },
                //关键的data.id实际就是　某食材　对象ing。某个ingredient对象；　
                anchor: { path, key, offset: offset - normalized.length },
                focus: { path, key, offset }
              });
            }
            //这part就是text,;　没找到就i=0 字符串数组只有一个[];
            //console.log("副作用钩子s.forEach　ing=",ing ,",part=",part,";i="+i);
            offset = offset + part.length + normalized.length;
          });
        });

      }
    });
  }, [hoverIngredient, ingredients] );
  //上面这里增加[hoverIngredient]

  //给孙组件slate配置的　注解高亮　装饰函数。
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

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      await deleteEntry(id);
      setLocation("/",  { replace: true } );
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
    entry && ( setLocation("/chaipu/" + entry.id) );
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
      <Helmet title={title ? title : "新增菜谱"} />
      <Global
        styles={{
          ".Editor": {
            fontFamily: theme.fonts.base,
            color: theme.colors.text.default,
            lineHeight: theme.lineHeights.body
          },
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
          '.Editor [contenteditable="false"]': {
            opacity: "1 !important" as any,
            color: theme.colors.scales.gray[6]
          }
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
          <IconButton
            icon={<IconArrowLeft />}
            component={Link}
            to="/chaipu"
            label="回去吧直接去首页"
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
                placeholder="菜谱标题"
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
              {title}
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
                disabled={!title}
                css={{ marginLeft: theme.spaces.sm }}
                onPress={() => {
                  const current = ref.current as any;
                  //这里serialize是　src/Editor.jsx:120　自定义函数
                  const { text, content } = current.serialize();
                  const toSave = {
                    title,
                    description: content,
                    plain: text,
                    ingredients,
                    author: credit,
                    image
                  };

                  id ? updateRecipe(id, toSave) : saveRecipe(toSave);
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
          {editing ? (
            <ImageUpload
              onRequestSave={id => setImage(id)}
              onRequestClear={() => setImage(null)}
              defaultFiles={
                image
                  ? [
                      {
                        source: image,
                        options: {
                          type: "local"
                        }
                      }
                    ]
                  : []
              }
            />
          ) : image ? (
            <Image alt={title} id={image} />
          ) : null}
          {//在图片以下的内容：
          }
          <Container>
            <div
              css={{
                paddingTop: theme.spaces.lg,
                paddingBottom: theme.spaces.lg
              }}
            >
              {ingredients.length > 0 && (
                <div>
                  <Text variant="h5">原材料</Text>
                  {ingredients.map((ingredient, i) => {
                    const activeHover = ingredient === hoverIngredient;

                    return (
                      <div key={i}>
                        {editing ? (
                          <Contain>
                            <div
                              onMouseEnter={() =>
                                setHoverIngredient(ingredient)
                              }
                              onMouseLeave={() => setHoverIngredient(null)}
                              css={{
                                backgroundColor: activeHover
                                  ? theme.colors.palette.blue.lightest
                                  : "transparent",
                                display: "flex",
                                [theme.mediaQueries.md]: {
                                  maxWidth: "400px"
                                }
                              }}
                            >
                              <TransparentInput
                                autoFocus={!readOnly && ingredients.length > 1}
                                placeholder="名字"
                                value={ingredient.name}
                                onChange={e => {
                                  onIngredientChange(i, {
                                    ...ingredient,
                                    name: e.target.value
                                  });
                                }}
                              />
                              <TransparentInput
                                placeholder="用量"
                                value={ingredient.amount}
                                onChange={e => {
                                  onIngredientChange(i, {
                                    ...ingredient,
                                    amount: e.target.value
                                  });
                                }}
                              />
                              <div
                                css={{
                                  marginLeft: theme.spaces.sm,
                                  flex: "0 0 40px"
                                }}
                              >
                                {i > 0 && (
                                  <IconButton
                                    variant="ghost"
                                    icon={<IconX />}
                                    label="删除原材料"
                                    onPress={() => removeIngredient(i)}
                                  />
                                )}
                              </div>
                            </div>
                          </Contain>
                        ) : (
                          <div
                            onMouseEnter={() => setHoverIngredient(ingredient)}
                            onMouseLeave={() => setHoverIngredient(null)}
                            css={{
                              backgroundColor: activeHover
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
                                backgroundColor: activeHover
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              {ingredient.name}
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
                                backgroundColor: activeHover
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              {ingredient.amount}
                            </Text>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {editing && (
                <Button
                  css={{ marginTop: theme.spaces.sm }}
                  size="sm"
                  onPress={addNewIngredient}
                >
                  添加另一个材料
                </Button>
              )}

              <div css={{ marginTop: theme.spaces.lg }}>
                <Text variant="h5">烹饪步骤明细</Text>
                <div>
                  <Editor
                    ref={ref}
                    value={content}
                    onChange={value => setContent(value)}
                    renderAnnotation={renderAnnotation}
                    initialValue={
                      defaultDescription ? defaultDescription : null
                    }
                    readOnly={!editing}
                  />
                </div>
              </div>
              <div css={{ marginTop: theme.spaces.lg }}>
                {editing ? (
                  <>
                    <Text variant="h5">原创人</Text>
                    <Contain>
                      <TransparentInput
                        placeholder="原创和转载的出处说明"
                        value={credit}
                        onChange={e => {
                          setCredit(e.target.value);
                        }}
                      />
                    </Contain>
                  </>
                ) : (
                  <>
                    {credit && (
                      <>
                        <Text variant="h5">原创人</Text>
                        <Text>{credit}</Text>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

interface TransparentInputProps extends InputBaseProps {}

const TransparentInput = (props: TransparentInputProps) => {
  //const theme = useTheme();
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
