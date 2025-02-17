import session from './session';
//import routeUrls from '../configs/routeUrls';

interface ErrorData {
  error: string;
  field: string;
  [key: string]: string;
}

interface GraphQLError {
  extensions: {
    exception: {
      errors?: ErrorData[];
    } & ErrorData;
  };
}

const helper = {
  //只有这个用到
  logOut() {
    session.remove();
    //    location.href = routeUrls.auth.login;     没用？？
  },
  getToken() {
    return session.get();
  },
/*
  getIdFromParams() {
    return location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  },
*/
  parseErrors(errs: GraphQLError[]): any {
    const errors: any = {};
    for (const err of errs) {
      const {
        extensions: { exception }
      } = err;
      if (exception.errors) {
        for (const e of exception.errors) {
          errors[e.field] = e.error;
        }
      }
      errors[exception.field] = exception.error;
    }
    return errors;
  }
};


export default helper;
