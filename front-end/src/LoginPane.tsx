/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
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
import { useSession, useLoginToServer, useRegisterToServer } from "./auth";
//query-string是其他的基础库所依赖的，不是直接引入的。
import queryString from "query-string";
import { Layout } from "./Layout";
//import { InputGroup } from "./comp/Form";
//import { Link as RouterLink } from "wouter";

interface LoginProps {
}
export const Login: React.FunctionComponent<LoginProps> = props => {
  const theme = useTheme();
  const { loading:isload } = useSession();
  const qs = queryString.parse(window.location.search);
  const [isRegistering, setIsRegistering] = React.useState(
    typeof qs.register === "string"
  );
  const [loading, setLoading] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ username: "", password: "",
         mobile:'', external:'旧平台'} as any);

  const {  submit:submitfunc,  } = useLoginToServer(form);
  const { result:regOK, submit:registerfunc, error:errReg } = useRegisterToServer(form);
  console.log("登录机密 开始userList=",regOK,"errReg=",errReg);

  //用<form> 来提交，这样required属性就能生效了，能够验证表单的内容。
  async function doLogin(e: React.FormEvent  | Event)
  {
      e.preventDefault();
      try {
        setError("");
        setLoading(true);
        await  submitfunc();
        setRedirectToReferrer(true);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
  }

  async function doRegister(e: React.FormEvent  | Event)
  {
    e.preventDefault();
    if(form?.password2!==form.password)  return setError("两次输入的设置密码不一致");
    try {
      setError("");
      setLoading(true);
      await  registerfunc();
      setError("恭喜您，账户申请单已提交，等待审核与自动开通，或可立刻联系维护人员去开");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }
  //都可能无法刷新？ <Redirect  to={from.pathname} />;  setLocation (to: Path, replace?: boolean)
  React.useEffect(() => {
    if(redirectToReferrer)
        window.location.href = "/";       //强制刷新页面。
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
                {isRegistering ? "我要注册一个账户" : "使用前先登陆账户"}
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
                    若没有账户?{" "}先要
                    <StyledLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setIsRegistering(true);
                      }}
                    >
                      <Button size="xs" noBind intent="primary" iconAfter={<IconArrowRight/>}
                      >申请注册
                      </Button>
                    </StyledLink>

                  </Text>
                )}
              </div>
            </div>
            <div
              css={{
                padding: theme.spaces.lg
              }}
            >
            <form  method="post"
                   onSubmit={e =>{isRegistering ? doRegister(e) : doLogin(e) } }>
             <div   css={{  marginTop: theme.spaces.md   }}>
                {isRegistering ? (
                 <React.Fragment>
                  <Text css={{ fontSize: theme.fontSizes[0] }}>
                    首先提供旧平台的认证信息，认证通过才能申请成功。
                  </Text>
                   <InputGroup label="旧平台的账号ID">
                     <Input value={form?.eName||''} required
                         onChange={e =>setForm({ ...form, eName: e.currentTarget.value }) }
                     />
                   </InputGroup>
                   <InputGroup label="旧平台密码">
                     <Input value={form?.ePassword||''} type="password" required
                            onChange={e =>setForm({ ...form, ePassword: e.currentTarget.value }) }
                     />
                   </InputGroup>
                   <InputGroup label="留个电话吧">
                     <Input value={form?.mobile||''} required
                            onChange={e =>setForm({ ...form, mobile: e.currentTarget.value }) }
                     />
                   </InputGroup>
                 </React.Fragment>
                ) : (
                  <Text muted css={{ textAlign: "center" }} variant="subtitle">
                    请使用您的用户名密码登录:
                  </Text>
                )}
                 <InputGroup  label={isRegistering ?'申请本平台账户名字':"账户"}>
                    <Input  required
                      onChange={e => {
                        setForm({ ...form, username: e.currentTarget.value });
                      }}
                      value={form.username}
                      inputSize="md"
                      type="text"
                      //浏览器HTML5验证格式是否正确input type="email" required multiple/>
                      placeholder="账户"
                    />
                  </InputGroup>
                  <InputGroup hideLabel={!isRegistering} label={isRegistering ?'设置登录密码(强度不合格会报错)':"密sdfsd码"}>
                    <Input  required
                      onChange={e => {
                        setForm({ ...form, password: e.currentTarget.value });
                      }}
                      value={ form.password }
                      inputSize="md"
                      type="password"
                      //type={ form.password? "password":"text"}强制要求输入密码，不采用浏览器填充记住的密码。
                      placeholder="密码最少6位的复杂的 asdasdasda"
                      autoComplete="off"
                    />
                  </InputGroup>

                {isRegistering ? (
                  <React.Fragment>
                    <InputGroup label="第二次输入密码">
                      <Input required
                             value={form?.password2||''} type="password" placeholder="两次密码要相同"
                             onChange={e =>setForm({ ...form, password2: e.currentTarget.value }) }
                      />
                    </InputGroup>
                  </React.Fragment>
                ) : ( null )}

               {error && (
                 <Alert
                   css={{ marginTop: theme.spaces.md }}
                   intent={regOK ? 'success':"danger"}
                   title={regOK ? '恭喜成功':"报ww错"}
                   subtitle={error}
                 />
               )}
                <div css={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    disabled={!form.username || !form.password}
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
                    //onPress={e =>{isRegistering ? doRegister(e) : doLogin(e) } }
                  >
                    {isRegistering ? "注册申请" : "登录"}
                  </Button>
                </div>
              </div>
            </form>
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
//若用<RouterLink to="/login?register=true">只是在URL?号后面修改的去路由，就不会有任何动作的，因为本身已经是/login这个页面，这样问号后面不作数了。
//使用e.target时要小心，而用e.currentTarget就可放心;  https://blog.csdn.net/syleapn/article/details/81289337
