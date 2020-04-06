import storage from './storage';

export default {
  isTokenSet() {
    const authToken = storage.get('token');
    return authToken && !!authToken.trim();
  },

  get() {
    //const  token=storage.get('token');
     const  token=storage.get('wsToken');
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
