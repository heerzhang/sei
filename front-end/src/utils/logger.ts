//还没实际使用到的；

const { REACT_APP_BUILD_MODE } = process.env;

/* tslint:disable */
class Logger {
      //debug () ,verbose ();
  static log(...args: Array<any>) {
    if (REACT_APP_BUILD_MODE !== 'production') {
      console.log(...args);
    }
  }

  static info(...args: Array<any>) {
    if (REACT_APP_BUILD_MODE !== 'production') {
      console.info(...args);
    }
  }

  static warn(...args: Array<any>) {
    if (REACT_APP_BUILD_MODE !== 'production') {
      console.warn(...args);
    }
  }

  static error(...args: Array<any>) {
    if (REACT_APP_BUILD_MODE !== 'production') {
      console.error(...args);
    }
  }
}
/* tslint:enable */

export default Logger;

