http://localhost:8083/voyager 可以察看整个模型关系图 http://27.151.117.65:8673/voyager。
启动  nohup java  -Xms512m -Xmx4096m -Xmn32m -Xss16m  Test.jar --server.port=8080 >test.log 2>&1 &
graphQL的输入输出的参数类型完全不能互用，type做输出，input做输入，无法共享类型。
Boot其它配置  https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
服务器端：graphql-yoga正崛起{based on apollo-server}。 https://www.jianshu.com/p/46b80e4974a1?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
graphQL 基本类型 =标量 ID，Float Boolean Int String BigDecimal  BigInteger Byte Char Short Long。就没日期，枚举型单独定义。
？复杂查询，模型数量大，对象关系复杂，复杂性指数级增长。图、边、节点？和传统查询SQL在考虑视点完全不同。
GraphQL高效结构化系统化的 REST替代方案 https://www.oschina.net/translate/what-is-graphql-better-apis-by-design?cmp
awesome-graphql 社区资源  https://github.codefaultQuery.graphqlm/chentsulin/awesome-graphql
graphql.relay这个包内容：连接=边集+分页，边=节点{图->某字段}+游标; 除了relay核心库其它地方没有page功能。https://juejin.im/post/5aaba1b86fb9a028cb2d645a
APOLLO 可以替代 Relay 和 Redux；比较了 Apollo 和 Relay ，最终选择了在项目中使用 Apollo；Relay 是由 Facebook开源 GraphQL Client 。
Prisma是一个数据库抽象层，可以将数据库转换为带有CRUD操作和实时功能的GraphQL API，它是数据库和GraphQL服务器之间的粘合剂。https://www.jianshu.com/p/993eba12e9aa
prisma/graphql-yoga 全栈JS的？ https://github.com/prisma/graphql-yoga/tree/master/examples/fullstack
query actorsAfter2009 {
  allActors(   
        filter: {    
          movies_some: {  
            releaseDate_gte: "2009"
          }
        } 
        first: 3  
        orderBy: name_ASC
        ) 
    {  x x x
    }
 }

# graphql-java-spring-boot-example
https://localhost:8673/graphiql

```
{
  findAllBooks {
    id
    isbn
    title
    pageCount
    author {
      firstName
      lastName
    }
  }
}
```

Or:
```
mutation {
  newBook(
    title: "Java: The Complete Reference, Tenth Edition", 
    isbn: "1259589331", 
    author: 1) {
      id title
  }
}
```

# License
{
  findAllAuthors {
    id
		firstName   lastName 
  }
}
 http://localhost:8080/h2-console/login.jsp 
 http://localhost:8080/graphiql 
{
  "data": {
    "findAllBooks": [
      {
        "id": "1",
        "isbn": "0071809252",
        "title": "Java: A Beginner's Guide, Sixth Edition",
        "pageCount": 728,
        "author": {
          "firstName": "Herbert",
          "lastName": "Schildt"
        }
      }
    ]
  }
}

{
  "data": {
    "newBook": {
      "id": "2",
      "title": "Java: The Complete Reference, Tenth Edition"
    }
  }
}
//增加
mutation {
  newAuthor(
    firstName: "J币Edition",lastName:"赫尔学") {
      id
  }
} 
mutation {
  newBook(
    title: "Java: The Complete Reference,的绿币Edition", 
    isbn: "12595AAdfsf89331", 
    author: 1) {
      id title
  }
}
//查询
{
  findAllBooks {
    id
    isbn
    title
    pageCount
    author {
      firstName
      lastName
    }
  }
}

接口 schema 地址：http://localhost:8083/graphql/schema.json
接口请求POST地址： http://localhost:8083/graphql
//查询
{
  findAllJcBooks {
    id
    isbn
    title
  }
}
{
  findAllJcAuthors {
    id
		nickname    
  }
}
{
  countJcBook(author: "33")
}
//增加
mutation {
  newJcAuthor(
    nickname: "J币Edition") {
      id
  }
} 
mutation {
  newJcBook(
    title: "Jce,的绿dition", 
    isbn: "1259", 
    author: 34) {
      isbn 
  }
}

