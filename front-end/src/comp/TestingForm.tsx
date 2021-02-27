/** @jsxImportSource @emotion/react */
import {  css, SerializedStyles } from "@emotion/react";
import * as React from "react";
//import { Text } from "./Text";
import VisuallyHidden from "@reach/visually-hidden";
import PropTypes from "prop-types";
//import { alpha } from "./Theme/colors";
//import { useUid } from "./Hooks/use-uid";
//import { Theme } from "./Theme";

//import { useTheme } from "./Theme/Providers";

//import {getHeight, focusShadow, ButtonSize} from "./Button";

//import { IconAlertCircle, IconChevronDown } from "./Icons";
//import { safeBind } from "./Hooks/compose-bind";
import { useMedia } from "use-media";
import  Switch from "react-switch";
import {
  Text,
  useTheme,
  IconAlertCircle,
  IconChevronDown, Theme, focusShadow, getHeight, ButtonSize
} from "customize-easy-ui-component";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";
import { useUid } from "customize-easy-ui-component/esm/Hooks/use-uid";
import { alpha } from "customize-easy-ui-component/esm/Theme/colors";
//似乎<form action= omsubmit= /> 都不再需要使用了。

/*
自适应布局，容器父组件不应当设置width固定的px，否则内部组件元素{已经为屏幕宽度自适应适配的组件}都会被动拉伸宽度，失去了效果。
*/

const getInputSizes = (theme: Theme) => ({
  sm: css({
    fontSize: theme.fontSizes[0],
    padding: "0.25rem 0.5rem"
  }),
  md: css({
    fontSize: theme.fontSizes[1],
    padding: "0.5rem 0.75rem"
  }),
  lg: css({
    fontSize: theme.fontSizes[2],
    padding: "0.65rem 1rem"
  })
});

export type InputSize = "sm" | "md" | "lg";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  /** A label is required for accessibility purposes. Use `hideLabel` to hide it. */
  label: string;
  /** Visually hide the label. It remains accessible to screen readers. */
  hideLabel?: boolean;
  error?: string | React.ReactNode;
  /** Optional help text */
  helpText?: string;
  /** A single input element */
  children?: React.ReactNode;
  labelStyle?: SerializedStyles;
  labelTextStyle?: SerializedStyles;
}

interface InputGroupContextType {
  uid?: string;
  error?: string | React.ReactNode;
}

const InputGroupContext = React.createContext<InputGroupContextType>({
  uid: undefined,
  error: undefined
});

export const InputGroup: React.FunctionComponent<InputGroupProps> = ({
                                                                       id,
                                                                       label,
                                                                       children,
                                                                       error,
                                                                       helpText,
                                                                       hideLabel,
                                                                       labelStyle,
                                                                       labelTextStyle,
                                                                       ...other
                                                                     }) => {
  const uid = useUid(id);
  const theme = useTheme();
  const isDark = theme.colors.mode === "dark";
  const danger = isDark
    ? theme.colors.intent.danger.light
    : theme.colors.intent.danger.base;

  return (
    <section
      className="InputGroup"
      css={{
        marginTop: theme.spaces.md,
        "&.InputGroup:first-of-type": {
          marginTop: 0
        }
      }}
      {...other}
    >
      <Label hide={hideLabel} htmlFor={uid} css={labelStyle} textStyle={labelTextStyle} >
        {label}
      </Label>
      <InputGroupContext.Provider
        value={{
          uid,
          error
        }}
      >
        {children}
      </InputGroupContext.Provider>

      {error && typeof error === "string" ? (
        <div
          className="InputGroup__error"
          css={{
            alignItems: "center",
            marginTop: theme.spaces.sm,
            display: "flex"
          }}
        >
          <IconAlertCircle size="sm" color={danger} />
          <Text
            css={{
              display: "block",
              marginLeft: theme.spaces.xs,
              fontSize: theme.fontSizes[0],
              color: danger
            }}
          >
            {error}
          </Text>
        </div>
      ) : (
        error
      )}

      {helpText && (
        <Text
          className="InputGroup__help"
          css={{
            display: "block",
            marginTop: theme.spaces.xs,
            color: theme.colors.text.muted,
            fontSize: theme.fontSizes[0]
          }}
          variant="body"
        >
          {helpText}
        </Text>
      )}
    </section>
  );
};

InputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  helpText: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.string,
  children: PropTypes.node
};

function shadowBorder(color: string, opacity: number) {
  return `0 0 0 2px transparent inset, 0 0 0 1px ${alpha(
    color,
    opacity
  )} inset`;
}

function getBaseStyles(theme: Theme) {
  const dark = theme.colors.mode === "dark";

  const baseStyles = css({
    display: "block",
    width: "100%",
    lineHeight: theme.lineHeights.body,
    color: theme.colors.text.default,
    backgroundColor: "transparent",
    backgroundImage: "none",
    backgroundClip: "padding-box",
    WebkitFontSmoothing: "antialiased",
    WebkitTapHighlightColor: "transparent",
    WebkitAppearance: "none",
    boxSizing: "border-box",
    touchAction: "manipulation",
    fontFamily: theme.fonts.base,
    border: "none",
    boxShadow: dark
      ? shadowBorder(theme.colors.palette.gray.lightest, 0.14)
      : shadowBorder(theme.colors.palette.gray.dark, 0.2),
    borderRadius: theme.radii.sm,
    transition:
      "background 0.25s cubic-bezier(0.35,0,0.25,1), border-color 0.15s cubic-bezier(0.35,0,0.25,1), box-shadow 0.15s cubic-bezier(0.35,0,0.25,1)",
    "::placeholder": {
      color: alpha(theme.colors.text.default, 0.45)
    },
    ":focus": {
      boxShadow: dark
        ? focusShadow(
          alpha(theme.colors.palette.blue.light, 0.5),
          alpha(theme.colors.palette.gray.dark, 0.4),
          alpha(theme.colors.palette.gray.light, 0.2)
        )
        : focusShadow(
          alpha(theme.colors.palette.blue.dark, 0.1),
          alpha(theme.colors.palette.gray.dark, 0.2),
          alpha(theme.colors.palette.gray.dark, 0.05)
        ),
      outline: "none"
    },
    ":disabled": {
      opacity: dark ? 0.4 : 0.8,
      background: theme.colors.background.tint1,
      cursor: "not-allowed",
      boxShadow: dark
        ? shadowBorder(theme.colors.palette.gray.lightest, 0.15)
        : shadowBorder(theme.colors.palette.gray.dark, 0.12)
    },
    ":active": {
      background: theme.colors.background.tint1
    }
  });

  return baseStyles;
}

function useActiveStyle() {
  const [active, setActive] = React.useState(false);
  return {
    bind: {
      onTouchStart: () => setActive(true),
      onTouchEnd: () => setActive(false)
    },
    active
  };
}

function useSharedStyle() {
  const theme = useTheme();
  const errorStyles = {
    boxShadow: shadowBorder(theme.colors.intent.danger.base, 0.45)
  };

  const baseStyles = React.useMemo(() => getBaseStyles(theme), [theme]);
  const inputSizes = React.useMemo(() => getInputSizes(theme), [theme]);
  const activeBackground = css({ background: theme.colors.background.tint1 });
  return {
    baseStyles,
    inputSizes,
    activeBackground,
    errorStyles
  };
}

export interface InputBaseProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The size of the input element */
  inputSize?: InputSize;
  topDivStyle?: SerializedStyles;
}

/**
 * Our basic Input element. Use this when building customized
 * forms. Otherwise, stick with InputGroup
 * 不对外开放使用的；外部引用请用Input
 */

export const InputBase = React.forwardRef(
  (
    { autoComplete, autoFocus, inputSize = "md",topDivStyle, ...other }: InputBaseProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { uid, error } = React.useContext(InputGroupContext);
    const { bind, active } = useActiveStyle();
    const {
      baseStyles,
      inputSizes,
      activeBackground,
      errorStyles
    } = useSharedStyle();
    const height = getHeight(inputSize);
    return (
      <input
        id={uid}
        className="Input"
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        {...bind}
        css={[
          baseStyles,
          inputSizes[inputSize],
          active && activeBackground,
          error && errorStyles,
          { height },
          topDivStyle
        ]}
        {...safeBind({ ref }, other)}
      />
    );
  }
);

