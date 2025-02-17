/** @jsxImportSource @emotion/react */
//代码调试临时整合

import { jsx } from "@emotion/react";
import * as React from "react";
//import { Text } from "./Text";
import PropTypes from "prop-types";
//import { RequestCloseContext } from "./Sheet";
//import { useTheme } from "./Theme/Providers";
//import { noOp } from "./misc/noop";
import { useTouchable, OnPressFunction } from "touchable-hook";
import cx from "classnames";
//import { safeBind } from "./Hooks/compose-bind";
import {Text, useTheme, RequestCloseContext} from "customize-easy-ui-component";
import { noOp } from "customize-easy-ui-component/esm/misc/noop";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";


const KeyCodes = {
  ArrowUp: 38,
  ArrowDown: 40,
  Home: 36,
  End: 35
};

interface MenuListContextType {
  focus: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const MenuListContext = React.createContext<MenuListContextType>({
  focus: false,
  onKeyDown: () => {}
});

type ChildrenType = React.ReactElement<MenuItemProps>;

export interface MenuListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A combination of MenuItem, MenuLabel, and MenuDivider children */
  children: ChildrenType | ChildrenType[];
  /** Useful if you are providing your own MenuItem children */
  focusableChildren?: React.ComponentType<any>[];
}

export const MenuList: React.FunctionComponent<MenuListProps> = ({
  children,
  focusableChildren = [],
  ...other
}) => {
  const theme = useTheme();
  const disabled = new Map();
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const kids = React.Children.toArray(children);

  const focusComponents = [MenuItem, ...focusableChildren];
  const focusableItems = kids.filter(
    kid =>
      React.isValidElement(kid) &&
      focusComponents.indexOf(kid.type as React.ComponentType) > -1
  );

  const lastIndex = focusableItems.length - 1;
  const firstIndex = 0;

  return (
    <div
      role="menu"
      onKeyDown={(e: React.KeyboardEvent) => {
        if (
          e.keyCode === KeyCodes.ArrowDown ||
          (e.keyCode === KeyCodes.ArrowUp && focusIndex === null)
        ) {
          e.preventDefault();
          setFocusIndex(0);
        }
      }}
      css={{
        minWidth: "200px",
        display: "block",
        padding: `${theme.spaces.sm} 0`
      }}
      {...other}
    >
      {kids.map(kid => {
        if (!React.isValidElement(kid)) {
          return null;
        }

        const i = focusableItems.indexOf(kid);

        if (i < 0) {
          return kid;
        }

        disabled.set(i, kid.props.disabled);

        function focusDown(current: number) {
          const next = current + 1 > lastIndex ? firstIndex : current + 1;
          if (disabled.get(next)) {
            focusDown(next);
          } else {
            setFocusIndex(next);
          }
        }

        function focusUp(current: number) {
          const next = current - 1 < firstIndex ? lastIndex : current - 1;
          if (disabled.get(next)) {
            focusUp(next);
          } else {
            setFocusIndex(next);
          }
        }

        const index = focusIndex || 0;

        return (
          <MenuListContext.Provider
            key={i}
            value={{
              focus: i === focusIndex,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.keyCode === KeyCodes.ArrowDown) {
                  e.preventDefault();
                  focusDown(index);
                } else if (e.keyCode === KeyCodes.ArrowUp) {
                  e.preventDefault();
                  focusUp(index);
                } else if (e.keyCode === KeyCodes.Home) {
                  e.preventDefault();
                  setFocusIndex(firstIndex);
                } else if (e.keyCode === KeyCodes.End) {
                  e.preventDefault();
                  setFocusIndex(lastIndex);
                }
              }
            }}
          >
            {kid}
          </MenuListContext.Provider>
        );
      })}
    </div>
  );
};

MenuList.propTypes = {
  //focusableChildren: PropTypes.arrayOf(PropTypes.element)
};


interface MenuItemProps extends React.HTMLAttributes<Element> {
  /** Called when the menu item is selected. Generally use this instead of onClick. */
  onPress?: OnPressFunction;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Disable this menu item */
  disabled?: boolean;
  noBind?: boolean;
  /** Pass in a string to use standard text styles. Otherwise, pass in any other node. */
  children: React.ReactNode;
  /** Provide a custom component. Eg., ReactRouter Link */
  component?: React.ElementType<any>;
  /** optional content to appear to the right of the menu text */
  contentAfter?: React.ReactNode;
  /** optional content to appear to the left of the menu text */
  contentBefore?: React.ReactNode;
  [key: string]: any;
}