@Getter and @Setter
@FieldNameConstants
@ToString
@EqualsAndHashCode
@AllArgsConstructor, @RequiredArgsConstructor and @NoArgsConstructor
@Log, @Log4j, @Log4j2, @Slf4j, @XSlf4j, @CommonsLog, @JBossLog, @Flogger
@Data
@Builder
@Singular
@Delegate
@Value
@Accessors
@Wither
@SneakyThrows
https://blog.csdn.net/v2sking/article/details/73431364
https://www.cnblogs.com/wucongyun/p/6730582.html
通过查询(JPQL)方式得到的实体对象是不会被放到二级缓存中的。然而在一些JPA实现中也会将查询得到的结果放入到缓存中，但是只有当相同的查询再次被执行时，这些缓存才会起作用，所以即使JPA的实现支持查询缓存，查询返回的实体也不会被存储在二级缓存中
缓存之后，是看不到发出sql语句的,https://blog.csdn.net/qq_20545159/article/details/48547765
监听缓存事件 指定缓存provider 打开查询缓存  打开二级缓存 https://blog.csdn.net/yiduyangyi/article/details/54176453
(HttpServletRequest request,ModelMap model) ModelAndView   https://www.cnblogs.com/liuhongfeng/p/4802013.html
SpringBoot Controller接收参数@CookieValue方式https://blog.csdn.net/qq_31001665/article/details/71075743
springboot返回json总结两个简单方法 https://blog.csdn.net/qq_31293575/article/details/80653779
Springboot自定义Json注解过滤属性Jersey是一个REST  https://www.jianshu.com/p/a7ec42b84277
JPA 注解方式自定义ID生成器 https://blog.csdn.net/u014042146/article/details/52595624
Content-Type application/json; charset=utf-8
--------[脱离iQL界面]------[使用接口]-------
query：查询文档，必填。 POST 报文体中的 JSON 数据中的三个字段跟 GET 请求类似：
variables：变量，选填。
operationName：操作名称，选填，查询文档有多个操作时必填。
{
  "query": "{viewer{name}}",
  "operationName": "",
  "variables": { "name": "value", ... }
}
//ok
GET http://localhost:8083/graphql?query={findAllJcAuthors{id,nickname}}
//ok 直接用REST Client工具窗口做的请求，编码 格式稍微需要转换的。相当于更低底层一个层次；
POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "{findAllJcAuthors{id,nickname}}",
  "operationName": ""
}
//ok

POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "{countJcBook(author:1)}"
}
//OK OK！ ！
POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "mutation{newJcAuthor(nickname:\"hrhrh2币Eon002\"){id}}"
}
//OK
POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "mutation{newJcBook(title:\"0Jce44的绿diti440\",isbn: \"124459441\",author: 4){isbn}}"
}
//OK
POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "{findAllJcBooks{ id,isbn,title,author {id,nickname} } }"
}
//OK
POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{
  "query": "mutation{newJcBook(title:\"javaguidever002\",isbn:\"124459449\",author:\"4\"){isbn}}"
}

自定义类型 scalar 枚举类型（Enumeration Types） https://segmentfault.com/a/1190000014613856?utm_source=index-hottest
{
  countTask(dep:"福州二部",status:"0") 
}
／／ｏｋ
{
   findAllPositions {
     id,
     address,
     building
   }
 }
