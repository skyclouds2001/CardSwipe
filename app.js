// app.js

import {request} from './lib/request.js';
import regeneratorRuntime, { async } from './lib/runtime.js';
import {login} from './utils/promise.js';

App({

  onLaunch: function () {
  },

  onUnhandledRejection: function (e) {
    console.log(e.reason);
  },

  globalData: {},

  // 版本号比较代码：来源微信开发文档
  compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);
  
    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);
  
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },  

});
