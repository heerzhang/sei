import * as React from "react";

//使用，页面切换会定时器执行报错unmount。
export function useThrottle222(fn, delay) {
  let timeoutId;
  const accumulator = [];
  const doFunc =(...args) => new Promise(resolve => {
    clearTimeout(timeoutId)

    accumulator.push(() => resolve({ hasResolved: false }))

    const execute = () => Promise.resolve(fn(...args))
      .then(value => {
        accumulator.pop()
        accumulator.forEach(fn => fn())
        accumulator.length = 0
        resolve({ hasResolved: true, value })
      })

    timeoutId = setTimeout(execute, delay)
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);
  return [doFunc, timeoutId];
}

//export function useThrottle(fn: Function, timeout: number = 1000) {

export function useThrottle333(fn, timeout) {
  const [ready, setReady] = React.useState(true);
  const timerRef = React.useRef(null);
/*
  if (!fn || typeof fn !== "function") {
    throw new Error(
      "As a first argument, you need to pass a function to useThrottle hook."
    );
  }
*/
  const throttledFn = React.useCallback(
    (...args) => {
      if(ready) {
        setReady(false);
        fn(...args);
      }
    },
    [ready, fn]
  );

  React.useEffect(() => {
    if (!ready) {
      timerRef.current = setTimeout(() => {
        setReady(true);
      }, timeout);
      return () => clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);

  return [ready, throttledFn];
}

//"throttle-asynchronous": "^1.1.1",
//防抖功能，参考看了 "@rooks/use-throttle":"^3.6.0",
//防止频繁去按 按钮！3000毫秒。　　fn　参数书写时不要加()的。
export function useThrottle(fn: Function, timeout: number = 3000) {
  //要把按钮使能开关ready一起做上。
  const [ready, setReady] = React.useState(true);
  const timerRef = React.useRef(null);
  const doFunc = React.useCallback(
    (...args) => {
      if(ready) {
        setReady(false);
        fn(...args);
      }
    },
    [ready, fn]
  );

  React.useEffect(() => {
    if (!ready) {
      timerRef.current = setTimeout(() => {
        setReady(true);
      }, timeout);
      //重要的，否则经常报错Can't perform a React state update on an unmounted。卸载了必须清理回调任务。
      return () => clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);
  if (!fn || typeof fn !== "function")
          return {doFunc: void 0, ready};
  ///return [ready, throttledFn]; 数组的版本编译器容易报错！改成返回对象的搞。
  return {doFunc, ready};
}



