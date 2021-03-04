/** @jsxImportSource @emotion/react */
import { jsx,css, SerializedStyles} from "@emotion/react";
import * as React from "react";
//import { useUid } from "./Hooks/use-uid";
//import { safeBind } from "./Hooks/compose-bind";
//import { useTheme } from "./Theme/Providers";
//import { Text } from "./Text";
import { Touchable } from "../src/comp/Touchable";
//import { useMeasure, Bounds } from "./Hooks/use-measure";
//import { Layer } from "./Layer";
import Highlighter from "react-highlight-words";
import { InputBase, InputBaseProps, InputRefBase } from "../src/comp/TestingForm";
import { usePopper } from 'react-popper';
import {ElementType} from "react";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";
import { useUid } from "customize-easy-ui-component/esm/Hooks/use-uid";
import {
  Text,
  useTheme,Layer,
} from "customize-easy-ui-component";
import { useMeasure, Bounds } from "customize-easy-ui-component/esm/Hooks/use-measure";

/**
 * Combobox context
 */

interface ComboBoxContextType {
  /** element refs */
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLElement>;

  /** list options */
  options: React.MutableRefObject<string[] | null>;
  makeHash: (i: string) => string;
  selected: string | null;
  expanded: boolean;

  /** event handlers */
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handleOptionSelect: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;

  /** popover positions */
  position: any;
  inputSize: Bounds;
  listId: string;
  query: string;
  autocomplete: boolean;
  //传递头一个div样式
  topDivStyle: SerializedStyles | undefined;
}

export const ComboBoxContext = React.createContext<ComboBoxContextType | null>(
  null
);

/**
 * Context provider / manager
 */

export interface ComboBoxProps {
  onSelect?: (selected: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  autocomplete?: boolean;
  //外部传入模式的样式，设置第一层的元素。
  topDivStyle?: SerializedStyles;
}

/**
 * 虽然直接用W3C浏览器提供的<datalist标签？list做关联id,来做组合输入框，请到Form.tsx找InputDatalist组件代替本组件，
 * 但是还是这个定制的更好用。
 * ComboBox
 * @param children
 * @param onSelect
 * @param autocomplete
 * @param query
 * @param onQueryChange
 * @param topDivStyle
 * @constructor
 */
export const ComboBox: React.FunctionComponent<ComboBoxProps> = ({
  children,
  onSelect,
  autocomplete = false,
  query,
  onQueryChange,
  topDivStyle
}) => {
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const listId = `list${useUid()}`;
  const options = React.useRef<string[] | null>([]);
  //替换掉const position = usePositioner() of ./Hooks/use-positioner"直接使用'react-popper'包。
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
      modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const inputSize = useMeasure(inputRef);

  /**
   * Handle input change 输入框输入变更
   */

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // potentially show popover
      setSelected(null);
      if (!expanded) {
        setExpanded(true);
      }

      onQueryChange(e.target.value);
    },
    [expanded]
  );

  /**
   * Escape key pressed
   */

  const onEscape = React.useCallback(() => {
    setExpanded(false);
    setSelected(null);
  }, []);

  /**
   * Enter pressed or item clicked
   */

  const onItemSelect = React.useCallback(() => {
    // call the parent with the selected value?
    setExpanded(false);
    onSelect && onSelect(selected as string);
    setSelected(null);
  }, [selected]);

  /**
   * Get the currently active option index
   * */

  const getSelectedIndex = React.useCallback(() => {
    if (!selected) return -1;
    return options.current!.indexOf(selected || "");
  }, [options, selected]);

  /**
   * Arrow up pressed
   */

  const onArrowUp = React.useCallback(() => {
    const opts = options.current!;
    const i = getSelectedIndex();

    // on input? cycle to bottom
    if (i === -1) {
      setSelected(opts[opts.length - 1]);

      // select prev
    } else {
      setSelected(opts[i - 1]);
    }
  }, [getSelectedIndex]);

  /**
   * Arrow down pressed
   */
  const onArrowDown = React.useCallback(() => {
    const opts = options.current!;
    const i = getSelectedIndex();
    // if last, cycle to first
    if (i + 1 === opts.length) {
      setSelected(opts[0]);

      // or next
    } else {
      setSelected(opts[i + 1]);
    }
  }, [getSelectedIndex, selected]);

  /**
   * Handle keydown events
   */

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onArrowUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          onArrowDown();
          break;
        case "Escape":
          e.preventDefault();
          onEscape();
          break;
        case "Enter":
          e.preventDefault();
          onItemSelect();
          break;
      }
    },
    [onArrowDown, onArrowUp, onEscape, onItemSelect]
  );

  /**
   * Handle blur events
   */

  const handleBlur = React.useCallback(() => {
    requestAnimationFrame(() => {
      const focusedElement = document.activeElement;
      const list = listRef.current as any;

      if (focusedElement == inputRef.current || focusedElement == list) {
        // ignore
        return;
      }

      // ignore if our popover contains the focused element
      if (list && list.contains(focusedElement)) {
        return;
      }

      // hide popover
      setExpanded(false);
      setSelected(null);
    });
  }, []);

  /**
   * handle input focus
   */

  const handleFocus = React.useCallback(() => {
    setExpanded(true);
  }, []);

  /**
   * Handle item clicks
   * ComboBoxOption列表unmounted报错{tounchable-OnEnd()}解决方式: 拖延更新  async {await setXXX}
   */

  const handleOptionSelect = React.useCallback(async (value: string) => {
    //onSelect 外部注入编辑setxxx()
    onSelect && onSelect(value);
    await setSelected(null);
    //setExpanded执行太快了，反而报错 useTouchable-onEnd-dispatch("RESPONDER_RELEASE")钩子，遇到unmounted了。
    //直接在前面那个setSelected 做一个await;相当于出让一个运行render机会,拖延后面这个setExpanded的运行时间点到下一个render再做，拖延更新。
    //console.log("onSelect进入 selected=",　value);
    setExpanded(false);
  }, []);

  /**
   * Make a unique hash for list + option
   */

  const makeHash = React.useCallback(
    (i: string) => {
      return listId + i;
    },
    [listId]
  );

  return (
    <ComboBoxContext.Provider
      value={{
        listId,
        inputRef,
        listRef,
        options,
        onInputChange,
        selected,
        onKeyDown,
        handleBlur,
        handleFocus,
        handleOptionSelect,
        position:{ setReferenceElement, setPopperElement, setArrowElement, styles, attributes },
        makeHash,
        expanded,
        inputSize: inputSize.bounds,
        query,
        autocomplete,
        topDivStyle,
      }}
    >
      {children}
    </ComboBoxContext.Provider>
  );
};

