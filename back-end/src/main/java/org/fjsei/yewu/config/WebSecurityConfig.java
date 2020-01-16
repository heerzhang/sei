package org.fjsei.yewu.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.fjsei.yewu.security.JwtAuthenticationEntryPoint;
import org.fjsei.yewu.security.JwtAuthorizationTokenFilter;
import org.fjsei.yewu.service.security.JwtUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    // Custom JWT based security filter
    @Autowired
    JwtAuthorizationTokenFilter authenticationTokenFilter;

    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.route.authentication.path}")
    private String authenticationPath;
    @Value("${sei.testMode:false}")
    private Boolean isTestMode;
    @Value("${sei.control.permitAnyURL:false}")
    private Boolean isPermitAnyURL;


    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(jwtUserDetailsService)
                .passwordEncoder(passwordEncoderBean());
    }

    @Bean
    public PasswordEncoder passwordEncoderBean() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }


    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        //从中间拆分解开　middleRegistry；
        //<HttpSecurity>范型 必须加上，否则底下使用的第三个地方可能编译报错。
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry    middleRegistry;
        // we don't need CSRF because our token is invulnerable
        middleRegistry =httpSecurity.csrf().disable()
                .cors().and()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                // don't create session 无状态的，不需要服务器来维持会话数据。
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests();

        if(isPermitAnyURL) {
            //测试等场合，放开接入控制的。
            middleRegistry = middleRegistry.antMatchers("/**").permitAll();
        }else {
            middleRegistry =middleRegistry.antMatchers("/graphql/**").permitAll()
                            .antMatchers("/forbidden").denyAll();
        }

        middleRegistry.anyRequest().authenticated();

        //控制要不要验证权限。
        //支持访问http://localhost:8083/voyager 这里并不需要添加路径啊？

        //httpSecurity.addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
        httpSecurity.addFilterAfter(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
        // disable page caching
        httpSecurity
                .headers()
                .frameOptions().sameOrigin()  // required to set for H2 else H2 Console will be blank.
                .cacheControl();
    }


    //静态的文件内容-可以允许那些非授权=没token访问的内容；
    @Override
    public void configure(WebSecurity web) throws Exception {
        // AuthenticationTokenFilter 不过滤的内容-文件; Spring Security要忽略的部分;
        web.ignoring()
            .antMatchers(
                    HttpMethod.POST,
                    authenticationPath
            );   //REST方式的登录，我这里没用它

        //非生产的和系统调试用的。 正式生产环境配置=false;
        if(isTestMode) {
            web.ignoring().antMatchers(
                    HttpMethod.POST,
                    "/graphiql/*"
            ).and()
                    .ignoring()
                    .antMatchers(
                            HttpMethod.GET,
                            "/teacher/*", "/graphiql", "/test/*", "/vendor/*"
                    );
        }

    }

}


//graphiQL+新特性voyager 引入的 vendor路径；

