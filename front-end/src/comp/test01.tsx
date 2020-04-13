/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  ScrollView,
  List,
  ListItem,
Skeleton, useInfiniteScroll
} from "customize-easy-ui-component";
//import useThrottle from "@rooks/use-throttle";
import { useThrottle } from "../hooks/useHelpers";
import parseXlsx from 'excel';   //前端使用就报错.createReadStream is not a function
//import { globalHistory  } from "@reach/router";
//import excelData from "fileTest2.xlsx";　
import excelData from "./dataMaintain.json";
import {  Subscription } from "react-apollo"
import gql from 'graphql-tag'

const HELLO_SUBSCRIPTION = gql`
    subscription onQQreq {
        qqCommunicate
    }
`
var faker = require('faker/locale/zh_CN');

const set = new Set();
export default function Example(props) {
  const [number, setNumber] = React.useState(0);
  const addNumber = (egr) => {
    console.log("RecordView捕获,切花source egr=",egr);
   setNumber(number + 1);
}
  //let isReady=true;
  const {doFunc:addNumberThrottled, ready:isReady} = useThrottle(addNumber,4000);
 // const [addNumberThrottled, isReady] = useThrottle(addNumber, 4000);

  const [count, setCount] = React.useState(1);
  const [val, setVal] = React.useState('');

  const callback = React.useCallback(() => {
    return count;
  }, [count]);

  set.add(callback);


  const [ inp , dispatch] = React.useReducer( (state, action) => {
    switch (action.type) {
      default:
        return {  ...state,  ...action  }
    }
  }, {
  });


  React.useEffect(() => {
    console.log('render useEffect')
    const id = setInterval(() => {

        dispatch( { dfg11: `很tutyui候`  } );

      console.log(`[uuu] count is ${inp}, ;`, 'inp=',inp);
    }, 5000);
    return () => clearInterval(id);
  }, [inp]);

  React.useEffect(() => {
    console.log(`[change] inp is ${inp}`);
  }, [inp]);



  const ref = React.useRef();
  const [items, setItems] = React.useState(
    Array.from(new Array(4)).map(() => faker.name.firstName())
  );

  function fetchdata() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }


  const [page, setPage] = React.useState(0);
  //customize-easy-ui-component.useInfiniteScroll必须内容撑开才可以滚动触发函数。
  const [fetching] = useInfiniteScroll({
    container: ref,
    hasMore: page <3,
    onFetch: () => {
      return fetchdata().then(() => {
        setItems([
          ...items,
          ...Array.from(new Array(3)).map(() => faker.name.firstName())
        ]);
        setPage(page + 1);
      });
    }
  });

  //const [option, setOption] = useHistoryState("", "option");
  //使用window.history.pushState(；必须刷新页面才有数据。 "d:\\\\jtestx.xlsx"
  //console.log("来看当前的items nowPath=",globalHistory.location.state&&globalHistory.location.state.option, omit(globalHistory.location.state,'key'), globalHistory.location.state);
  //var test = require('fs').readFileSync('./test.txt', 'utf8');

  console.log("来看当前的Spreadsheet.xlsx 没提供函数=", excelData);



  // @ts-ignore
  ref.current && console.log("来看", ref.current.offsetHeight,"+",ref.current.clientHeight,"大于",ref.current.scrollHeight);

//addNumberThrottled('上空的飞机但是')
  return (
    <div>
      <h1>Number: {number}</h1>
      <p>Click really fast.</p>
      <button onClick={addNumber}>Add number</button>
      <button onClick={()=>{addNumberThrottled('上空的飞机但是')} }>Add number isReady={isReady?'yes':'no'} throttled</button>
      <hr/>
      <h4>{count}</h4>
      <hr/>
      <Child callback={callback}/>
      <hr/>
      <div>
        <Subscription
          subscription={HELLO_SUBSCRIPTION}
        >
          {({ data, loading }) => {
            if (!loading && data && data.qqCommunicate) {
              return <p>{data.qqCommunicate}</p>
            } else {
              return <p>Loading...</p>
            }
          }}
        </Subscription>
        <button onClick={() => setCount(count + 1)}>+加速</button>
        <input value={val} onChange={event => setVal(event.target.value)}/>
      </div>


<ScrollView overflowY css={{ height: "230px" }} innerRef={ref}>
      <h2>function component</h2>
      <p>count is </p>
      <List>
        {items.map(item => (
          <ListItem key={item} primary={item}　title={item} />
        ))
        }
        {fetching && (
          <ListItem
            interactive={false}
            aria-live="polite"
            aria-busy="true"
            primary={<Skeleton animated css={{ width: "150px" }} />}
          />
        )}
      </List>
    </ScrollView>
  </div>
  );
}

