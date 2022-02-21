// app.js

import regeneratorRuntime, { async } from './lib/runtime.js';
import {request} from './lib/request.js';
import {login} from './utils/promise.js';

App({

  onLaunch: async function () {
    // 换取openid和token
    const {code} = await login({
      timeout: 10000,
    });
    const {data} = await request({
      url: '/login/wx',
      method: 'POST',
      data: {
        code,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if(data?.data?.user) {
      const {token, openid} = data.data.user;
      wx.setStorageSync('token', token);
      wx.setStorageSync('openid', openid);
    }

    // colorui 库导航栏预设代码
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    });
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