mutation {
  newPosition(
    address: "Jcdid的绿diti街道北路", 
    area: "350001", 
    building: "晋安区三大城",
    lng: "11.2345235234206"
    lat: "132.564564564501") {
      id 
      address
  }
}
{
  "query": "{findAllPositions{id,address,building} }"
}
//No ok
{
  "query": "{findAllPositions{id,address,building,eqps{id} } }"
}
／／ok
mutation {
  newUser(
    name: "陈商代", dep:"福州二部"
    ) {
      id 
  }
}
//ｏｋ
{
  findAllUsers
     {
      id,name
  }
}
//ok
{
  findAllEQPs {
    id,
    type,
    cod,
    oid,
    pos {
  	  id,
   	 address,
      lng,
      lat
    }
  }
}
//ok, HTTP POST 的测试方式:
{
  "query": "mutation{newEQP(cod:\"3501T8342\",type: \"4000\",oid:\"03536it440\"){id,cod}}"
}
{
  findAllUnits {
    id,
    name,
    address,
		owns
     {
  	  id,
			cod
    }
  }
}
mutation {
  newUnit(
    address: "Jcdid的绿diti街道北路", 
    name: "石玫瑰供水公司", 
		) {
      id 
      address
  }
}
//API接口： 400错误
{
  "query": "{findAllUnits{ id,name,address,owns {id,cod} } }"
}
//OK
mutation {
  setEQPPosUnit(
    id: 84
    pos: 81 
    owner:82
    maint:83
		) {
      id 
      cod
    }
}
//ok
{
  countISP(ispMen:12) 
}
//OK
mutation {
  newTask(
    devs: 84
		) {
      id 
      status
    devs{
      cod
      pos{
        address
      }
    }
    }
}
//ok
mutation {
  addDeviceToTask(
    task: 13, 
    dev: 8, 
		) {
      id 
      status
    ,date
  }
}
//OK
mutation {
  dispatchTaskTo(
    id: 13, 
    status:"1", dep:"福州二部", 
    date: "2018-07-08", 
		) {
      id 
      status
    ,date
  }
}
{
  countTask(dep:"福州二部",status:"1") 
}
//OK
mutation {
  newISP(
    dev: 84, 
		) {
      id,
    dev{cod, pos{building} }
      ispMen{name}
    ,conclusion
  }
}
mutation {
  newReport(
    isp: 85, type:"无机房拽",no:"FZ2018DT0032"
		) {
      id,
    isp{id, ispMen{username} ,nextIspDate}
 	 }
}
//OK
mutation {
   setISPispMen(
     id: 85 
     users: [12, 13,75] 
 		) 
    {
       id, dev{cod, pos{building} }, ispMen{name},conclusion
    }
 }
