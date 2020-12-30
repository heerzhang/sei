interface CookiesOptions {
  path?: string;
  expires?: Date | string | number;
  [key: string]: string | Date | undefined | boolean | number;
}

const cookies = {
  get(name: string) {
    /* eslint-disable */
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    /* eslint-enable */

    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  set(name: string, val: string, options: CookiesOptions = {}) {
    if (!options.path) {
      options.path = '/';
    }

    let { expires } = options;

    if (typeof expires === 'number' && expires) {
      const d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = d;
      options.expires = d;
    }
    if (expires && expires instanceof Date) {
      options.expires = expires.toUTCString();
    }

    const value = encodeURIComponent(val);

    let updatedCookie = `${name}=${value}`;

    Object.keys(options).forEach(propName => {
      updatedCookie += `; ${propName}`;

      const propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += `= ${propValue}`;
      }
    });

    document.cookie = updatedCookie;
  },

  remove(name: string) {
    this.set(name, '', {
      expires: -1
    });
  }
};


export default cookies;


/* 原文：https://blog.csdn.net/hxg117/article/details/76954606
3. 将Token存储于Cookie
HTTP/1.1 200 OK
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsI.eyJpc3MiOiJodHRwczotcGxlL.mFrs3Zo8eaSNcxiNfvRh9dqKP4F1cB; Secure; HttpOnly;
随后的请求需要带上Token
GET /stars/pollux
Host: galaxies.com
Cookie: access_token=eyJhbGciOiJIUzI1NiIsI.eyJpc3MiOiJodHRwczotcGxlL.mFrs3Zo8eaSNcxiNfvRh9dqKP4F1cB;
优点：
  可以指定 httponly，  来防止被Javascript读取， 也可以指定secure，
          来保证token只在HTTPS下传输。
缺点：
  不符合Restful 最佳实践。
  容易遭受CSRF攻击 （可以在服务器端检查 Refer 和 Origin）
*/

