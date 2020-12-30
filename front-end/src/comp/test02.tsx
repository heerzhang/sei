/** @jsxImportSource @emotion/react */
//import { jsx,  } from "@emotion/react";
import * as React from "react";
import {
  Text,
  Button,
  Sheet,
  InputGroup,
  Input,
  ScrollView,
  ScrollViewHandles,
  useToast
} from "customize-easy-ui-component";
//import useScrollLock from "use-scroll-lock";


//import {ScrollView, ScrollViewHandles} from "customize-easy-ui-component";

//import { storiesOf } from "@storybook/react";
import { useTouchable } from "touchable-hook";
//import { InputGroup } from "./Form";
//import { Touchable } from "./Touchable";

//var faker = require('faker/locale/zh_CN');


function TouchableHighlight() {
  const [pressCount, setPressCount] = React.useState(0);

  function onPress() {
    console.log("Pressed!");
    setPressCount(pressCount + 1);
  }

  const { bind, active, hover } = useTouchable({
    onPress,
    behavior: "link"
  });

  return (
    <div>
      {pressCount}
      <div
        role="button"
        tabIndex={0}
        {...bind}
        css={{
          border: hover ? "1px solid black" : "1px solid transparent",
          userSelect: "none",
          outline: "none",
          background: active ? "#08e" : "transparent"
        }}
      >
        This is a touchable highlight
      </div>
    </div>
  );
}

export  function Example2() {
  const [count, setCount] = React.useState(0);
  const [step, setStep] = React.useState(1);

  const setCountNew = React.useCallback(() => {
    setCount(count + step);
    setStep(step + 1);
  }, [count, step]);

  React.useEffect(() => {
    console.log('useEffect赖 count=',count,'  step=',step);
    const tm = setInterval(() => {
      setCountNew();
    }, 3000);

    return () => { clearInterval(tm); }
  }, [setCountNew, count ,step]);

  React.useEffect(() => {
    console.log(`[change] count is ${count}`);
  }, [count]);

  return (
    <div>
      <div>
        <div>
          <h2>function component</h2>
          <p>count is {count}</p>
          <Text muted css={{ textAlign: "center" }} variant="subtitle">
            请使用您的用户名密码登录:
          </Text>
          <InputGroup className={"InputGroup"}  label="账户"
          >
            <p>外站都是好的1</p>
            <Input
              inputSize="md"
              type="text"
              //浏览器HTML5验证格式是否正确input type="email" required multiple/>
              placeholder="账户"
            />
          </InputGroup>
          <InputGroup
               hideLabel label="密码"
          >
            <InputGroup
              hideLabel label="密码"
            >
              <Input
                inputSize="md"
                type={ "text"}
                placeholder="密千套着码"
                autoComplete="off"
              />
            </InputGroup>
          </InputGroup>
          <div css={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              block
              component="button"
              css={{
                textAlign: "center",
                width: "100%",
              }}
              type="submit"
              size="md"
              intent="primary"
            >
              登录
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}

export  function Example02() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button onPress={() => setOpen(true)}>open</Button>
      <Sheet
        position="left"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableHighlight />
      </Sheet>
    </div>
  );
}

export  function Example33() {
  const ref = React.useRef<ScrollViewHandles>(null);

  function scroll() {
    console.log(ref);
    ref.current!.scrollTo(undefined, 400);
  }

  return (
    <ScrollView css={{ height: "300px" }} overflowY  ref={ref}>
      <div css={{ height: "600px" }}>
        some scroll content
        <button onClick={scroll}>scroll to 300</button>
      </div>
      <React.Fragment>
        <button onClick={() => ref.current!.scrollTo(undefined, 0)}>
          scroll to 0
        </button>
      </React.Fragment>
    </ScrollView>
  );
}


export  function Example22() {

  const ref = React.useRef();

  function scrollDown() {
    // scroll to x, y coordinattes
    // @ts-ignore
    ref.current.scrollTo(undefined, 800);
  }

  function scrollUp() {
    // @ts-ignore
    ref.current.scrollTo(undefined, 0);
  }


//  const [isOpen, setIsOpen] = React.useState(false);
 // const toast = useToast();
  return (
    <React.Fragment >
      <div style={{ height: "400px" }} >
      <ScrollView overflowY
                  //style={{ height: "40%" }}
                  css={{
                     flex: 1,
                     height: "100%",
                    //overflowY: "auto",
                    // overflowY: "scroll",
                    // WebkitOverflowScrolling: "touch"
                  }}
                  ref={ref} >
        <div style={{  height: `calc(100% - 22px)` }} >
          <button onClick={scrollDown}>scroll down</button>
        </div>
        <button onClick={scrollUp}>scroll to top</button>
      </ScrollView>
      </div>
    </React.Fragment>
  );
}



let id = 0;
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}
/*
const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];
*/
export  function Example() {
  //const theme = useTheme();
  const toast = useToast();

  return (
    <div css={{ PADDING: "3REM" }}>
      <Button
        onClick={() => {
          toast({
            duration: 2500,
            title: "Hello world",
            subtitle: "Excepteur exercitation 停留 2500 ms."
          });
        }}
      >
        Show toast
      </Button>
    </div>
  );
}
