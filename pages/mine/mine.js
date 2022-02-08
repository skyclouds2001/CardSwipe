// pages/mine/mine.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {
    // 头像链接
    imgurl: '../../images/1.jpg',
    // 昵称
    nickname: '昵称',
    // 标记活跃的项
    isActive: -1,
  },

  onLoad: function () {
    try {
      const userinfo = wx.getStorageSync('userinfo') || [];
      if(userinfo.length !== 0) {
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 点击选项响应
  handleOnChange(e) {
    const {id} = e.currentTarget.dataset;
    const {type} = e;

    if(type === "touchstart") {
      this.setData({
        isActive: id
      });
    }
    if(type === "touchend") {
      this.setData({
        isActive: -1
      });
    }
  },

});