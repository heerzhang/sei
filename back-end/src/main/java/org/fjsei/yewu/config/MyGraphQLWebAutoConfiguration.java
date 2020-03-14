package org.fjsei.yewu.config;

import com.coxautodev.graphql.tools.SchemaParser;
import graphql.language.*;
import graphql.schema.GraphQLFieldDefinition;
import graphql.schema.GraphQLFieldsContainer;
import graphql.schema.GraphQLSchema;
import graphql.schema.visibility.DefaultGraphqlFieldVisibility;
import graphql.schema.visibility.GraphqlFieldVisibility;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

//核心安全配置代码！！　特特别提醒，　若graphql协议接口不做安全配置就非常不安全了。
//配置文件sei.control.permitAnyURL=true那么不登录REST能随意访问，但是graphQL没变，graphQL的URL始终都允许，可是卡在字段/接口权限过滤。
//第一道门是JWT认证，graphql 的authenticate　auth认证，随后才能使用，REST也会被这道门拦截。
//没有登录就用的，只有　auth　authenticate　等极少数注册的接口才不会爆出异常；其他的:{permitAnyURL=false} REST报401;而graphQL就报非法字段或方法。

//import static　使用：可参考graphql.schema.visibility.NoIntrospectionGraphqlFieldVisibility
/**
 * 尝试定制 注入自己的控制方法
 */

@Configuration
@ConditionalOnClass(SchemaParser.class)
public class MyGraphQLWebAutoConfiguration {
    //注入application.yml配置
    @Value("${sei.visibility.role:}")
    private   String visibilityDefaultRole="";      //不能用final来修饰？

    /*
    @Autowired
    private GraphQLSchemaProvider graphQLSchemaProvider;

    @Bean
    public GraphQLSchemaProvider graphQLSchemaProvider(GraphQLSchema schema) {
        return new DefaultGraphQLSchemaProvider(schema);
    }
    */

    //因新版graphl-java-tools需要依赖高版本kotlin.version=1.3.10 ,特别添加了文件gradle.properties，
    //否则运行到这前报错NoClassDefFoundError:./ContinuationInterceptor


    //接替原来固有的。
    //下面不能加@ConditionalOnMissingBean(GraphQLSchemaProvider.class)　　@ConditionalOnBean(SchemaParser.class)
    @Bean
    public GraphQLSchema graphQLSchema(SchemaParser schemaParser) {
        //这个函数入口时刻schemaParser就已经把所有模型文件加载完了。
//Failed to instantiate [com.coxautodev.graphql.tools.SchemaParser]:
        //java.lang.NoClassDefFoundError: kotlin/coroutines/ContinuationInterceptor

        /* 这个模式也只能匹配两层, Model.property过滤服务端不返回数据。
        GraphqlFieldVisibility blockedFields = BlockedFields.newBlock()
                .addPattern("Authority.name").addPattern(".*\\.hero").build();
        */
        GraphQLSchema   schema=schemaParser.makeExecutableSchema();
        //lambda匿名函数
        Consumer<GraphQLSchema.Builder> builderConsumer = builder -> builder.fieldVisibility(myGraphqlFieldVisibility());
        GraphQLSchema   schemaMy= schema.transform(builderConsumer);
        //这段代码只有一次机会执行的。
        return schemaMy;
        //这里之后为何GraphQLSchemaProvider的@bean还会执行呢？
    }

