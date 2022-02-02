// pages/login/login.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {getUserProfile} from '../../utils/promise.js';

Page({
  async handleGetUserInfo(e) {
    // 加载：如何保证login与userinfo不同时起效？
    // this.load();

    // 正式获取个人信息
    const res = await getUserProfile({
      desc: '获取个人头像及昵称'
    });
    const {userInfo} = res;
    wx.setStorageSync('userinfo', userInfo);

    // 换取openid
    const code = wx.getStorageSync('code');
    const re = await request({
      url: '/login/wx',
      method: 'POST',
      data: {
        code
      }
    });
    console.log(re);

    wx.navigateBack({
      delta: 1
    });
  },

  // load() {
  //   wx.showLoading({
  //     title: '加载中...',
  //     mask: true
  //   });

  //   setTimeout(() => {
  //     wx.hideLoading();
  //   }, 1500);
  // }
})
