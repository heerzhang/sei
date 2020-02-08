/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Toolbar,
  Navbar,
  useTheme,
  IconButton,
  Button,
  Tabs,
  Tab,
  Layer,
  TabPanel,
  MenuList,
  MenuItem,
  Tooltip,
  ResponsivePopover,
  IconChevronDown,
  IconPlus,
  DarkMode,
  LightMode,
  Pager, IconArchive
} from "customize-easy-ui-component";

import { useSession,  useSignOut } from "../auth";
import { Link, useRoute, useLocation, Switch, Route } from "wouter";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { RelationList } from "../inspect/RelationList";
import { IspDetail } from "../inspect/IspDetail";
import { ReportSample } from "../inspect/ReportSample";
import { BoundReports } from "../inspect/report/BoundReports";


export interface MainProps {
  path?: string;
  id?: string;
  source: any;  //原始记录的json数据 + 。
}

export const TemplateMain: React.FunctionComponent<MainProps> = ({source}) => {
  const theme = useTheme();
  const {user} = useSession();
  //可提前从URL筛选出参数来的。report/143243
  const [match, params] = useRoute("/report/:template/ver/:rep");
  const [match1, params1] = useRoute("/report/:template*");
  let showingRecipe = (match && params.template) || (match1 && params1.template);
  let initTab= showingRecipe=== "list"? 1:
              showingRecipe=== "check"? 2: 0;

  const [activeTab, setActiveTab] = React.useState(initTab);
  const [, setLocation] = useLocation(); 　

  console.log("来InspectMain看当前的params showingRecipe=",showingRecipe ,"initTab=",initTab);

  function onLogoutDo() {
    setLocation("/login",  false );
  }
  const { submitfunc:signOut,  } = useSignOut(onLogoutDo);

  return (
    <Layout>
      <div
        css={css`
          display: flex;
          box-sizing: border-box;
        `}
      >
        {showingRecipe && (
          <div
            css={{
              display: "block",
              position: "relative",
              flex: 1,      　//对布局影响最大
              [theme.mediaQueries.md]: {
                display: "flex",    　
                justifyContent: "center"
              }
            }}
          >

            <div
              css={{
                display: "block",
                position: "absolute",
                width: "100%",
                boxSizing: "border-box",
                [theme.mediaQueries.md]: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: theme.spaces.lg,
                  minHeight: "100vh",
                  paddingLeft: "calc(46vw + 3rem)"
                },
                [theme.mediaQueries.xl]: {
                  paddingRight: theme.spaces.xl,
                  paddingLeft: "calc(40vw + 6rem)"
                }
              }}
            >
              <Layer
                elevation="xl"
            //组件id! 缺少key导致：遇到小屏幕轮转显示正常，大屏整个显示模式却必须手动刷新才能切换内容。
                key={showingRecipe}
                css={{
                  borderRadius: 0,
                  position: "relative",
                  boxShadow: "none",
                  width: "100%",
                  [theme.mediaQueries.md]: {
                    marginTop: "auto",
                    height: "auto",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    marginBottom: "auto",
                    width: "100%",
                    borderRadius: theme.radii.lg,
                    boxShadow: theme.shadows.xl
                  }
                }}
              >
                <MainContent id={showingRecipe} />
              </Layer>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

interface MainContentProps {
  id?: string;
}

function MainContent({ id }: MainContentProps) {
  if (!id) {
    return null;
  }
  return <SecondRoterContent id={id} />;
}


interface SecondRoterProps {
  id?: string;
  dt?: any;
}
//上级是path="/report/:rest*"的。在底下扩充目录。
function SecondRoterContent({id, dt}: SecondRoterProps) {
  return (
    <Switch>
      <Route path={"/report/EL-JJ/ver/1/:repId/item/1.4"} component={ReportSample} />
      <Route path={"/report/EL-JJ/ver/1/:repId/item/ALL"} component={ReportSample} />
      <Route path="/inspect/:id">
        {params => <IspDetail readOnly params={params}/>}
      </Route>

      <Route path="/:rest*">
          <h1>没有该URL匹配的视图内容</h1>
      </Route>
    </Switch>
  );
}


export default TemplateMain;

