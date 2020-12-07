/** @jsxImportSource @emotion/react */
import {  Global } from "@emotion/react";
import * as React from "react";
//import { Link as RouterLink } from "@reach/router";
//使用RouterLink不会强制刷新页面的。
import { Link as RouterLink } from "wouter";
import food from "./images/food.svg";
import {
  Navbar,
  Toolbar,
  Text, Button,
  useTheme,
  useResponsiveBodyPadding,
  Container,
  Link,   　　　//这里sancho的Link等同于基础的<a><a/>，会跳转重新刷新页面；
  IconArrowRight, IconGift, IconTruck, IconPrinter, IconKey
} from "customize-easy-ui-component";
import { 首页末尾链接 } from "./comp/rootRarelyVary";

import cutting_board_knife from './images/cutting-board-knife.jpg';
//无需登录即可显示的　主页面；


interface BrandingProps {
}
export const Branding: React.FunctionComponent<BrandingProps> = (props) => {
  const theme = useTheme();
  const showingRecipe = props["*"];   　　 //"这个是问号前的除已预定义部分的剩余路径lo/gins/ds？
  console.log("进入Branding功能页面="+ JSON.stringify(showingRecipe) );
  const responsiveBodyPadding = useResponsiveBodyPadding();

  return (
    <main>
      <Global
        styles={{
          html: {
            backgroundColor: theme.colors.background.tint1
          }
        }}
      />
      <Navbar
        position="fixed"
        css={{
          position: "absolute",
          boxShadow: "none",
          background: "transparent"
        }}
      >
        <Toolbar>
          <Text
            variant="h5"
            css={{
              alignItems: "center",
              display: "flex",
              color: "#43596c"
            }}
            gutter={false}
          >
            <img
              css={{
                marginRight: theme.spaces.sm,
                width: "30px",
                height: "30px"
              }}
              src={food} alt={''}
              aria-hidden
            />
            <span>检验平台</span>
          </Text>
          <div css={{ marginLeft: "auto" }}>
            <RouterLink   href="/login" >
              <Button
                size="md"
                intent="primary"
                iconBefore={<IconKey />}
                iconAfter={<IconArrowRight />}
              >
                用户登录
              </Button>
            </RouterLink>
          </div>
        </Toolbar>
      </Navbar>
      <div
        css={[
          {
            paddingBottom: theme.spaces.xl,
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            background: "white",
            [theme.mediaQueries.md]: {
              backgroundSize: "cover",
              backgroundImage: `url(${cutting_board_knife})`
            }
          },
          responsiveBodyPadding
        ]}
      >
        <Text
          css={{
            paddingTop: theme.spaces.lg,
            paddingLeft: theme.spaces.md,
            paddingRight: theme.spaces.md,
            marginBottom: theme.spaces.lg,
            textAlign: "center",
            marginTop: theme.spaces.lg,
            marginBotttom: theme.spaces.xl,
            color: theme.colors.palette.gray.base,
            [theme.mediaQueries.sm]: {
              maxWidth: "46rem"
            }
          }}
          variant="h3"
        >
          特种设备业务平台（测试中）
        </Text>

        <div
          css={{
            fontSize: theme.fontSizes[0],
            maxWidth: "38rem",
            position: "relative",
            padding: "8px 15px",
            background: theme.colors.background.tint1,
            marginLeft: theme.spaces.md,
            marginRight: theme.spaces.md,
            borderRadius: theme.radii.lg,
            display: "inline-block",
            [theme.mediaQueries.md]: {
              background: "white",
              padding: "12px 18px",
              marginLeft: "60px",
              marginTop: theme.spaces.md,
              marginBottom: theme.spaces.md
            }
          }}
        >
          <div
            css={{
              content: "''",
              position: "absolute",
              zIndex: 0,
              display: "none",
              bottom: 0,
              left: "-7px",
              height: "20px",
              width: "20px",
              background: "white",
              backgroundAttachment: "fixed",
              borderBottomRightRadius: "15px",
              [theme.mediaQueries.md]: {
                display: "block"
              }
            }}
          />
          <Text
            css={{
              fontSize: theme.fontSizes[1],
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "flex-end",
              [theme.mediaQueries.md]: {
                textAlign: "left"
              }
            }}
          >
            <img
              css={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                position: "absolute",
                flex: "0 0 60px",
                display: "none",
                bottom: "-25px",
                left: "-80px",
                [theme.mediaQueries.md]: {
                  display: "block"
                }
              }}
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566208112112&di=057216c9b1f519a6bec42f465025062e&imgtype=0&src=http%3A%2F%2Fqcloud.dpfile.com%2Fpc%2F5B4EKvgdVHvYJdSIXlvqZF_P3CApeL2gFM3VtjrHbrl2RzRjFYhj5njVYekTCwBvTYGVDmosZWTLal1WbWRW3A.jpg"
              alt="Ben"
            />
            下一代业务平台(用户意见征集阶段)，请使用手机上的谷歌Chrome浏览器来访问，虽然微信也可直接访问本平台。
            开放功能还非常有限。目前支持原始记录编制报告和打印，报告模板还仅实验性地推出了1个；可以出正式检验报告。
            支持设备数据从旧平台同步；本平臺完全從零起步，其它模块功能还属于模型设计初期，若想和旧平臺完全互動，
            還會有很多政策層面疑慮。平台目前运行于个人笔记本电脑，调试可能导致短暫異常，若下班了就无法访问。
            登录前先验证注册帐户! 😋
          </Text>
          <Text><Link href="/about">平台操作说明书</Link></Text>
          <div
            css={{
              content: "''",
              position: "absolute",
              zIndex: 1,
              bottom: 0,
              left: "-10px",
              height: "20px",
              width: "10px",
              display: "none",
              [theme.mediaQueries.md]: {
                display: "block"
              },
              background: "#e0dbd8d1",
              borderBottomRightRadius: "10px"
            }}
          />
        </div>

        <div
          css={{
            paddingLeft: theme.spaces.md,
            paddingRight: theme.spaces.md,
            paddingBottom: theme.spaces.xl,
            textAlign: "center",
            marginTop: theme.spaces.lg
          }}
        >
          <RouterLink   to="/device/">
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconGift />}
              iconAfter={<IconArrowRight />}
            >
              从设备入手
            </Button>
          </RouterLink>
          <RouterLink   to="/unit/">
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconGift />}
              iconAfter={<IconArrowRight />}
            >
              从单位入手
            </Button>
          </RouterLink>
          <RouterLink   to="/inspect/">
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconTruck />}
              iconAfter={<IconArrowRight />}
            >
              从检验入手
            </Button>
          </RouterLink>
          <RouterLink to="/report/guide">
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconPrinter />}
              iconAfter={<IconArrowRight />}
            >
             正式报告入口
            </Button>
          </RouterLink>
        </div>

        <svg
          css={{
            position: "absolute",
            bottom: 0,
            pointerEvents: "none",
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
      </div>

      <div
        css={{
          background: theme.colors.background.tint1,
          paddingTop: theme.spaces.lg,
          paddingBottom: theme.spaces.lg,
          width: "100%",
          overflow: "hidden"
        }}
      >
        <Container css={{
          "@media print and (min-width:551px)and (max-width:849px)": {
            display: "none",
          }
        }}>
          <div
            css={{
              display: "block",
              textAlign: "center",
              "& > div": {        　//作用面较广泛，表示本身的直接子代div元素；
                marginBottom: theme.spaces.xl,
                maxWidth: "20rem",
                marginLeft: "auto",
                marginRight: "auto"
              },
              [theme.mediaQueries.xl]: {
                display: "flex",
                justifyContent: "space-between",
                "& > div": {
                  margin: theme.spaces.lg,
                  maxWidth: "20rem"
                }
              },
            }}
          >
            <div>
              <svg
                css={{ marginBottom: theme.spaces.md }}
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
              >
                <path d="M22 2v22h-20v-22h3c1.23 0 2.181-1.084 3-2h8c.82.916 1.771 2 3 2h3zm-11 1c0 .552.448 1 1 1 .553 0 1-.448 1-1s-.447-1-1-1c-.552 0-1 .448-1 1zm9 1h-4l-2 2h-3.897l-2.103-2h-4v18h16v-18zm-13 9.729l.855-.791c1 .484 1.635.852 2.76 1.654 2.113-2.399 3.511-3.616 6.106-5.231l.279.64c-2.141 1.869-3.709 3.949-5.967 7.999-1.393-1.64-2.322-2.686-4.033-4.271z" />
              </svg>
              <Text variant="h4">Save</Text>
              <Text>
                1  <Text><Link href="/about"><h4>看操作说明书了解怎么做报告</h4></Link></Text>
              </Text>
            </div>

            <div>
              <svg
                css={{ marginBottom: theme.spaces.md }}
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
              >
                <path d="M20 3c0-1.657-1.344-3-3-3s-3 1.343-3 3c0 .312.061.606.149.889l-4.21 3.157c.473.471.878 1.01 1.201 1.599l4.197-3.148c.477.316 1.048.503 1.663.503 1.656 0 3-1.343 3-3zm-2 0c0 .551-.448 1-1 1s-1-.449-1-1 .448-1 1-1 1 .449 1 1zm3 12.062c1.656 0 3-1.343 3-3s-1.344-3-3-3c-1.281 0-2.367.807-2.797 1.938h-6.283c.047.328.08.66.08 1s-.033.672-.08 1h6.244c.396 1.195 1.509 2.062 2.836 2.062zm-1-3c0-.551.448-1 1-1s1 .449 1 1-.448 1-1 1-1-.448-1-1zm-20-.062c0 2.761 2.238 5 5 5s5-2.239 5-5-2.238-5-5-5-5 2.239-5 5zm2 0c0-1.654 1.346-3 3-3s3 1.346 3 3-1.346 3-3 3-3-1.346-3-3zm7.939 4.955l4.21 3.157c-.088.282-.149.576-.149.888 0 1.657 1.344 3 3 3s3-1.343 3-3-1.344-3-3-3c-.615 0-1.186.187-1.662.504l-4.197-3.148c-.324.589-.729 1.127-1.202 1.599zm6.061 4.045c0-.551.448-1 1-1s1 .449 1 1-.448 1-1 1-1-.449-1-1z" />
              </svg>
              <Text variant="h4">Share</Text>
              <Text>
                2 无需登录就可以看得的页面； .
              </Text>
            </div>

            <div
              css={{
                marginBottom: "0 !important",   　 //最高级别指示的。覆盖上面的"& > div": { }甚至下面的[theme.mediaQueries.md] 。
                [theme.mediaQueries.md]: {
                  marginBottom:　theme.spaces.xl, 　　//其实无效theme.mediaQueries.xl　＝ @media (min-width:1200px);
                }
              }}
            >
              <svg
                css={{ marginBottom: theme.spaces.md }}
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
              >
                <path d="M13 8h-8v-1h8v1zm0 2h-8v-1h8v1zm-3 2h-5v-1h5v1zm11.172 12l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
              </svg>
              <Text variant="h4">Search</Text>
              <Text>
                3  Search for .
              </Text>
            </div>
          </div>
        </Container>
      </div>
      {首页末尾链接()}
    </main>
  );
};

//用于动态加载，缺省的
export default Branding;



//<Link  from "customize-easy-ui-component UI"是<a>跳转刷新=级别高的。而{Link as RouterLink }from "wouter @reach/router"是APP内部转移，节省资源=能保持context。
//css修饰体内部的 "& > div": { },  表示 当前元素的子代元素div，对它附加样式{ };
/*上面responsiveBodyPadding（内定好的空挡留白）带入的添加： 　{ padding-top:56px;} 　以及
  <style data-emotion="css">@media (min-width:768px){.css-adq7pz-Branding{padding-top:64px;}}</style>　顶部留出64px；分成两个尺寸。
*/
//模拟A4打印机窗口大小。A4，边距=无，缩放=默认。exact-width:595px; A4，边距=无，缩放=70%。exact-width:850px;不算大哦，差不多就是810px宽度。看着像1142px*1590px。
//打印机的所用代码宽度px实际很小的，没有缩放可能才600px的。["@media print and (min-width:551px)and (max-width:849px)"]: {display: "none",}
//<RouterLink   to="/device/">    <Button />  />   这里： 实际向Button会注入{ onClick=navigate(href) }； 估计useTouchable的bind导致异常。


