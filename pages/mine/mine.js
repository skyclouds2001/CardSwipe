// pages/mine/mine.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {
  showModal,
  getUserProfile,
} from '../../utils/promise.js';

Page({

  data: {
    // 头像链接
    imgurl: '',
    // 昵称
    nickname: '',
    // 标记活跃的项
    isActive: -1,
    // 标记是否显示登录提示框
    showModal: false,
  },
  defaultImgUrl: '../../images/defaultImg.jpg',

  onLoad: function () {
    try {
      const userinfo = wx.getStorageSync('userinfo');
      // 存在则直接设置数据|不存在则请求用户信息
      if(userinfo?.nickName && userinfo?.avatarUrl) {
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl
        });
      } else {
        this.setData({
          showModal: true,
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

  // 模态框响应
  async handleModal(e) {
    // 隐藏提示框
    this.setData({
    });

    const {flag} = e.currentTarget.dataset;
    // 允许获取则请求数据
    if(flag) {
      try {
        // 请求userinfo数据
        const res = await getUserProfile({
          desc: '获取个人头像及昵称'
        });

        // 提取userinfo有效数据
        const {userInfo} = res;
        const userinfo = {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        };

        // 设置data
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl,
          showModal: false,
        });

        // 设置存储
        wx.setStorageSync('userinfo', userinfo);
      } catch (err) {
        console.log(err);
      }
    } else {  // 否则使用默认头像替代
      this.setData({
        imgurl: this.defaultImgUrl,
      });
    }

  },

});