//性能测试 使用的
export const InputSimple : React.FunctionComponent<InputBaseProps>=
  (
    {
      autoComplete,
      autoFocus,
      inputSize = "md",
      topDivStyle,
      ...other
    }
  ) => {

  //去掉 bind active Background从240ms变为230ms； onTouchStart()+css:colors.background 影响性能还算可以。
    //-再去掉baseStyles 变为225ms；
      //--再去掉inputSizes[] 变为221ms；  css:fontSize+padding;
        //--- useSharedStyle() errorStyles 变为210ms；
          //----height样式去掉,最小字体高, 变为172ms； 元素高度css影响性能较大，也得用啊！
            //-----把useContext去掉,变为171ms；
              //------把getHeight()去掉,只是空荡荡函数外套了，变为167ms；
                //最后连InputSimple这个FunctionComponent函数也直接替换成<input，变为165ms，加一层组件函数嵌套实际性能影响较小。
    return (
      <input  {...other} />
    );
};



InputBase.propTypes = {
  inputSize: PropTypes.oneOf(["sm", "md", "lg"] as InputSize[]),
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool
};


export interface InputProps 　 extends InputBaseProps {
  /** 控制是否满上宽度;
   *  需要在<input> 上 去控制大尺寸上限的width:  ，以及自适应屏幕大小后的 max-width: 缩小尺寸。
   * */
  fullWidth?: boolean;
}

/**
 * 比起里面的InputBase，外面多包裹一个div以便于控制宽度和对齐。
 */
export const Input = React.forwardRef(
  (
    { autoComplete, autoFocus, inputSize = "md",
      fullWidth=true,
      topDivStyle, ...other }: InputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { uid, error } = React.useContext(InputGroupContext);
    const { bind, active } = useActiveStyle();
    const {
      baseStyles,
      inputSizes,
      activeBackground,
      errorStyles
    } = useSharedStyle();
    const height = getHeight(inputSize);
    return (
      <div  css={[
        {
          textAlign: 'left',
          width: "100%"
        },
        topDivStyle
      ]}
      >
        <input
          id={uid}
          className="Input"
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...bind}
          css={[
            baseStyles,
            inputSizes[inputSize],
            active && activeBackground,
            error && errorStyles,
            { height },
            !fullWidth &&{
              width: 'unset',
            }
          ]}
          {...safeBind({ ref }, other)}
        />
      </div>
    );
  }
);


//export const Input = InputBase;   直接替换

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The size of the textarea element */
  inputSize?: InputSize;
  topDivStyle?: SerializedStyles;
}

/**
 * Textarea version of InputBase
 */

export const TextArea: React.FunctionComponent<TextAreaProps> = ({
                                                                   inputSize = "md",
                                                                   topDivStyle,
                                                                   ...other
                                                                 }) => {
  const { bind, active } = useActiveStyle();
  const {
    baseStyles,
    inputSizes,
    activeBackground,
    errorStyles
  } = useSharedStyle();
  const { uid, error } = React.useContext(InputGroupContext);

  return (
    <textarea
      className="TextArea"
      id={uid}
      {...bind}
      css={[
        baseStyles,
        inputSizes[inputSize],
        {
          overflow: "auto",
          resize: "vertical",
        },
        active && activeBackground,
        error && errorStyles,
        topDivStyle
      ]}
      {...other}
    />
  );
};

TextArea.propTypes = {
  inputSize: PropTypes.oneOf(["sm", "md", "lg"] as InputSize[])
};



export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  hide?: boolean;
  htmlFor: string;
  textStyle?: SerializedStyles;
}

/**
 * A styled Label to go along with input elements
 */

export const Label: React.FunctionComponent<LabelProps> = ({
                                                             children,
                                                             hide,
                                                             textStyle,
                                                             ...other
                                                           }) => {
  const theme = useTheme();
  const child = (
    <label
      className="Label"
      css={{
        display: "inline-block",
        marginBottom: hide ? 0 : theme.spaces.sm
      }}
      {...other}
    >
      <Text className="Label__text" variant={"subtitle"} css={textStyle}>
        {children}
      </Text>
    </label>
  );

  return hide ? <VisuallyHidden>{child}</VisuallyHidden> : child;
};

Label.propTypes = {
  hide: PropTypes.bool,
  children: PropTypes.node
};


export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The size of the select box */
  inputSize?: InputSize;
  divStyle?: SerializedStyles;
  topDivStyle?: SerializedStyles;
}

