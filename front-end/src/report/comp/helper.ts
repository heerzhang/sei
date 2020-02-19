//import * as React from "react";

//通用处理函数。


//单个项目整体检验结论；没输入的也算不合格， 但是：无此项／如都是／合并也是／。多个小项统筹判定。
export const aItemTransform = (orc: any, iClass:string,  ...ns) => {
  let size=ns.length;
  let amazing=[];
  let fdesc='';
  if(size<1)  throw new Error(`没项目参数`);
  let result='合格';
  let i=0;
  for(; i<size; i++){
    if(!orc[ns[i]] || orc[ns[i]]==='' || orc[ns[i]]==='△'){
      amazing[i]='未检测';
      if(result!=='不合格')  result='不合格';
    }
    else if(orc[ns[i]]==='×'){
      amazing[i]='不符合';
      if(result!=='不合格')  result='不合格';
    }
    else if(orc[ns[i]]==='√'){
      amazing[i]='符合';
    }
    else if(orc[ns[i]]==='／'){
      amazing[i]='／';
      if(result!=='不合格' && result!=='／')   result='／';
    }
    else if(orc[ns[i]]==='▽'){
      amazing[i]='资料确认符合';
    }
    else
      throw new Error(`非法结果${orc[ns[i]]}`);
    if(orc[ns[i]]==='×' || orc[ns[i]]==='△'){
      let objKey = ns[i]+'_D';
      if(orc[objKey])
        fdesc += orc[objKey] +'; ';
    }
  }
  if(result==='／'){
    for(i=0; i<size; i++){
      if(orc[ns[i]]==='√')   result='合格';
    }
  }
  return {...amazing, result, iClass, fdesc};
}

//仪器表：临时的显示表生成;一行2列并排风格的。
export const getInstrument2xColumn = (instbl: [any]) => {
  let newT=[];
  if(!instbl)  return newT;
  let size=instbl.length;
  let lines=size/2, i=0;
  if(lines===0)  newT[0]={s1:'', name1:'', no1:'', s2:'', name2:'', no2:''};
  for(; i<lines; i++){
    if(2*i+2 <= size)
      newT[i]={s1:2*i+1, name1:instbl[2*i].name, no1:instbl[2*i].no, s2:2*(i+1), name2:instbl[2*i+1].name, no2:instbl[2*i+1].no};
    else
      newT[i]={s1:2*i+1, name1:instbl[2*i].name, no1:instbl[2*i].no, s2:'', name2:'', no2:''};
  }
  return newT;
}

//把原始记录的数据转换成报告的各个项目的结论。测量字段项目级别B以上的测量数才需要显示。
export const itemResultTransform =(orc: any, inspectionContent, 特殊替换
) => {
  let out={};
  inspectionContent.forEach((rowBigItem, x) => {
    rowBigItem && rowBigItem.items.forEach((item, y)=> {
      if(item)   out[`${x+1}.${y+1}`] =aItemTransform(orc, item.iClass,  ...item.names);
    });
  });
  let failure=[];
  for(let key  in out){
    if(out[key].result==='不合格')  failure.push(key);
  }
  特殊替换(orc, out);
  return {...out, failure};
}

//console.log("特殊替换-  -out=",out);

