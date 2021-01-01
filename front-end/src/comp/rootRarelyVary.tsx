/** @jsxImportSource @emotion/react */
//import { jsx,  } from "@emotion/react";
import * as React from "react";
import {
  Text, Link, useTheme, Container
} from "customize-easy-ui-component";

//import { Link as RouterLink } from "wouter";


//重复性代码抽象抽取参数化后可复用。
export const 首页末尾链接= (
) => {
  const theme = useTheme();
  return  <div
    css={{
      textAlign: "center",
      position: "relative",
      paddingBottom: theme.spaces.lg,
      paddingTop: "4rem",
      background: theme.colors.background.tint2,
      width: "100%",
      overflow: "hidden"
    }}
  >
    <svg
      css={{
        position: "absolute",
        top: "-1px",
        pointerEvents: "none",
        transform: "rotate(180deg)",
        left: 0,
        fill: theme.colors.background.tint1
      }}
      fillRule="evenodd"
      clipRule="evenodd"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 240"
    >
      <g>
        <path d="M1920,144.5l0,95.5l-1920,0l0,-65.5c196,-36 452.146,-15.726 657.5,8.5c229.698,27.098 870,57 1262.5,-38.5Z" />
      </g>
    </svg>
    <Container>
      <Text
        css={{
          position: "relative",
          zIndex: 10,
          fontSize: theme.fontSizes[0]
        }}
      >
        制作者 <Link href="/test/Upload">heerzhang</Link> 维护人QQ号码<Link href="/about">1736273864</Link>
        <br />
        <Link href="mailto:herzhang@163.com">有问题发个电子邮件</Link> 欢迎提出问题!
        <Link href="/maintenance/">后台维护传送门</Link>
        <br />
        <div>
          Icons made by{" "}
          <Link
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
          >
            Smashicons
          </Link>{" "}
          from{" "}
          <Link href="/report" title="福建特检">
            福建特检信息中心
          </Link>{" "}
          is licensed by{" "}
          <Link
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
          >
            CC 3.0 BY
          </Link>
        </div>
      </Text>
    </Container>
  </div>;
};



