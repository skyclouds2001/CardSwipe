// pages/login/login.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {getUserProfile, login} from '../../utils/promise.js';
import {showToast} from '../../utils/interact.js';

Page({
  onLoad: function () {
  },

  async handleGetUserInfo() {
    // 正式获取个人信息
    const res = await getUserProfile({
      desc: '获取个人头像及昵称'
    });
    const {userInfo} = res;
    const userinfo = {
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    };
    wx.setStorageSync('userinfo', userinfo);

    // 换取openid和token
    // 用户登录
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

    if(data.data.user) {
      const {token, openid} = data.data.user;
      wx.setStorageSync('token', token);
      wx.setStorageSync('openid', openid);
    }

    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.navigateTo({
          url: '../../pages/welcome/welcome',
        });
      },
    });

  },
});
