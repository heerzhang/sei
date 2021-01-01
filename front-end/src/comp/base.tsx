/** @jsxImportSource @emotion/react */
//import { jsx, } from "@emotion/react";
//import * as React from "react";
import {
  Input,
  Text,
  useTheme,
  InputBaseProps,
} from "customize-easy-ui-component";
import * as React from "react";
import { StackContext } from "react-gesture-stack";
import { animated } from "react-spring";
//import { useSession } from "../auth";
//import {Helmet} from "react-helmet";

//通用UI组件 定制后的；

//透视隐形的输入框框; Input组件底下不能挂接chidren了。
interface TransparentInputProps extends InputBaseProps {}
export const TransparentInput = (props: TransparentInputProps) => {
  const theme = useTheme();
  return (
    <Input
      css={{
        background: "none",
        border: "none",
        boxShadow: "none",
        ":focus": {
          outline: "none",
          boxShadow: "none",
          background: theme.colors.palette.gray.lightest
        },


      }}
      {...props}
    />
  );
};

//带并排标题的　单行的嵌套输入子控件空间
export const ContainLine =({ display, children, ...props })  => {
  const theme = useTheme();
  return (
    <div
      css={{
        marginTop: "-0.25rem",
        marginLeft: "-0.75rem",
        marginRight: "-0.75rem",
        width: '100%',
        margin: 'auto',
        maxWidth: '600px'
      }}
      {...props}
    >

      <div
        css={{
          backgroundColor: "transparent",
          display: "flex",
          [theme.mediaQueries.md]: {
            maxWidth: "600px"
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

//最早来自https://github.com/bmcmahen/julienne/blob/master/src/FollowingList.tsx
//别人封装好的组件也可定制和替换：SearchTitle用于代替基本构件库的已有标准样式StackTitle部分，相当于定制修改原生就有的组件。
export function SearchTitle({ children }: { children: React.ReactNode }) {
  const {
    //navHeight,
    //index,
    active,
    //changeIndex,
    opacity,
    transform
  } = React.useContext(StackContext);

  return (
    <div
      className="StackTitle"
      aria-hidden={!active}
      style={{
        pointerEvents: active ? "auto" : "none",
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
      }}
    >
      <animated.div
        className="StackTitle__heading"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity,
          transform: transform.to(x => `translateX(${x * 0.85}%)`)
        } as any }
      >
        {children}
      </animated.div>
    </div>
  );
}