/**
 * Input element
 */

export interface ComboBoxInputProps extends React.HTMLAttributes<any> {
  "aria-label": string;
  component?: React.ElementType<any>;
  [key: string]: any;
}

//分解配套的模式ComboBoxInput必需加到ComboBox底下的，ComboBox本身没有实际的div元素,靠context管理传递参数。
export const ComboBoxInput: React.FunctionComponent<ComboBoxInputProps> = ({
  component: Component = InputRefBase,
  ...other
}) => {
  const context = React.useContext(ComboBoxContext);
  const [localValue, setLocalValue] = React.useState("");

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }
  //这里topDivStyle样式从上级组件ComboBox以共享同一个context模式传递的，算是第二次传递。
  const {
    onKeyDown,
    makeHash,
    selected,
    position,
    handleBlur,
    query,
    autocomplete,
    handleFocus,
    onInputChange,
    listId,
    inputRef,
    topDivStyle
  } = context;

  /** support autocomplete on selection */

  React.useEffect(() => {
    if (!autocomplete) {
      return;
    }

    if (selected) {
      setLocalValue(selected);
    } else {
      setLocalValue("");
    }
  }, [selected, autocomplete]);

  return (
    <Component
      id={listId}
      onKeyDown={onKeyDown}
      onChange={onInputChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-controls={listId}
      autoComplete="off"
      value={localValue || query}
      aria-readonly
      aria-autocomplete="list"
      role="textbox"
      css={[
        {
        },
        topDivStyle
      ]}
      aria-activedescendant={selected ? makeHash(selected) : undefined}
      {...safeBind(
        {
          ref: inputRef
        },
        {
          ref: position.setReferenceElement
        },
        other
      )}
    />
  );
};

/**
 * Popover container
 */

export interface ComboBoxListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  autoHide?: boolean;
}

export const ComboBoxList: React.FunctionComponent<ComboBoxListProps> = ({
  children,
  autoHide = true,
  ...other
}) => {
  const context = React.useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const {
    inputSize,
    expanded,
    listId,
    handleBlur,
    listRef,
    position,
    options
  } = context;

  React.useLayoutEffect(() => {
    options.current = [];
    return () => {
      options.current = [];
    };
  });

  return (
    <React.Fragment>
      {(expanded || !autoHide) && (
        <Layer
          tabIndex={-1}
          elevation="sm"
          key="1"
          style={position.styles.popper}
          data-placement={position.attributes.popper}
          id={listId}
          role="listbox"
          onBlur={handleBlur}
          className="ComboBoxList"
          css={{
            overflow: "hidden",
            borderRadius: theme.radii.sm,
            outline: "none",
            width:
              inputSize.width +
              inputSize.left +
              (inputSize.right - inputSize.width) +
              "px",
            margin: 0,
            padding: 0,
            zIndex: theme.zIndices.overlay,
          }}
          {...safeBind(
            {
              ref: listRef
            },
            {
              ref: position.setPopperElement
            },
            other
          )}
        >
          {children}
          <div ref={position.setArrowElement} style={position.styles.arrow} />
        </Layer>
      )}
    </React.Fragment>
  );
};

/**
 * Individual combo box options
 */

export interface ComboBoxOptionProps
  extends React.HTMLAttributes<HTMLLIElement> {
  value: string;
}

