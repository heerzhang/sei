/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
//import { Redirect, Link } from "@reach/router";
import {  Link, } from "wouter";
import food from "./images/food.svg";
import {
  useTheme,
  Layer,
  Text,
  Button,
  Link as StyledLink,
  LayerLoading,
  Alert,
  Container, Input, InputGroup, IconArrowRight
} from "customize-easy-ui-component";
import {  useSession, useLoginToServer } from "./auth";
//query-string是其他的基础库所依赖的，不是直接引入的。
import queryString from "query-string";
import { Layout } from "./Layout";
//import { InputGroup } from "./comp/Form";
import { Link as RouterLink } from "wouter";

interface LoginProps {
}
export const Login: React.FunctionComponent<LoginProps> = props => {
  const theme = useTheme();
  const qs = queryString.parse(window.location.search);

  const [isRegistering, setIsRegistering] = React.useState(
    typeof qs.register === "string"
  );
  //console.log("Login qs开始useLocation =", window.location, nowPath);
  const [loading, setLoading] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  //const { from } = { from: { pathname: "/" } };

  // logging in errors
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ email: "", password: "" });
  const { userList, submitfunc, error:errLogin,  } = useLoginToServer(form);
 //console.log("useLoginToServer回Q=7"+ JSON.stringify(user));
  const {user,loading:isload} = useSession();
  console.log("Login开始userList="+ JSON.stringify(userList)+"；useSession user=",user,"errLogin="+errLogin);


  async function loginEmail(e: React.FormEvent  | Event) {
    e.preventDefault();

    const { email, password } = form;

    //const fn = isRegistering ? createUserWithEmail : loginWithEmail;

    try {
      setError("");
      setLoading(true);
      console.log("Login开始form="+ JSON.stringify(form)+"；name="+JSON.stringify(email)+"password="+password);
      //await fn(email, password);
      await  submitfunc();
      console.log("login返回Q３ redirectToReferrer=", redirectToReferrer);
     // const user=userList;
      setRedirectToReferrer(true);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Please try again.");
    }
  }

  //都可能无法刷新？ <Redirect  to={from.pathname} />;  setLocation (to: Path, replace?: boolean)
  React.useEffect(() => {
    if(redirectToReferrer)
        window.location.href = "/";
  }, [redirectToReferrer]);


  return (
    <Layout>
      <Container>
        <div
          css={{
            marginTop: theme.spaces.xl,
            marginBottom: theme.spaces.lg,
            maxWidth: "26rem",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block"    //若是换成display:flex;将导致两个子元素的并排一行显示，Layer对话框宽度InputGroup受到挤压。
          }}
        >
          <Link
            css={{
              textDecoration: "none"
            }}
            to="/"
          >
            <Text
              variant="h4"
              css={{
                alignItems: "center",
                display: "block",

                width: "100%",
                textAlign: "center",
                color: "#43596c"
              }}
              gutter={false}
            >
              <img
                css={{
                  width: "75px",
                  height: "75px"
                }}
                src={food}  alt={''}
                aria-hidden
              />
              <div css={{ marginTop: theme.spaces.sm }}>检验平台</div>
            </Text>
          </Link>
          <Layer
            css={{
              boxShadow: "none",

              background: "white",
              [theme.mediaQueries.md]: {
                marginTop: theme.spaces.xl,
                boxShadow: theme.shadows.xl
              }
            }}
          >
            <div
              css={{
                borderBottom: "1px solid",
                borderColor: theme.colors.border.muted,
                textAlign: "center",
                padding: theme.spaces.lg,
                paddingBottom: theme.spaces.sm
              }}
            >
              <Text variant="h4">
                {isRegistering ? "Create an account" : "使用前先登陆账户"}
              </Text>

              <div
                css={{
                  textAlign: "center",
                  paddingBottom: theme.spaces.sm
                }}
              >
                {isRegistering ? (
                  <Text css={{ fontSize: theme.fontSizes[0] }}>
                    已经有账户?{" "}
                    <StyledLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setIsRegistering(false);
                      }}
                    >
                      登录.
                    </StyledLink>
                  </Text>
                ) : (
                  <Text css={{ fontSize: theme.fontSizes[0] }}>
                    若没有账户?{" "}
                    <StyledLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setIsRegistering(true);
                      }}
                    >
                      先要申请
                    </StyledLink>
                    <RouterLink   to="/login?register=true" >
                      <Button
                        size="xs" noBind
                        intent="primary"
                        iconAfter={<IconArrowRight />}
                      >注册
                      </Button>
                    </RouterLink>
                  </Text>
                )}
              </div>
            </div>
            <div
              css={{
                padding: theme.spaces.lg
              }}
            >
              {error && (
                <Alert
                  css={{ marginBottom: theme.spaces.md }}
                  intent="danger"
                  title="An error has occurred while logging in."
                  subtitle={error}
                />
              )}

              <div   css={{  marginTop: theme.spaces.md   }}>

                  <Text muted css={{ textAlign: "center" }} variant="subtitle">
                    请使用您的用户名密码登录:
                  </Text>
                  <InputGroup  label="账户">
                    <Input
                      onChange={e => {
                        setForm({ ...form, email: e.currentTarget.value });
                      }}
                      value={form.email}
                      inputSize="md"
                      type="text"
                      //浏览器HTML5验证格式是否正确input type="email" required multiple/>
                      placeholder="账户"
                    />
                  </InputGroup>
                  <InputGroup hideLabel label="密码">
                    <Input
                      onChange={e => {
                        setForm({ ...form, password: e.currentTarget.value });
                      }}
                      value={ form.password }
                      inputSize="md"
                      type="password"
                      //type={ form.password? "password":"text"}强制要求输入密码，不采用浏览器填充记住的密码。
                      placeholder="密码"
                      autoComplete="off"
                    />
                  </InputGroup>
                  <div css={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      disabled={!form.email || !form.password}
                      block
                      component="button"
                      css={{
                        textAlign: "center",
                        width: "100%",
                        marginTop: theme.spaces.md
                      }}
                      type="submit"
                      size="md"
                      intent="primary"
                      onPress={e => loginEmail(e)}
                    >
                      {isRegistering ? "注册的需要另外途径申请" : "登录"}
                    </Button>
                  </div>

              </div>
            </div>

            <LayerLoading loading={loading || isload} />
          </Layer>
        </div>
      </Container>
    </Layout>
  );
};


/*屏蔽密码的自动填充功能。
    <Input
      　setForm({ ...form, password: e.currentTarget.value });　这里后面的新属性替换顺序在前面的同名字属性。
    type={ form.password? "password":"text"}
    />
*/
