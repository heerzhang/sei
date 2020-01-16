/** @jsx jsx */
import { jsx, } from "@emotion/core";
//import * as React from "react";
import {
  Input,
  Text,
  useTheme,
  InputBaseProps,
} from "customize-easy-ui-component";
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



