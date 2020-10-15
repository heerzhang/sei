import { useEffect, useRef ,useState } from 'react';

//判定组件挂载状态
export  function useIsComponentMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false;
  }, []);
  return isMounted;
};

//如果setXxx需要在组件可能已经被卸载unmount情形去执行的场景。
//替换useState来使用，首先要判定组件挂载
export default function useStateIfMounted (initialValue) {
  const isComponentMounted = useIsComponentMounted();
  const [state, setState] = useState(initialValue);
  function newSetState(value) {
    if (isComponentMounted.current) {
      setState(value);
    }
  }
  //数据形式，顺序才是关键，使用者可以随意改变量名称。
  return [state, newSetState]
}