/**
 * multiple在手机上可以不展开列表了，但是选择2个以上在编辑框上面只能显示数目，不会显示选择那些必须点击进入才能看见。在电脑上面还是列表全部展开的形式。
 * 若multiple=true 导致直接拉开了，样式窗口高度都改变，失去UI一致性了『感觉不友好啊』。
 * 光光靠w3c标准也行不通, 难以通用，必须自己定制。
 * ComboBox不允许multiple；但是Select不允许自主添加新的列表项目，Select允许列表附加label描述文字代替value;
 * 若触摸屏 不能支持multiple形态的的Select，只能单选。?浏览器版本升级，但是还会有返回的数据【】集合机制问题,value=[values1,2]。
 * multiple 只是摊开选择列表，onChange  .target.value无法提供多选数组，必须额外维护可以多选的被选中状态和数据数组。
 *本来该用 children 的这个 <option></option> 也能够用...other直接复制<select 的底下标签去。
 */

export const Select: React.FunctionComponent<SelectProps> = ({
                                                               multiple,
                                                               inputSize = "md",
                                                               divStyle,
                                                               topDivStyle,
                                                               ...other
                                                             }) => {
  const theme = useTheme();
  const inputSizes = getInputSizes(theme);
  const { uid, error } = React.useContext(InputGroupContext);
  const selectSize = {
    sm: inputSizes.sm,
    md: inputSizes.md,
    lg: inputSizes.lg
  };
  const dark = theme.colors.mode === "dark";
  const height = getHeight(inputSize);
  //因需要Select组件的max-width；导致Select若放InputGroupLine下在宽松模式一行内显示Label和Select的场景，在Select组件头层div设置宽度将会使得flex无法对齐两个项目；所以再套入一个div。
  return (
    <div  css={[
      {
        textAlign: 'left'
      },
      topDivStyle
    ]}
    >
      <div
        className="Select"
        css={[
          {
            //这个position: "relative"因为其下级的position: "absolute"定位的小小图标所约束。所以只能relative或sticky其他position取值不行。
            position: "relative",
          },
          divStyle,
        ]}
      >
        <select
          className="Select__input"
          id={uid}
          css={[
            selectSize[inputSize],
            {
              WebkitAppearance: "none",
              display: "block",
              width: "100%",
              // lineHeight: theme.lineHeights.body,
              height: multiple? 'unset': height,
              color: theme.colors.text.default,
              background: "transparent",
              fontFamily: theme.fonts.base,
              boxShadow: `0 0 0 2px transparent inset, 0 0 0 1px ${
                dark
                  ? alpha(theme.colors.palette.gray.lightest, 0.14)
                  : alpha(theme.colors.palette.gray.dark, 0.2)
                } inset`,
              border: "none",
              backgroundClip: "padding-box",
              borderRadius: theme.radii.sm,
              margin: 0,
              ":disabled": {
                ":disabled": {
                  opacity: dark ? 0.4 : 0.8,
                  background: theme.colors.background.tint1,
                  cursor: "not-allowed",
                  boxShadow: `0 0 0 2px transparent inset, 0 0 0 1px ${
                    dark
                      ? alpha(theme.colors.palette.gray.lightest, 0.15)
                      : alpha(theme.colors.palette.gray.dark, 0.12)
                    } inset`
                }
              },
              ":focus": {
                borderColor: theme.colors.palette.blue.base,
                boxShadow: dark
                  ? focusShadow(
                    alpha(theme.colors.palette.blue.light, 0.5),
                    alpha(theme.colors.palette.gray.dark, 0.4),
                    alpha(theme.colors.palette.gray.light, 0.2)
                  )
                  : focusShadow(
                    alpha(theme.colors.palette.blue.dark, 0.1),
                    alpha(theme.colors.palette.gray.dark, 0.2),
                    alpha(theme.colors.palette.gray.dark, 0.05)
                  ),
                outline: 0
              }
            },
            error && {
              boxShadow: shadowBorder(theme.colors.intent.danger.base, 0.45)
            }
          ]}
          multiple={multiple}
          {...other}
        />
        {!multiple && (
          <IconChevronDown
            className="Select__icon"
            color={theme.colors.text.muted}
            css={{
              position: "absolute",
              top: "50%",
              right: "0.75rem",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }}
          />
        )}
      </div>
    </div>
  );
};