/** ComboBox不允许列表派生参数label，字面描述就是value。
 * value才是选择输出数值， 但是ComboBoxOption组件可以内嵌子组件来表达诸如表面描述或者图片等与value有关联的东西label。
 * 但是选择了之后，在Input框显示的还是value，不能显示出label表面描述文字。
 * 类似这样用户可以修改的输入，应该不会在意关联的label表面描述文字，真的应该去掉，仅仅保留value；不像Select这样的固定的/用户无法主动输入只允许选择的才会搞出label名堂。
 * @param value
 * @param children
 * @param other
 * ComboBox不允许multiple；但是Select不允许自主添加新的列表项目，Select允许列表附加label描述文字代替value;
 */
export const ComboBoxOption: React.FunctionComponent<ComboBoxOptionProps> = ({
  value,
  children,
  ...other
}) => {
  const context = React.useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const { makeHash, handleOptionSelect, options, selected } = context;

  React.useEffect(() => {
    if (options.current) {
      options.current.push(value);
    }
  });

  const isSelected = selected === value;

  const onClick = React.useCallback(() => {
    handleOptionSelect(value);
  }, [value]);

  //加上terminateOnScroll={true}才能准确捕捉点击，否则容易误操作，没完全明确选定。
  //Touchable在这里实际component="li"转换为<li />标签了；这里没用到<select> <option/>

  return (
    <Touchable
      tabIndex={-1}
      id={makeHash(value)}
      role="option"
      component="li"
      onPress={onClick}
      aria-selected={isSelected ? "true" : "false"}
      css={{
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        display: "block",
        listStyleType: "none",
        margin: 0,
        padding: `0.5rem 0.75rem`,
        cursor: "pointer",
        background: isSelected ? theme.colors.background.tint1 : "none",
        "&.Touchable--hover": {
          background: theme.colors.background.tint1
        },
        "&.Touchable--active": {
          background: theme.colors.background.tint2
        }
      }}
      {...other}
    >
      {children || <ComboBoxOptionText value={value} />}
    </Touchable>
  );
};

/**
 * ComboBox Item text with highlighting
 */

export interface ComboBoxOptionTextProps {
  value: string;
}

export const ComboBoxOptionText: React.FunctionComponent<
  ComboBoxOptionTextProps
> = ({ value, ...other }) => {
  const context = React.useContext(ComboBoxContext);
  const theme = useTheme();

  if (!context) {
    throw new Error("ComboBoxInput must be wrapped in a ComboBox component");
  }

  const { query } = context;

  return (
    <Text
      className="ComboBoxOptionText"
      css={{ fontWeight: theme.fontWeights.heading }}
      {...other}
    >
      <Highlighter
        highlightStyle={{
          color: theme.colors.text.selected,
          background: "transparent"
        }}
        className="ComboBoxOptionText__Highlighter"
        searchWords={[query]}
        autoEscape={true}
        textToHighlight={value}
      />
    </Text>
  );
};



export interface ComboBoxDatalistProps  extends InputBaseProps {
  /** 控制是否满上宽度;
   *  需要在<input> 上 去控制大尺寸上限的width:  ，以及自适应屏幕大小后的 max-width: 缩小尺寸。
   * */
  fullWidth?: boolean;
  //已经知道的列表
  datalist?: any[];
  //底层input的 value?: string | ReadonlyArray<string> | number; 可重载类型定义，修改匹配为字符串
  value?: string;
  //底层input的onChange,参数类型是event:不能直接利用
  onListChange: (value: string) => void;
}

/**类似InputDatalist组件，目的是：可以直接替换 repalce in files，能保持参数一致，移植修改简单切换。
 * 对比InputDatalist,定做组合框的版本。
 * 自主输入Enter完成就变空的。 ComboBoxInput无法使用safeBind({ ref }，单独有inputRef的；
 * readOnly?: boolean; disabled?: boolean;
 * onChange不能直接利用参数类型是event：e?.currentTarget，而ComboBox这都是string类型。
 * @param onListChange:可选列表选定，或者编辑框修改,导致query={value}必然变更。
 */
export const ComboBoxDatalist = React.forwardRef(
    (
        {
          autoComplete, autoFocus, inputSize = "md",
          fullWidth=true,
          datalist=[],
          topDivStyle,
          value,
          onListChange,
          ...other }: ComboBoxDatalistProps,
        ref: React.Ref<HTMLInputElement>
    ) => {

      //ComboBoxInput无法使用safeBind({ ref }，单独有inputRef的；
      return (
          <ComboBox  autocomplete={false}
                     topDivStyle={topDivStyle}
                     query={value}
                     onQueryChange={v => {
                       onListChange(v);
                     }}
                     onSelect={v => {
                       v && onListChange(v);
                     }}
          >
            <ComboBoxInput aria-label="Select add"
                           {...other }
            />
            <ComboBoxList >
               {datalist.length ? (
                   datalist.map((one,i) => {
                     return <ComboBoxOption key={i} value={one} />;
                   })
               ) : (
                   <div>
                     <Text
                         muted
                         css={{ display: "block", padding: "0.5rem 0.75rem" }}
                     >
                       {value && datalist.length === 0 ? (
                           <span>No entries found.</span>
                       ) : (
                           <span>{other.placeholder}</span>
                       )}
                     </Text>
                   </div>
               )}
           </ComboBoxList>
          </ComboBox>
      );
    }
);

