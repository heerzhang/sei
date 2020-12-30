import storage from './storage';

const session =  {
  isTokenSet() {
    const authToken = storage.get('token');
    return authToken && !!authToken.trim();
  },

  get() {
    const  token=storage.get('token');
     return token? token : '没有初始化吧？的';
    //  return storage.get('token');
  },

  set(tokenValue: string) {
    storage.set('token', tokenValue);
  },

  remove() {
    storage.remove('token');
  }
};


export default session;
