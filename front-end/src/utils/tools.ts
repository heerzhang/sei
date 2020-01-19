import { Ref,  } from "react";


//把子组件的输入全部合并，准备好数据给后端。 inp参数固定。
export const mergeSubitemRefs = <T>(...refs: Array<Ref<T>>) => {
  let all={};
  refs.forEach(resolvableRef => {
    if ((resolvableRef as any).current) {
      all = {...all,   ...(resolvableRef as any).current.inp };
    }
  });
  return all;
};


//执行回调 所有项目 都显示的。

export const callSubitemShow = <T>(show:boolean, ...refs: Array<Ref<T>>) => {
  refs.forEach(resolvableRef => {
    if ((resolvableRef as any).current) {
     // console.log("callSubitemShow 执行 ", (resolvableRef as any).current!.onParChange, "itemVal?=",  (resolvableRef as any).current!.itemVal );
      (resolvableRef as any).current!.setShow(show);
    }
  });
};

/*
const callSubitemShow =<MutableRefObject<InternalItemHandResult>> (...refs: Array<Ref<MutableRefObject<InternalItemHandResult>>) => {
  refs.forEach(resolvableRef => {
    if ((resolvableRef as any).current) {
      (resolvableRef).current.setShow();
    }
  });
};
*/

export const callSubitemChangePar= <T>(par:any, ...refs: Array<Ref<T>>) => {
  refs.forEach(resolvableRef => {
    if ((resolvableRef as any).current) {
      //console.log("callSubitemChangePar 执行 ", (resolvableRef as any).current!.onParChange, "itemVal?=",  (resolvableRef as any).current!.itemVal );
      (resolvableRef as any).current!.onParChange(par);
    }
  });
};

//每个分区项目的保存处理前准备，作一次render;
export const callSubitemOnSave= <T>(outp:any, ...refs: Array<Ref<T>>) => {
  refs.forEach(resolvableRef => {
    if ((resolvableRef as any).current) {
      //console.log("callSubitemChangePar 执行 ", (resolvableRef as any).current!.onParChange, "itemVal?=",  (resolvableRef as any).current!.itemVal );
      (resolvableRef as any).current!.onSave(outp);
    }
  });
};

