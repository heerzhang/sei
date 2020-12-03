# Julienne

<div align="center">
  <a href="https://julienne.app">
    <img
    max-width="600px"
    alt="Julienne screenshot showing a list of recipes on the left, and a recipe on the right."
     src="https://raw.githubusercontent.com/bmcmahen/julienne/master/julienne.jpg">
  </a>
</div>
<br />

Julienne is a web app that allows you to share recipes with family and friends.

It's built using the [Sancho-UI](https://github.com/bmcmahen/sancho) design system, Firebase, Typescript, React and Emotion.

[Try it out here](https://julienne.app/).

## How this code works

I'm writing a series of blog posts explaining the code that goes into this project. I'll be adding them here and on my blog when time permits.

**1. [Introducing Sancho UI](https://benmcmahen.com/introducing-sancho/)**

**2. [Using Firebase with React Hooks](https://benmcmahen.com/using-firebase-with-react-hooks/)**

**3. [Building React Components with Gesture Support](https://benmcmahen.com/building-react-components-with-gesture-support/)**

**4. [A Beginner's Guide to using Typescript with React](https://benmcmahen.com/beginners-guide-to-typescript-with-react/)**

## Running locally

This project is built using `create-react-app`, typescript, and firebase. To get it running properly, you'll need to create your own firebase application and export your firebase configuration in a file at `src/firebase-config.ts`. The config should include algolia configuration, and look something like this:

```js
// src/firebase-config.ts
const config = {
  apiKey: "myapikey",
  authDomain: "my-auth-domain.firebaseapp.com",
  databaseURL: "my-db-url.com",
  projectId: "my-pid",
  storageBucket: "my-storage-bucket",
  messagingSenderId: "my-sender-id",
  ALGOLIA_APP_ID: "my-app-id",
  ALGOLIA_USER_SEARCH_KEY: "my-user-search-key"
};

export default config;
```

You'll also need to install the local dependencies using Yarn or NPM.

```
yarn
```

You'll need to either deploy the functions or emulate them locally. Finally, you can run it:

```
yarn start
```

This runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deploying

Use firebase-cli to initalize a project in the root directory. Then build your project and deploy.

```
yarn run build
firebase deploy
```
## 性能测试 cssInJs | Html 结果
			emotion		
				文本=0.5s(点下拉) ； 直接<H6>要=1.8s(点下拉)；      原生react=3.7s;(点下拉)
				emotion基础=10.3s；		    	 emotion的Text组件=10.6s；
			styled-components	
				文本=2.3s(刷页面) ； 直接<H6>要=4.3s(刷页面) ；     原生react=6.1s;(刷页面)
				styled-components基础=9.6s；	     styled-components的Text组件=14.6s；
			emotion	
				多组件 50000个 *2 			=全14.4s；
				少组件 500个*200 			=全1.8s；
			styled-components
				多组件 50000个 *2 			=全16.8s；	
				少组件 500个*200 			=全3.2s；

## License

网页POST https://hanyeyinyong2.123nat.com:8673/graphql net::ERR_CERT_COMMON_NAME_INVALID 域名服务提供商有问题。
https://hanyeyinyong2.123nat.com:3765/chaipu/3 用到浏览器LocalStorage, 要清理 若URL修改了域名IP;
POST https://192.168.1.105:8673/graphql net::ERR_CERT_AUTHORITY_INVALID 后端证书域名还没认证合格。
Algoliasearch是收费云服务，Elasticsearch是自建集群,功能一样。
<IconButton component={RouterLink} 报错，应该改<RouterLink><IconButton noBind写法。
图标库icons; https://sancho-ui.com/components/icon/
列表查询3类接口：搜索，精确搜索，查找。1搜索=ES中用match_phrase，2精确搜索=ES中用wildcard，3查找=数据库DB中Like查询。
使用React动画库——react-spring ; https://www.jianshu.com/p/87d0decc9c16?utm_campaign=haruki
/** @jsx jsx */ 告诉babel替换React.createElement为注入的jsx函数，import { css, jsx } from '@emotion/react'
CommonJS和AMD/CMD是遗留UMD旧综合。ESM是js官方标准取代UMD；Tree-shaking 副作用。https://blog.csdn.net/frontend_frank/article/details/104386097

