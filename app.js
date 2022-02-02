// app.js

import {request} from './lib/request.js';
import regeneratorRuntime, { async } from './lib/runtime.js';
import {login} from './utils/promise.js';

App({
  onLaunch: function () {
    this.userlogin();
  },

  // 用户登录
  async userlogin() {
    try {
      const {code} = await login();
      wx.setStorageSync('code', code);
    } catch (err) {
      console.log(err);
    }
  }
})
