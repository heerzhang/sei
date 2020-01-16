package org.fjsei.yewu.security;

import org.fjsei.yewu.property.SeiFilterOriginProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

//过滤器实际也是注入的。
@Component
public class JwtAuthorizationTokenFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    //这3个参数Spring直接注入默认初始化？？所以实际上这３个变量也算被自动构造注入的。
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;        //所有请求公共的。
    private final String tokenHeader;

    //注入application.yml配置
    @Value("${sei.filter.maxage:1}")
    private final String filterMaxage;
    @Value("${sei.testMode:false}")
    private boolean  isTestMode;
    //允许设置多个CORS 域名;
    @Autowired
    private SeiFilterOriginProperties seiFilterOriginProperties;

    //单次请求过滤器；这个是被Spring直接注入的。参数默认初始化了。
    public JwtAuthorizationTokenFilter(UserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil, @Value("${jwt.header}") String tokenHeader) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.tokenHeader = tokenHeader;
        filterMaxage="";
    }

    //JSON Web Token（JWT）是一个开放式标准（RFC 7519）
    //一般放在HTTP的headers 参数里面的authorization里面，值的前面加Bearer关键字和空格。
    //不同应用系统可能要求用户和用户权限并不一致，? 考虑用户权限模型部分的恰当的独立性。

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String originHeads = request.getHeader("Origin");
        if(seiFilterOriginProperties.getList().contains(originHeads) ){
            //设置允许跨域的配置允许进行跨域的主机ip（正式上线时可以动态配置具体允许的域名和IP）
            response.setHeader("Access-Control-Allow-Origin", originHeads);
        }
        if (request.getMethod().equals("OPTIONS")){     //浏览器自主决定的请求，不是用户决定。
            logger.debug("浏览器的预请求的处理..");
            //response.setHeader("Access-Control-Allow-Origin",filterOrigin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
            response.setHeader("Access-Control-Max-Age", filterMaxage);
            response.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization,token");
            response.setHeader("Connection", "keep-alive");
            response.setHeader("Vary", "Origin, Access-Control-Request-Headers");
            return;
        }else {
            String startPath =request.getServletPath();
            if("GET".equals(request.getMethod()) && "/forbidden".equals(startPath)) {
                //response.setContentType("text/html;charset=utf-8");  getMethod()
                response.sendError(404, "资源不存在");
                return;     //禁止使用的URL
            }
            if(isTestMode) {
                if (startPath.startsWith("/test/") || startPath.startsWith("/vendor/")
                        || startPath.startsWith("/favicon.ico"))
                {
                    chain.doFilter(request, response);
                    return;      //没必要授权的，只在开发测试阶段使用的URL
                }
            }
            //logger.info("processing authentication for '{}'={},q={}", request.getPathInfo(), request.getRequestURL(), request.getServletPath());
            //response.setHeader("Access-Control-Allow-Origin",filterOrigin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Connection", "keep-alive");
            response.setHeader("Vary", "Origin");

            final String requestHeader = request.getHeader(this.tokenHeader);       //取名字是Authorization的参数；
            String username = null;
            String authToken = null;
            //注销时：OPTIONS过后requestHeader="";    ?Bearer 和token= 不是同一个参数。
            //?标准没Bearer ;
            //新版graphiQL的客户端都会给服务器Authorization: Bearer ? + cockie=俩个token都带来
            if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
                authToken = requestHeader.substring(7);
            }
            else {    //没有Authorization: Bearer开头;
                //为何点内部链接就不行，非但刷新才可以走Bearer　那个逻辑呢？，只有Cookie: token= 没有authorization:
                Cookie[] cookies=request.getCookies();
                if(cookies!=null) {
                    Cookie tokenCook = Arrays.stream(cookies).filter(cookie -> cookie.getName().equals("token")).findFirst().orElse(null);
                    if (tokenCook != null)
                        authToken = tokenCook.getValue();
                    //手机端支持？
                }
            }


            /*Authentication auth= SecurityContextHolder.getContext().getAuthentication();
            if(auth!=null)       logger.info("进入的auth{}",auth.getAuthorities());
            else    logger.info("进入的auth{没东西}");    */
            jwtTokenUtil.continuedTokenLifeAuthentication(this.userDetailsService, request, response, authToken);

            //真正控制还要到上层协议里头去控制，每一个graphQL请求都要验证Auth,可见性MyGraphQLWebAutoConfiguration。
            chain.doFilter(request, response);
            //就算Url没有要求授权验证它也可能会到这里。
        }
    }
}


/*
Cookie 的一个独特之处在于，浏览器会自动为每个请求附加到特定域和子域的 Cookie 到 HTTP 请求的头部。
这就意味着，如果我们将 JWT 存储到了 Cookie 中，假设登录页面和应用共享一个根域，那么在客户端上，我们不需要任何其他的的逻辑，就可以让 Cookie 随每一个请求发送到应用服务器。
但是另一方面，它引入了一个新的问题 —— XSRF。
主流框架都带有防御措施，可以很容易地对抗 XSRF（跨站请求伪造），CSRF 因为它是一个众所周知的漏洞。
就像是发生过很多次一样，使用 Cookie 意味着利用 HTTP Only 可以很好的防御脚本注入；  https://www.imooc.com/article/40816
GraphQL可以理解为基于RESTful的一种封装，目的在于构建使Client更加易用的服务，可以说GraphQL是更好的RESTful设计。
HTTP无状态协议和Connection:Keep-Alive容易犯的误区: https://www.cnblogs.com/watermarks/articles/3766310.html
理解cookie，session，token; CORS(跨域资源共享)  https://www.liangzl.com/get-article-detail-16019.html
*/