Select.propTypes = {
  inputSize: PropTypes.oneOf(["sm", "md", "lg"]),
  multiple: PropTypes.bool
};


export interface CheckProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** A label for the checkmark. */
  label: string;
  topDivStyle?: SerializedStyles;
}

export const Check: React.FunctionComponent<CheckProps> = ({
                                                             label,
                                                             id,
                                                             disabled,
                                                             topDivStyle,
                                                             ...other
                                                           }) => {
  const uid = useUid(id);
  const theme = useTheme();

  return (
    <div  className="Check"
          css={[
            {
              //  textAlign: 'left',
              display: "flex",
              alignItems: "center",
              //  width: "100%",
            },
            topDivStyle
          ]}
          {...other}
    >
      <input
        disabled={disabled}
        className="Check__input"
        type="checkbox"
        id={uid}
        css={[
          {
            height: '2rem',
            width: '2rem',
            display: 'inline-flex',
            paddingLeft: '1rem',
          },
        ]}
        {...other}
      />
      <label
        className="Check__label"
        css={{
          opacity: disabled ? 0.6 : undefined,
          marginLeft: theme.spaces.xs
        }}
        htmlFor={uid}
      >
        <Text>{label}</Text>
      </label>
    </div>
  );
};

Check.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool
};


//带单位标注的输入框
export interface SuffixInputProps
  extends InputBaseProps {
  textStyle?: SerializedStyles;
}

/**
 * A styled Label to go along with input elements
 * 若children有，就是有附带单位后缀串的模式；
 * 带单位后缀的说明，70%给输入框，后面30%给叙述单位字串{空格也算}
 * 输入的 单位说明 字符串 放在 <Text className="Suffix__text"  >
 */
export const SuffixInput: React.FunctionComponent<SuffixInputProps> = ({
                                                                         children,
                                                                         textStyle,
                                                                         inputSize,
                                                                         topDivStyle,
                                                                         ...other
                                                                       }) => {
  const theme = useTheme();
  return (
    <div  css={[
      {
        textAlign: 'left'
        //display: "inline-block",
      },
      topDivStyle
    ]}
    >
      <InputBase inputSize={inputSize}
                 css={{
                   display: "inline-block",
                   width:  children? "70%" : '100%',
                 }}
                 {...other}
      >
      </InputBase>
      <Text className="Suffix__text" variant={"subtitle"}
            css={[
              {
                display: children? "inline-flex" : 'none',
                paddingLeft: '0.2rem'
              },
              textStyle
            ]}
      >
        {children}
      </Text>
    </div>
  );
};

SuffixInput.propTypes = {
  children: PropTypes.node
};


//带单位标注的输入框
export interface InputFollowUnitProps
    extends InputBaseProps {
    textStyle?: SerializedStyles;
    unit: string;
}

/**
 * InputFollowUnit， 代替SuffixInput 看看能否提高性能
 * 若children有，就是有附带单位后缀串的模式；
 * 带单位后缀的说明，70%给输入框，后面30%给叙述单位字串{空格也算}
 * 输入的 单位说明 字符串 放在 <Text className="Suffix__text"  >
 */
export const InputFollowUnit: React.FunctionComponent<InputFollowUnitProps> = ({
        unit,
        textStyle,
        inputSize,
        topDivStyle,
        ...other
    }) => {
//去掉<input误给的topDivStyle就能从178降低到142ms【3Fm】了；
//首层<div topDivStyle 等都去掉，130ms且【4Fm*115个】了，样式影响挺大的。
//在<input的头顶多搞出一层<div来嵌套下实际不会影响性能的。
//最简化 里面input 替换 InputBase +传入css"inline-block" 从150ms立马变380ms啦。
  //-减传入css，只有InputBase 变365ms啦。
    //--InputSimple普通FunctionComponent代替React.forwardRef(safeBind({ ref }就能从365ms变240ms啦。
    return (
        <div>
          <InputSimple  {...other} />
            {unit}
        </div>
    );
};

InputFollowUnit.propTypes = {
    children: PropTypes.node
};


