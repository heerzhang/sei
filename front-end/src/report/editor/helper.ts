import * as React from "react";

//通用处理函数。


export function createItem(itemArea: string, zoneContent: React.ReactNode) {
  return {itemArea,  zoneContent};
}
//通用的检验项目模板配置格式的：
export function getInspectionItemsLength(inspectionContent){
  let seq = 0;
  inspectionContent.forEach((rowBigItem, x) => {
    rowBigItem && rowBigItem.items.forEach((item, y) => {
      if(item)   seq += 1;
    });
  });
  return seq;
};
//校验URL的action字段能否匹配项目编号? 2.4。
export function verifyAction( action:  string, generalFormat: any[]) {
  let itemNums=action.split(".");
  if(itemNums.length!==2)   return {isItemNo: false};
  let x=parseInt(itemNums[0]);
  let y=parseInt(itemNums[1]);
  if(generalFormat[x-1]?.items[y-1]?.procedure)
    return {isItemNo:true, x:x-1, y:y-1};
  else
    return {isItemNo: false};
}