    //从*.graphqls文件注入角色权限控制机制，给外模型字段添加内省安全能力。
    //安全过滤自定义 directive @authr，因为角色权限而屏蔽给前端看的外模型的字段，返回null,考虑缺省角色以及可能特殊情况的字段。
    //这个是针对接口函数的一次性过滤字段，而不能针对单条数据记录来做细分上的过滤,不会因每一条数据记录都运行到这里。
    public GraphqlFieldVisibility myGraphqlFieldVisibility() {
        return new DefaultGraphqlFieldVisibility() {
            @Override
            public List<GraphQLFieldDefinition> getFieldDefinitions(GraphQLFieldsContainer fieldsContainer) {
                //graphiQL的刷新时执行这里，获取每个模型对象的详细字段列表;　一般函数不会执行到这;
                return fieldsContainer.getFieldDefinitions();
            }

            @Override
            public GraphQLFieldDefinition getFieldDefinition(GraphQLFieldsContainer fieldsContainer, String fieldName) {
             //执行到这时，还处于parseAndValidate堆栈，还没有获取数据呢，无法区分id。　多次调用最后ExecutionStrategy回已经取了子对象authorities数据没有User数据
                Authentication auth= SecurityContextHolder.getContext().getAuthentication();    //当前用户是?
                Set<SimpleGrantedAuthority> requireRoles= new HashSet<SimpleGrantedAuthority>();
                GraphQLFieldDefinition field =fieldsContainer.getFieldDefinition(fieldName);
                if(field!=null) {
                    FieldDefinition definition = field.getDefinition();     //服务端定义文件的内容
                    //从graphiQL特殊query IntrospectionQuery{ __schema {queryType { name } 会导致definition空;
                    if(definition!=null) {
                        List<Directive> directives = definition.getDirectives();
                        directives.stream().forEach(item -> {
                            if (item.getName().equals("authr")) { //自定义访问字段的角色要求，qx参数，角色没有绝对高低的线性关系。
                                Argument argument = item.getArgument("qx");
                                List<StringValue> roles = argument.getValue().getChildren();
                                roles.stream().forEach(role -> {
                                    requireRoles.add(new SimpleGrantedAuthority("ROLE_" + role.getValue()));    //该字段所要求的角色之一{最少满足一个吧}
                                    //authr没有明确指出的其他字段采用缺省角色要求。
                                });
                            }
                        });
                    }
                }
                int fieldRolesCount=requireRoles.size();    //配置文件配好的角色个数
                if(fieldRolesCount==0) {
                    if(visibilityDefaultRole.length()>0)
                        requireRoles.add(new SimpleGrantedAuthority("ROLE_"+visibilityDefaultRole));    //缺省机制
                }

                boolean isItVisible=true;   //检查看外模型字段或接口方法的可见性/可使用吗。
                if(requireRoles.size()>0) {
                    if(auth!=null)
                        requireRoles.retainAll(auth.getAuthorities());    //集合取交集的，剔除不在后面权限集合里面的。
                    else{   //未登录的 或正在注销退出
                        if(visibilityDefaultRole.length()>0)
                            isItVisible = false;
                    }
                }

                if(visibilityDefaultRole.length()>0) {
                    if (requireRoles.size() == 0)       //剩下是当前用户能匹配到的权限
                        isItVisible = false;      //不让看了
                    //添加特殊情况入口处理。没有登录就用的，极少数注册的接口。不经过JWT cockie授权也可访问。
                    if(!isItVisible){
                        if(fieldsContainer.getName().equals("Query")) {
                            if(fieldName.equals("auth") )
                                isItVisible=true;
                        }
                        else if(fieldsContainer.getName().equals("Mutation")) {
                            if(fieldName.equals("authenticate") || fieldName.equals("logout") || fieldName.equals("newUser"))
                                isItVisible=true;
                        }
                    }
                }else{      //没有配置字段域或接口缺省角色(多属于测试情形的) ，没登录的带ROLE_ANONYMOUS
                    if (requireRoles.size() == 0  && fieldRolesCount>0)
                        isItVisible = false;
                    //配置文件里visibility.role: =空的+ @authr(qx没注解；==危险咯，这条情景竟可以随意访问了。
                    //这里可添加特殊情况的处理。
                }
                //该地执行非常密集，每一个字段都会来这里。
                if(isItVisible)
                    return fieldsContainer.getFieldDefinition(fieldName);   //正常的授权获取的字段可显示。
                else
                    return null;    //因为查了没有权限的字段，会导致整个查询都失败的，前端没有取得半点数据了。
                //throw new BookNotFoundException("没有权限"+fieldsContainer.getName()+"//"+fieldName,(long)0); 这样导致前端没提示的；
            }

        };
    }
}



/* 自定义的语法　(外模型文件里面的)
directive @authr(　qx: [String] = ["USER"]　) on FIELD_DEFINITION
*/
//执行策略ExecutionStrategy ：异步/批量/深度广度优先/为外模型的具体字段适配DataFetcher()。