export interface InputGroupLineProps extends InputGroupProps {
  //对一整行的控制
  lineStyle?: SerializedStyles;
  //根据换行px数 ，来切换显示2个显示模式。 缺省>=360px 正常模式，否则紧凑模式。
  switchPx?: number;
}
/*
自适应屏幕flexBox布局：不要设置固定的width和min-width，可以设置max-width；根据屏幕宽策划1列2列还是更多列的并列，或是更高层次嵌套或隐藏或显示一小半边天区域。
不要对InputGroupLine的上一级div定义固定宽度，自适应和固定width: px只能二者选其一；宽度定了对小屏幕场景就有滚动条，而不是自适应缩小flexBox布局。
修改InputGroup排版模式; 并排模式，根据屏幕自适应。支持 2 个模式的布局安排结构。
*/
export const InputGroupLine: React.FunctionComponent<InputGroupLineProps> = ({
                                                                               id,
                                                                               label,
                                                                               children,
                                                                               error,
                                                                               helpText,
                                                                               hideLabel,
                                                                               labelStyle,
                                                                               labelTextStyle,
                                                                               lineStyle,
                                                                               switchPx=360,
                                                                               ...other
                                                                             }) => {
  const uid = useUid(id);
  const theme = useTheme();
  const isDark = theme.colors.mode === "dark";
  const danger = isDark
    ? theme.colors.intent.danger.light
    : theme.colors.intent.danger.base;

  //根据外部程序制定的px数，来决定用哪一个模式布局。紧凑的是2行显示；宽松的是并列在同一行。
  const fitable = useMedia({ minWidth: `${switchPx}px` });

  const labelDivCss = css({
    flex: 1,
    paddingRight: '0.8rem'
  }, labelTextStyle);

  //InputGroupLine包裹的下层的顶级组件的样式修改：下层顶级元素的display: block还算兼容可用; 但width: 100%影响较大。
  const childNodeVar = (
    <InputGroupContext.Provider
      value={{
        uid,
        error
      }}
    >
      {
        React.cloneElement(children as React.ReactElement<any>, {
          topDivStyle: { flex: '1 1 60%' },
          //style: { flex: '1 1 60%' },      左边的项目文字描述　40%　右边输入框(含单位字符)占用60%
        })
      }
    </InputGroupContext.Provider>
  );

  return (
    <section
      className="InputGroupLine"
      css={{
        marginTop: theme.spaces.md,
        "&.InputGroupLine:first-of-type": {
          marginTop: 0
        },
        textAlign: 'center'
      }}
      {...other}
    >
      <div  css={[
        {
          alignItems: "center",
          justifyContent: "space-around",
          display: "flex",
          flexWrap: 'wrap',
          maxWidth: '950px',
          margin: '0 auto',
          paddingRight: fitable? '0.5rem' :  'unset',
        },
        lineStyle
      ]}
      >
        <Label hide={hideLabel} htmlFor={uid}  textStyle={labelDivCss}
               css={[
                 {
                   display: "inline-flex",
                   textAlign: fitable? "right" : "left",
                   flex: '1 1 40%',
                 },
                 labelStyle
               ]}
        >
          {label}
        </Label>
        { fitable &&   childNodeVar  }
      </div>

      { !fitable &&   childNodeVar  }

      {error && typeof error === "string" ? (
        <div
          className="InputGroup__error"
          css={{
            alignItems: "center",
            marginTop: theme.spaces.sm,
            display: "flex",
            justifyContent: 'center'
          }}
        >
          <IconAlertCircle size="sm" color={danger} />
          <Text
            css={{
              display: "block",
              marginLeft: theme.spaces.xs,
              fontSize: theme.fontSizes[0],
              color: danger
            }}
          >
            {error}
          </Text>
        </div>
      ) : (
        error
      )}

      {helpText && (
        <Text
          className="InputGroup__help"
          css={{
            display: "inline-flex",
            marginTop: theme.spaces.xs,
            color: theme.colors.text.muted,
            fontSize: theme.fontSizes[0]
          }}
          variant="body"
        >
          {helpText}
        </Text>
      )}
    </section>
  );
};

InputGroupLine.propTypes = {
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  helpText: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.string,
  switchPx: PropTypes.number,
  children: PropTypes.node
};


