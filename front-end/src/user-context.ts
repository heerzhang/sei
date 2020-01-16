import * as React from "react";

interface UserContext {
  user?: any;
  //user?: firebase.User;  云服务
  loading?: boolean
}

export const userContext = React.createContext<UserContext>({
  user: undefined,
  loading: undefined
});


/*
CSS屏幕判定选择case用例：
		[""]: 缺省值，小屏幕，所有的手机屏幕。
		[theme.mediaQueries.md]: 正常PAD屏，打印机用的输出，折叠屏幕展开后的，超大的横屏模式手机。
		[theme.mediaQueries.xl]: 电脑屏。
*/

