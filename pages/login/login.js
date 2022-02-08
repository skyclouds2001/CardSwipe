// pages/login/login.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {getUserProfile} from '../../utils/promise.js';

Page({
  async handleGetUserInfo(e) {
    // 正式获取个人信息
    const res = await getUserProfile({
      desc: '获取个人头像及昵称'
    });
    const {userInfo} = res;
    wx.setStorageSync('userinfo', userInfo);

    // 换取openid和token
    const code = wx.getStorageSync('code');
    const {data} = await request({
      url: '/login/wx',
      method: 'POST',
      data: {
        code,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    if(data.data.user) {
      const {token} = data.data.user;
      const {openid} = data.data.user;
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