export interface InputDatalistProps 　 extends InputBaseProps {
    /** 控制是否满上宽度;
     *  需要在<input> 上 去控制大尺寸上限的width:  ，以及自适应屏幕大小后的 max-width: 缩小尺寸。
     * */
    fullWidth?: boolean;
    //已经知道的列表
    datalist?: any[];
    //为了和ComboBoxDatalist保证参数一致才引入的。 接替onChange(); 直接用底层onChange可行的
    onListChange: (value: string) => void;
}

/**底层浏览器已经做了现成的支持ComboBox，何必自己再搞那么麻烦呢。
 * 直接用W3C浏览器提供的<datalist标签？list做关联id,来做组合输入框，代替ComboBox组件
 *<datalist id=""> 实际上可以脱离<input 而存在的，比如作为全局的不改动的<datalist集合放在一起。 管理？分离掉了；
 * 还是自己包含<datalist维护好了。
 * InputDatalist对比ComboBox组件的弱点1非空编辑不能点击就显示所有列表2手机上列表展开位置与窗口大小太矮了3<option的label与value都显示出来感觉不好。
 * ，但比ComboBox有个有优势：1能够记住当前用户输入用过的以后再用。
 * 不过一般输入完成后再做点击修改的概率也不大，手机版本显示区域太小问题以后浏览器版本可能改进的。
 */
export const InputDatalist = React.forwardRef(
    (
        {
            autoComplete, autoFocus, inputSize = "md",
            fullWidth=true,
            datalist=[],
            topDivStyle,
            onListChange,
            ...other }: InputDatalistProps,
        ref: React.Ref<HTMLInputElement>
    ) => {
        const { uid, error } = React.useContext(InputGroupContext);
        const { bind, active } = useActiveStyle();
        const {
            baseStyles,
            inputSizes,
            activeBackground,
            errorStyles
        } = useSharedStyle();
        const height = getHeight(inputSize);
        return (
            <div  css={[
                {
                    textAlign: 'left',
                    width: "100%"
                },
                topDivStyle
            ]}
            >
                <datalist id={`list${uid}`}>
                    { datalist.map((one,i) => {
                        return <option key={i} value={one} />;
                    }) }
                </datalist>
                <input
                    id={uid}
                    className="Input"
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    {...bind}
                    css={[
                        baseStyles,
                        inputSizes[inputSize],
                        active && activeBackground,
                        error && errorStyles,
                        { height },
                        !fullWidth &&{
                            width: 'unset',
                        }
                    ]}
                    {...safeBind({ ref }, other)}
                    list={`list${uid}`}
                    onChange={e => onListChange( e.currentTarget.value||undefined ) }
                />
            </div>
        );
    }
);


const getSwitchHeight = (size: ButtonSize) => {
    if (size === "xs") return 16;
    else if (size === "sm") return 22;
    else if (size === "lg") return 36;
    else if (size === "xl") return 44;
    else return 28;
};

export interface CheckSwitchProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    topDivStyle?: SerializedStyles;
    /** The size of the Switch. 多大高度方向的尺寸 */
    hsize?: ButtonSize;
}

/**
 * 从‘react-switch’导入组件,做个可替代Check的更加美观的开关组件。
 * @param disabled
 * @param topDivStyle
 */
export const CheckSwitch: React.FunctionComponent<CheckSwitchProps> = ({
        id,
        disabled,
        topDivStyle,
        checked,
        onChange,
        hsize = "md" as ButtonSize,
        ...other
    }) => {
    const { uid } = React.useContext(InputGroupContext);
    //不能用这个React.useCallback((checked,event,id) => {， 状态无法切换, 外面传递进来的onChange()还是旧的数据，无法更新成新数值。
    //onHandleChange用了 useCallback（,[]）: 就是捕获函数， onChange就无法变化了,所以被锁住更新。
    const onHandleChange = (checked) => {
        onChange(checked);
    };

    return (
        <div  className="Switch"
              css={[
                  {
                      display: "flex",
                      alignItems: "center",
                  },
                  topDivStyle
              ]}
              {...other}
        >
            <Switch id={uid}
               checked={checked}
               onChange={onHandleChange}
               disabled={disabled}
               height={getSwitchHeight(hsize)}
               width={getSwitchHeight(hsize)*2}
            />
        </div>
    );
};

CheckSwitch.propTypes = {
    id: PropTypes.string,
    disabled: PropTypes.bool,
    hsize: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"])
};

