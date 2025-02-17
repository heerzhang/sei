/** @jsxImportSource @emotion/react */
//import { jsx,} from "@emotion/react";
//import * as React from "react";

//方便管理： 目录 分离。组件越来越多，不好查找管理。
//报告项目的主体部分。

//模板的配套正式报告的显示打印； 版本号要相同的。
//下一个版本实际可以和这版本共用大部分配置，可直接引入inspectionContent再做动态修改的方案也可考虑，在差别不大的情况？。版本号启动和消亡？
export const inspectionContent=[
  {
    //bigNo: 1,
    bigLabel:'技术资料',
    splitLine:{'0': 5},
    items:[
      null,null,null,
      {
        //item:1.4,
        label:'使用资料',
        iClass:'B',
        subItems:['(1)使用登记资料','(2)安全技术档案','(3)管理规章制度','(4)日常维护保养合同','(5)特种设备作业人员证'],
        names:['登记资料','安全档案','管理制度','维保合同','作业人员证'],
        addNames:[]
      }
    ]
  },
  {
    //bigNo: 2,
    bigLabel:'机房(机器设备间)及相关设备',
    splitLine:{'0': 10, '10': 10},
    items:[
      {
        //item:2.1,
        label:'通道与通道门',
        iClass:'C',
        subItems:['(1)通道设置','(2)通道照明','(3)通道门'],
        names:['通道设置','通道照明','通道门'],
        addNames:['机房高出','梯子夹角','梯子判定','通道门宽','通道门高','通道判定']
      },
      null,null,null,
      {
        //item:2.5,
        label:'(1)照明、照明开关',
        iClass:'C',
        names:['机房照明'],
        addNames:[]
      },
      {
        //item:2.6,
        label:'(2)主开关与照明等电路的控制关系',
        iClass:'B',
        names:['开关电路关系'],
        addNames:[]
      },
      {
        //item:2.7,
        label:'驱动主机',
        iClass:'B',
        subItems:['(2)工作状况','(3)轮槽磨损','(4)制动器动作情况','★(5)手动紧急操作装置'],
        names:['主机工况','轮槽磨损','制动器','手动紧急操作'],
        addNames:[]
      },
      {
        //item:2.8,
        label:'控制柜、紧急操作和动态测试装置',
        iClass:'B',
        subItems:['(2)断错相保护','(4)紧急电动运行装置','☆(6)层门和轿门旁路装置','☆(7)门回路检测功能','☆(8)制动器故障保护','☆(9)自动救援操作装置'],
        names:['错相保护','紧急电动','门旁路','门回路','制动故障保护','自动救援'],
        addNames:[]
      },
      {
        //item:2.9,
        label:'限速器',
        iClass:'B',
        subItems:['(2)电气安全装置','(3)封记及运转情况','(4)动作速度校验'],
        names:['限速器电安','封记','速度校验'],
        addNames:[]
      },
      {
        //2.10,
        label:'(2)接地连接',
        iClass:'C',
        names:['接地连接'],
        addNames:[]
      },
      {
        //item:2.11,
        label:'电气绝缘',
        iClass:'C',
        names:['绝缘判定'],
        addNames:['动力电阻','照明电阻','安全装置电阻']
      }
    ]
  },
  {
    //bigNo: 3,
    bigLabel:'井道及相关设备',
    splitLine:{'0': 6, '6': 7},
    items:[
      null,null,null,
      {
        //item:3.4,
        label:'井道安全门',
        iClass:'C',
        subItems:['(3)门锁','(4)电气安全装置'],
        names:['安全门门锁','安全门电安'],
        addNames:[]
      },
      {
        //item:3.5,
        label:'井道检修门',
        iClass:'C',
        subItems:['(3)门锁','(4)电气安全装置'],
        names:['检修门门锁','检修门电安'],
        addNames:[]
      },
      null,
      {
        //item:3.7,
        label:'轿厢与井道壁距离',
        iClass:'B',
        names:['轿井距离判定'],
        addNames:['轿井间距']
      },
      null,null,
      {
        //item:3.10,
        label:'极限开关',
        iClass:'B',
        names:['极限开关'],
        addNames:[]
      },
      {
        //item:3.11,
        label:'井道照明',
        iClass:'C',
        names:['井道照明'],
        addNames:[]
      },
      {
        //item:3.12,
        label:'底坑设施与装置',
        iClass:'C',
        subItems:['(1)底坑底部','(3)停止装置'],
        names:['底坑底部','停止装置'],
        addNames:[]
      },
      null,
      {
        //item:3.14,
        label:'(2)限速绳张紧装置的电气安全装置',
        iClass:'B',
        names:['限速绳电安'],
        addNames:[]
      },
      {
        //item:3.15,
        label:'缓冲器',
        iClass:'B',
        subItems:['(3)固定和完好情况','(4)液位和电气安全装置','(5)对重越程距离'],
        names:['缓冲器固定','液位电安','对重越程判定'],
        addNames:['对重越程最大','对重越程']
      },
    ]
  },
  {
    //bigNo: 4,
    bigLabel:'轿厢与对重',
    splitLine:{'0': 10},
    items:[
      {
        //item:4.1,
        label:'轿顶电气装置',
        iClass:'C',
        subItems:['(1)检修装置','(2)停止装置'],
        names:['检修装置','轿顶停止装置'],
        addNames:[]
      },
      null,
      {
        //item:4.3,
        label:'(3)安全门(窗)电气安全装置',
        iClass:'C',
        names:['安全窗门'],
        addNames:[]
      },
      null,
      {
        //item:4.5,
        label:'对重(平衡重)块',
        iClass:'B',
        subItems:['(1)固定','(2)识别数量的措施'],
        names:['对重固定','识别数量'],
        addNames:[]
      },
      {
        //item:4.6,
        label:'(2)轿厢超面积载货电梯的控制条件',
        iClass:'C',
        names:['超面积载货'],
        addNames:[]
      },
      null,
      {
        //item:4.8,
        label:'紧急照明和报警装置',
        iClass:'B',
        subItems:['(1)紧急照明','(2)紧急报警装置'],
        names:['紧急照明','报警装置'],
        addNames:[]
      },
      {
        //item:4.9,
        label:'地坎护脚板',
        iClass:'C',
        names:['护脚板'],
        addNames:['护脚板高','护脚板高判定']
      },
      {
        //item:4.10,
        label:'超载保护装置',
        iClass:'C',
        names:['超载保护'],
        addNames:[]
      }
    ]
  },
  {
    //bigNo: 5,
    bigLabel:'悬挂装置、补偿装置及旋转部件防护',
    splitLine:{'0': 7},
    items:[
      {
        //item:5.1,
        label:'悬挂装置、补偿装置的磨损、断丝、变形等情况',
        iClass:'C',
        names:['磨损变形'],
        addNames:['断丝数','断丝判定','钢绳直径','钢绳公称','钢绳判定']
      },
      {
        //item:5.2,
        label:'绳端固定',
        iClass:'C',
        names:['绳端固定'],
        addNames:[]
      },
      {
        //item:5.3,
        label:'补偿装置',
        iClass:'C',
        subItems:['(1)绳(链)端固定','(2)电气安全装置','(3)补偿绳防跳装置'],
        names:['补偿绳固定','补偿绳电安','补偿绳防跳'],
        addNames:[]
      },
      null,
      {
        //item:5.5,
        label:'松绳(链)保护',
        iClass:'B',
        names:['松绳保护'],
        addNames:[]
      },
      {
        //item:5.6,
        label:'旋转部件的防护',
        iClass:'C',
        names:['旋转部件'],
        addNames:[]
      },
    ]
  },
  {
    //bigNo: 6,
    bigLabel:'轿门与层门',
    splitLine:{'0': 7, '7': 7},
    items:[
      null,null,
      {
        //item:6.3,
        label:'门间隙',
        iClass:'C',
        subItems:['(1)门扇间隙','(2)人力施加在最不利点时间隙'],
        names:['门扇间隙','最不利隙'],
        addNames:['层站','门扇隙','门套隙','地坎隙','施力隙']
      },
      {
        //item:6.4,
        label:'玻璃门防拖曳措施',
        iClass:'C',
        names:['玻门防拖曳'],
        addNames:[]
      },
      {
        //item:6.5,
        label:'防止门夹人的保护装置',
        iClass:'B',
        names:['门夹人'],
        addNames:[]
      },
      {
        //item:6.6,
        label:'门的运行与导向',
        iClass:'B',
        names:['门运行'],
        addNames:[]
      },
      {
        //item:6.7,
        label:'自动关闭层门装置',
        iClass:'B',
        names:['自动关门'],
        addNames:[]
      },
      {
        //item:6.8,
        label:'紧急开锁装置',
        iClass:'B',
        names:['紧急开锁'],
        addNames:[]
      },
      {
        //item:6.9,
        label:'门的锁紧',
        iClass:'B',
        subItems:['(1)层门门锁装置[不含6.9(1)①]','(2)轿门门锁装置[不含6.9(1)①]'],
        names:['层门锁','轿门锁'],
        addNames:['层站','门锁啮长']
      },
      {
        //item:6.10,
        label:'门的闭合',
        iClass:'B',
        subItems:['(1)机电联锁','(2)电气安全装置'],
        names:['机电联锁','门闭合电安'],
        addNames:[]
      },
      {
        //item:6.11,
        label:'☆轿门开门限制装置及轿门的开启',
        iClass:'B',
        subItems:['(1)轿门开门限制装置','(2)轿门的开启'],
        names:['开门限制','门开启'],
        addNames:[]
      },
      {
        //item:6.12,
        label:'门刀、门锁滚轮与地坎间隙',
        iClass:'C',
        names:['刀轮地隙'],
        addNames:['层站','刀坎距','轮坎距']
      }
    ]
  },
  null,
  {
    //bigNo: 8,
    bigLabel:'试验',
    splitLine:{'0': 7, '7': 8},
    items:[
      {
        //item:8.1,
        label:'平衡系数试验',
        iClass:'C',
        names:['平衡系数'],
        addNames:[]
      },
      {
        //item:8.2,
        label:'★轿厢上行超速保护装置试验',
        iClass:'C',
        names:['超速保护'],
        addNames:[]
      },
      {
        //item:8.3,
        label:'☆轿厢意外移动保护装置试验',
        iClass:'B',
        subItems:['(1)制停情况','(2)自监测功能'],
        names:['制停情况','自监测'],
        addNames:[]
      },
      {
        //item:8.4,
        label:'轿厢限速器－安全钳试验',
        iClass:'B',
        names:['限速安全钳'],
        addNames:[]
      },
      {
        //item:8.5,
        label:'对重(平衡重)限速器—安全钳试验',
        iClass:'B',
        names:['对重限速试验'],
        addNames:[]
      },
      {
        //item:8.6,
        label:'运行试验',
        iClass:'C',
        names:['运行试验'],
        addNames:[]
      },
      {
        //item:8.7,
        label:'应急救援试验',
        iClass:'B',
        subItems:['(1)救援程序','(2)救援通道','(3)救援操作'],
        names:['救援程序','救援通道','救援操作'],
        addNames:[]
      },
      null,
      {
        //item:8.9,
        label:'空载曳引检查',
        iClass:'B',
        names:['空载曳引'],
        addNames:[]
      },
      {
        //item:8.10,
        label:'上行制动工况曳引检查',
        iClass:'B',
        names:['上行制动'],
        addNames:[]
      },
      {
        //item:8.11,
        label:'▲下行制动工况曳引检查',
        iClass:'B',
        names:['下行制动'],
        addNames:[]
      },
      {
        //item:8.12,
        label:'▲静态曳引试验',
        iClass:'B',
        names:['静态曳引'],
        addNames:[]
      },
      {
        //item:8.13,
        label:'制动试验',
        iClass:'B',
        names:['制动试验'],
        addNames:[]
      }
    ]
  }
];


//下一个版本inspectionContent实际可选择以旧版inspectionContent做js动态的修改，另外再定义新变量输出。