mutation {
  setISPtask(
    id: 85,
    task:76
		) {
      id,
    dev{cod, pos{building} }
      ispMen{name}
    ,conclusion
  }
}
//ok
{
  findAllReports {
    id, type,no
  }
}
mutation {
  setISPreport(
    id:14 
    reps: [15, 16] 
		) 
   {
      id, dev{cod, pos{building} }, ispMen{name},conclusion
   }
}
====GraphiQL特别例子==
{
  findAllTasks {
    id,
    isps{ id,ispMen{id,name,dep} },
    status,date,dep,fee,
 		devs{
 		  id,type,cod,oid,ownerUnt{id,name,address},
      pos{id,address,lng,lat,building},instDate,maintUnt{id,name},
      factoryNo,isps{id,conclusion,reps{id,type,path,upLoadDate}}
 		}
  }
}
----输出----
{
  "data": {
    "findAllTasks": [
      {
        "id": "13",
        "isps": [
          {
            "id": "14",
            "ispMen": [
              {
                "id": "13",
                "name": "王部分B",
                "dep": "机电中心"
              },
              {
                "id": "12",
                "name": "刘衬衫",
                "dep": "机电中心"
              }
            ]
          }
        ],
        "status": "1",
        "date": "2018-07-08 00:00:00.0",
        "dep": "福州二部",
        "fee": null,
        "devs": [
          {
            "id": "1",
            "type": "3000",
            "cod": "23432423",
            "oid": "555666777",
            "ownerUnt": null,
            "pos": {
              "id": "2",
              "address": "Jcdid的绿diti街道北路",
              "lng": "11.2345235234206",
              "lat": "132.564564564501",
              "building": "晋安区三大城"
            },
            "instDate": "2016-06-04 22:15:29.05",
            "maintUnt": null,
            "factoryNo": "5555511",
            "isps": []
          },
          {
            "id": "8",
            "type": "4000",
            "cod": "3501T8342",
            "oid": "03536it440",
            "ownerUnt": {
              "id": "10",
              "name": "石玫瑰供水公司",
              "address": "Jcdid的绿diti街道北路"
            },
            "pos": {
              "id": "2",
              "address": "Jcdid的绿diti街道北路",
              "lng": "11.2345235234206",
              "lat": "132.564564564501",
              "building": "晋安区三大城"
            },
            "instDate": null,
            "maintUnt": {
              "id": "11",
              "name": "维保342公司"
            },
            "factoryNo": null,
            "isps": [
              {
                "id": "14",
                "conclusion": null,
                "reps": [
                  {
                    "id": "15",
                    "type": "无机房拽",
                    "path": null,
                    "upLoadDate": null
                  },
                  {
                    "id": "16",
                    "type": "无机房拽",
                    "path": null,
                    "upLoadDate": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

POST http://localhost:8083/graphql
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache

{  "operationName": "SIGNIN_MUTATION",
    "variables": {"username": "herzhang",  "password": "123456" },
    "query": "mutation SIGNIN_MUTATION($username: String!, $password: String!) {\n  authenticate(username: $username, password: $password) {\n    id\n   username\n    __typename\n  }\n}\n"
}
mutation {
  logout 
}
graphQL升级版,关于 Relay 支持: https://github.com/graphql-java/graphql-java
//基本类型Built-in GraphQL::ScalarType有5种 String Int  ID  Boolean Float {精度小数点后5位}，注意就是没有Date的，没Double，没Long；

支持 当中嵌套的参数？ 属性字段变成 ID函数()缺省无需参数；
query COMMUNITY_NAME_QUERY($id: ID!) 
{
  findAllBaseReports{
     no type id upLoadDate
    isp(id:$id)
    {
      ispMen{username authorities{name}}
       id dev{ cod task{dep date} }
     }
    __typename
  }
}
在graphiQL输入的参数，json的字段必须带"""
{
  "id": "534531"
}
分页JPA  https://www.cnblogs.com/hdwang/p/7843405.html =法四（Specification toPredicate CriteriaBuilder）;
JPA核心找到：JpaCountQueryCreator， JpaQueryCreator={CriteriaBuilder｛and+各类条件｝+JpaParameters}；
介绍apollo分页offset,cursor,edges有3种模式： https://www.apollographql.com/docs/react/features/pagination.html

注入器中所有使用原始ResourceHttpRequestHandler的地方  https://fableking.iteye.com/blog/1631806；
 spring4.1.8扩展实战之五：改变bean的定义 https://blog.csdn.net/boling_cavalry/article/details/82083889
SpringBoot中用Fastjson替换默认的Jackson  http://www.bubuko.com/infodetail-2592064.html
query {
  __type(name:"BaseReport") {
    name
    fields {
      name
      type {
        name
      }
    }
  }
}
Interface,Union可以作为object的字段类型;  多接口type Business implements NamedEntity & ValuedEntity {}
内省Introspection机制， https://blog.csdn.net/kikajack/article/details/79098049
@include(if: $includeFriends) Directive   https://ithelp.ithome.com.tw/articles/10206667?sc=pt
语法标准：https://facebook.github.io/graphql/June2018/#sec-Interfaces
深入@Batched批量化执行器　　https://www.jianshu.com/p/00a542001a3a
针对Introspection内省功能太过强大，推行强化安全机制措施：
1,直接在JPA实体的getXXX里头限制，比如getAuthorities，缺点是打乱了POJO本来应该的用途，后端其他逻辑获取数据需要额外造个帮助函数来搞。
2，用LAZY异常切断内省查询链条，这条已作废，全局性保持session支持Lazy了； 单向关联关系缺点是该属性字段从代码不能直接利用，必须从反向关系依据id倒着查。
3, 使用graphQL语法interface；可修饰单个查询与单个修改接口函数的输出Type，从而约束前端访问保密字段，缺点是管制力度较弱，还徒增了接口函数个数。
4, 同样使用interface，对外模型定义的字段直接修饰成安全类型，前端能看见的关联模型被限制掉部分属性；想查保密信息需找另搞一个实体字段get函数做，缺点是破坏代码易维护性，前端查保密信息得用特别函数。
5，自定义directive @authr；在*.graphqls文件中规定好某些字段需要更高权限角色才能做内省查询；没注解的走缺省机制{缺省ROLE_USER}。缺点是只能按角色对外模型的过滤可看字段或可调用的函数接口，而不能针对单条数据记录来做细分上的过滤，外模型配置文件可变性很大。
6, @PostAuthorize对实体类不起作用，而对行动类有效,可以直接使用它注解查询与修改各个函数接口权限，在源代码中做了代替配置文件的@authr。缺点是对Introspection管不住，管制力较弱。
7,在*.graphqls模型添加给前端用的新字段(不同名字)，自定义函数里添加各种复杂的过滤条件避免内省信息泄露，被顶替的实体字段可添加角色控制按其他方式去解决,Entity字段要给后端自己内部用。
 这个模式相当于加了一层对前端或者针对第三方局implements部化接口的适配模型层，而原实体是对内的模型层，给各前端程序看的是外模型是经过严格限制权限的适配层模型定义。
8, 针对可能出现的第三方非完全受控系统使用graphQL协议接入后端服务器的场景，考虑从外模式配置文件入手，大幅度简化模型和接口函数数量和限制给该第三方系统的使用权限。
9, 针对特殊函数接口，如auth:，为免去控制introsepction逻辑麻烦，把函数的输出打包改装成普通的JSON字符串/好像绕回去REST那样的接口。

query COMMUNITY_NAME_QUERY 
{
  findAllBaseReports{
      id  upLoadDate no  isp(id:31){id}
      __typename
  }
}
query COMMUNITY_NAME_QUERY 
{
  findAllEQPs{
      id cod   task{id dep}
   	 isps:meDoIsp{id ispMen{id username} __typename}
      __typename
  }
}
支持SDL配置模式{可ＰＫ方案是写到代码模式}重命名，语法例子：　https://www.graphql-java.com/documentation/master/data-fetching/
    directive @fetch(from : String!) on FIELD_DEFINITION
    type Product {
        description : String @fetch(from:"desc")
    }
跟踪拦截Field Validation Instrumentation　日志执行时间长度或参数验证抛异常　https://www.graphql-java.com/documentation/master/instrumentation/
JS GraphQL控件plugin在后端IDEA不要安装。
复合参数例子 
query qty1($inp: ComplexInput) 
{
    findUserLikeInterface(complex:$inp) {
      id
      username
      authorities{ name }
      dep
    }
}
graphiQL输入参数
{ "inp":  { "username":"herzhang",
      "dev":{"lat":1230765423456192.3456} } 
}    

反射WARNING: Illegal reflective access by com.esotericsoftware.reflectasm.AccessClassLoader：com.esotericsoftware.reflectasm/reflectasm/
ASM使Java程序多一些灵活性和Magic，使用ASM字节码框架实现AOP功能；高效率java反射机制； https://www.cnblogs.com/tohxyblog/p/8661090.html
并不需要“保证”数据一致性的场合，可用redis缓存产品，而严格一致性敏感的场合必须用 数据库 自带的能力。

EntityGraph是和LAZY相反的？，总体写死掉策略搞lazy，动态的个性化查询用EntityGraph来提示{深度定制的,细化,仅针对个别使用到的字段的}，
俩个机制的目标完全冲突。两者目的都是性能；Lazy策略是按需要加载数据但是1+N产生SQL数量多必然影响速度；EntityGraph指示是提醒JPA提前
获取关联集合对象，用1条提前执行的sql来代替随后业务可能遭遇的N条关联sql，而提高性能。
测试query SPEED_GET_DEVS($filter:DeviceCommonInput!,$page:Int!)
  {
      eqps:findAllEQPsFilter(filter:$filter,page:$page){
        oid  task{
          isps{
              id conclusion
          }
      }
    }
  }
graphiQL输入参数
{
  "page": 0,
  "filter": {
    "cod": "L",
    "oid": "1"
  }
}
前端网页Apollo Client{SSR也会}也会缺省地缓存约10分钟时间的对象信息，看到的不是数据库最新的，除非指定即时模式后才可从后端返回最新数据。
悲观锁的实现，往往依靠数据库提供的锁机制 （也只有数据库层提供的锁机制才能真正保证数据访问的排他性，否则，即使在本系统中实现了加锁机制，
    　　也无法保证外部系统不会修改数据）　　　http://outofmemory.cn/sql/optimistic-lock-and-pessimistic-lock
缓存堆外实战，小块内存分配JVM要优；但大块内存分配堆外缓存要优。  https://www.cnblogs.com/scy251147/p/9634766.html

EQP的索引对查询性能影响测试对比结论：  测试说明：
索引和表都是建在USERS表空间内的，两测试字段type和factoryNo都不是unique的,测试用例查询只过滤这2字段,type like? AND factoryNo like?，
   记录总数18万。 type取值重复率很高; factoryNo取值多样性非常大。 
<场景1>：分页查询结果按照factoryNo排序。
    对两字段联合做个(type,factoryNo)索引，对性能也没有提升。
    单做个type索引，对性能没影响。					  
    单做个factoryNo<desc>索引，不会提升性能。
    做了type索引和factoryNo<asc>索引，性能降低，明显变慢！。
    做了type索引和factoryNo<desc>索引，性能没多少变化。
    只有factoryNo<asc>索引而且没有type索引，性能明显，快多了。
    对两字段联合做个(factoryNo,type)索引，性能明显，快多了。
<场景2>：查询结果按type排序。
    只有factoryNo<asc>索引而且没有type索引，没提升性能。
    单做个type<desc>索引，对性能没影响。
    type索引和factoryNo<asc>索引都做了，性能降低，明显变慢！。
    对两字段联合做个(factoryNo,type)索引，不会提升性能。
    对两字段联合做个(type,factoryNo)索引，性能明显，快多了。
    只有type<asc>索引而没有factoryNo索引，性能提升明显，快多了。

JPA中Metamodel持久化属性的接口的层次，Reflection强类型,多值属性　 https://www.cnblogs.com/songyao/p/4139303.html 
REST的输入输出对象模型类不受任何限制关联对象可直接输入，能直接把关联对象全部地序列化或者反序列化；graphQL输入对象必须另外单独建立。
范型错误
expressions.add( cb.<Double>greaterThan( (Expression<Double>) subquery.<Double>getSelection() , new Double(22.3) ) );
编译，范型
Expression<Double>   midlleExp= cb.<Double>greatest(subRoot.<Double>get("numTest"));
subquery.<Double>select( (Expression ) midlleExp);

BI统计模型对象类独立的，前端获取统计对象信息第一步提交预处理请求，后台随后批处理(非内存统计/非页面统计模式)，通知前端用户该信息已经可查看了。
若数据库统计模式例子：select year(AddTime) as '年', SUM(case when MONTH(AddTime)=1 then CardSum else 0 end ) as '一月',
  SUM(case when MONTH(AddTime)=12 then CardSum else 0 end ) as '十二月' from GiftCard	 group by year(AddTime)；    
统计各个单项的数据出处对照性质找出源数据。不同系统用URL指示参数(page就得多开对应某个事物)，POST传对象。统计维度不易变动模式。
cb.substring(itemDate, 1, 4)='2011'； MONTH() function exists in Hibernate HQL but is not a standard JPA function
@Query(value = "SELECT new com.yangnaihua123.domain.vm.StockInDTO(c.supplier, count(c.supplierIndex), year(c.stockInAt), month(c.stockInAt)) from StockIn c WHERE c.supplier <> null group by supplier, year(stockInAt), month(stockInAt)")
例子 https://blog.csdn.net/yangnaihua123/article/details/79212651
Hibernate中HQL函数汇总及其说明			https://blog.csdn.net/chenhuade85/article/details/7572148

SQL之case when then用法    https://www.cnblogs.com/Richardzhu/p/3571670.html
CASE =expitem? 、放在where里条件可以， 放在select可行可以加alias，;  alias实际只用于2地方 order by和having; where里不能用。

