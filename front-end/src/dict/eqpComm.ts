import { useContext, useState } from "react";
//密码hash 防止在服务后台泄密
var sha256 = require('hash.js/lib/hash/sha/256');

export const useSession = () => {
  const { user, loading } = useContext(null);
  return  { user, loading };
};


//标识符不能以数字开头的，中文却可以的，数字开头的Key就必须用""包裹了。

export const 设备种类 =[
  {
    type: "3",
    desc: "电梯"
  },
  {
    type: "2",
    desc: "压力容器"
  },
  {
    type: "R",
    desc: "常压容器"
  }
];

export const 设备类别 ={
  "3": [
    {
      sort: "31",
      desc: "曳引与强制驱动电梯",
    },
    {
      sort: "32",
      desc: "液压驱动电梯"
    }
  ]
}


export const 设备品种 ={
  "31": [
    {
      vart: "311",
      desc: "曳引驱动乘客电梯"
    },
    {
      vart: "312",
      desc: "曳引驱动载货电梯"
    },
    {
      vart: "313",
      desc: "强制驱动载货电梯"
    },
  ]

}