//类似Button处理。 Can't perform a React state update on an unmounted；手机onPress onClick。估计useTouchable有毛病。
export const MenuItem: React.FunctionComponent<MenuItemProps> = ({
                                                                   contentBefore,
                                                                   contentAfter,
                                                                   onPress = noOp,
                                                                   className = "",
                                                                   component: Component = "div",
                                                                   role = "menuitem",
                                                                   noBind=false,
                                                                   children,
                                                                   disabled,
                                                                   onClick,
                                                                   ...other
                                                                 }) => {
  const theme = useTheme();
  const dark = theme.colors.mode === "dark";
  const localRef = React.useRef<HTMLDivElement>(null);
  const closeParent = React.useContext(RequestCloseContext);
  const { focus, onKeyDown } = React.useContext(MenuListContext);
  const isLink = Component === "a" || other.href || other.to;
  //touchable-hook底下,触发onScroll（）可能报错 unmount; dispatch<> <- focus-trap()。
  const { bind, hover, active } = useTouchable({
    onPress: select,
    terminateOnScroll: false,
    disabled,
    delay: 0,
    behavior: isLink ? "link" : "button"
  });

  React.useEffect(() => {
    if (focus && localRef.current) {
      localRef.current.focus();
    }
  }, [focus, localRef]);

  //必须，onPress+ 原生onClick；
  function select() {
    onPress();
    closeParent();
  }

  return (
    <Component
      className={cx("MenuItem", "Touchable", className, {
        "Touchable--hover": hover,
        "Touchable--active": active
      })}
      css={[
        {
          cursor: "pointer",
          opacity: disabled ? 0.3 : 1,
          display: "flex",
          textDecoration: "none",
          transition: "background-color 0.1s ease",
          WebkitTapHighlightColor: "transparent",
          color: theme.colors.text.default,
          alignItems: "center",
          ":focus": {
            outline: theme.outline
          },
          ":focus:not([data-focus-visible-added])": {
            outline: "none"
          },
          padding: `${theme.spaces.sm} ${theme.spaces.md}` ,
          [theme.mediaQueries.sm]: {
            padding: `${theme.spaces.none} ${theme.spaces.none}`
          },
          [theme.mediaQueries.md]: {
            padding: `calc(${theme.spaces.sm} + 0.25rem) calc(${theme.spaces.md} + 0.25rem)`,
          },
          [theme.mediaQueries.lg]: {
            padding: `${theme.spaces.xs} ${theme.spaces.md}`
          },
          [theme.mediaQueries.xl]: {
            padding: `${theme.spaces.sm} ${theme.spaces.lg}`
          }
        },
        hover && {
          background: dark
            ? theme.colors.background.tint2
            : theme.colors.background.tint1
        },
        active && {
          background: theme.colors.background.tint2
        }
      ]}
      role={role}
      tabIndex={disabled ? -1 : 0}
      data-trigger-close={true}
      {...safeBind(
            noBind? {}:{ bind,  ref: localRef },
            {
              onKeyDown: (e: React.KeyboardEvent) => {
                e.stopPropagation();
                if (onKeyDown) onKeyDown(e);
              },
              onClick: (e: React.MouseEvent) => {
                //if(noBind)  return;
                e.stopPropagation();
              }
            },
            other
       ) }
    >
      {contentBefore}
      {typeof children === "string" ? (
        <Text
          wrap={false}
          css={{
            paddingLeft: contentBefore ? theme.spaces.md : 0,
            paddingRight: contentAfter ? theme.spaces.md : 0,
            flex: 1,
            color: "inherit"
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {typeof contentAfter === "string" ? (
        <Text muted>{contentAfter}</Text>
      ) : (
        contentAfter
      )}
    </Component>
  );
};


MenuItem.propTypes = {
  onClick: PropTypes.func,
 // component: PropTypes.element,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  contentBefore: PropTypes.node,
  contentAfter: PropTypes.node,
  onPress: PropTypes.func,
  className: PropTypes.string,
  role: PropTypes.string
};

type MenuDividerProps = React.HTMLAttributes<HTMLDivElement>;

export function MenuDivider(props: MenuDividerProps) {
  const theme = useTheme();
  return (
    <div
      css={{
        height: 0,
        margin: `${theme.spaces.sm} 0`,
        overflow: "hidden",
        borderTop: "1px solid",
        borderColor: theme.colors.border.muted
      }}
      {...props}
    />
  );
}

interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The name of the label */
  children?: React.ReactNode;
}

export const MenuLabel: React.FunctionComponent<MenuLabelProps> = props => {
  const theme = useTheme();
  return (
    <Text
      variant="uppercase"
      css={{
        padding: `${theme.spaces.xs} ${theme.spaces.md}`
      }}
      {...props}
    />
  );
};

MenuLabel.propTypes = {
  children: PropTypes.node
};
