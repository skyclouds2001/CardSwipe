// app.js

import {request} from './lib/request.js';
import regeneratorRuntime, { async } from './lib/runtime.js';
import {login} from './utils/promise.js';

App({

  onLaunch: async function () {

    // 用户登录
    try {
      const {code} = await login({
        timeout: 10000,
      });
      wx.setStorageSync('code', code);
    } catch (err) {
      console.log(err);
    }
    
  },

});