function Child({ callback }) {
  const [count, setCount] = React.useState(() => callback());
  React.useEffect(() => {
    setCount(callback());
  }, [callback]);
  return <div>ghgh
    {count}nnnnn
  </div>
}
/*
function getUser() {
  faker.seed(0);

  return {
    name: faker.name.firstName() + " " + faker.name.lastName(),
    uid: faker.random.uuid(),
    description: faker.lorem.sentence()
  };
}
*/

export  function Example22(props) {

  const [{ count, step, inp }, dispatch] = React.useReducer( (state, action) => {
    switch (action.type) {
      case 'increment':
        return {
          ...state,
          count: state.count + state.step,
          step: state.step + 1,
          inp: {...state.inp, ...action.inp},
        }
      default:
        return state;
    }
  }, {
    count: 0,
    step: 1,
    inp: {} as any,
  });


  React.useEffect(() => {
    console.log('render useEffect')
    const id = setInterval(() => {
      if(count>11)
        dispatch({ type: 'increment', inp: { dfg11: `很${count}候` } });
      else
        dispatch({ type: 'increment', inp: { dfg01: `很${count}候` } });
      console.log(`[] count is ${count}, step is ${step}`, 'inp=',inp);
    }, 5000);
    return () => clearInterval(id);
  }, [count, step,    inp]);

  React.useEffect(() => {
    console.log(`[change] count is ${count}`);
  }, [count]);

  React.useEffect(() => {
    console.log(`[change] step is ${step}`);
  }, [step]);

  const ref = React.useRef();
  const [items, setItems] = React.useState(
    Array.from(new Array(4)).map(() => faker.name.firstName())
  );

  function fetchdata() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }


  const [page, setPage] = React.useState(0);
  //customize-easy-ui-component.useInfiniteScroll必须内容撑开才可以滚动触发函数。
  const [fetching] = useInfiniteScroll({
    container: ref,
    hasMore: page <3,
    onFetch: () => {
      return fetchdata().then(() => {
        setItems([
          ...items,
          ...Array.from(new Array(3)).map(() => faker.name.firstName())
        ]);
        setPage(page + 1);
      });
    }
  });

  //const [option, setOption] = useHistoryState("", "option");
  //使用window.history.pushState(；必须刷新页面才有数据。

  //console.log("来看当前的items nowPath=",globalHistory.location.state&&globalHistory.location.state.option, omit(globalHistory.location.state,'key'), globalHistory.location.state);

//  console.log("来看当前的items nowPath=",globalHistory.location.state ,"option=",globalHistory);
  // @ts-ignore
  // ref.current && ( ref.current.scrollHeight=350);
  // @ts-ignore
  ref.current && console.log("来看", ref.current.offsetHeight,"+",ref.current.clientHeight,"大于",ref.current.scrollHeight);


  return (
    <ScrollView overflowY css={{ height: "230px" }} innerRef={ref}>
      <h2>function component</h2>
      <p>count is {count}</p>
      <List>
        {items.map(item => (
          <ListItem key={item} primary={item}　title={item} />
        ))
        }
        {fetching && (
          <ListItem
            interactive={false}
            aria-live="polite"
            aria-busy="true"
            primary={<Skeleton animated css={{ width: "150px" }} />}
          />
        )}
      </List>
    </ScrollView>
  );
}
