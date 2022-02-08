// pages/welcome/welcome.js

import {request} from '../../lib/request.js';
import regeneratorRuntime, { async } from '../../lib/runtime.js';
import {showToast} from '../../utils/promise.js';

Page({
  
  data: {
    // 标记页面进度所处的状态，将整个页面分为页面1、页面2、页面3
    STATE: 0,

    // 页面3渲染用标签名数组
    tag_name: [
      '运动', '读书', '旅行', '美食', '收藏', '艺术', '桌游', '网游',
      '智力游戏', '学习', '美丽|帅气', '独处', '影视剧', '追星', '睡觉', '……'
    ]
  },
  // 记录玩家性别，0为男性，1为女性；默认为男性
  sex: 0,
  // 记录选中的标签
  selectedTag: [],

  onLoad: function () {
    // 检查有无个人身份信息
    const openid = wx.getStorageSync('openid');

    // 没有个人信息先获取昵称和头像url
    if(!openid) {
      showToast({
        title: '为了更好的使用体验，请先登录',
        icon: 'none',
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '../../pages/login/login',
        });
      }, 1500);
    } else {
      wx.switchTab({
        url: '../../pages/index/index',
      });
    }
  },
  
  onShow: function () {
    const openid = wx.getStorageSync('openid');
    
    if(openid) {
      // 检查并设置初始页面位于页面1
      if(this.data.STATE !== 1) {
        this.setData({
          STATE: 1,
        });
      }

      // 设置页面1至页面2的跳转，延迟时间3s
      setTimeout(() => {
        this.setData({
          STATE: 2,
        });
      }, 3000);
    }
  },

  // 选择与记录性别
  handleChooseSex(e) {
    const {sex} = e.currentTarget.dataset;
    this.setData({
      STATE: 3
    });
    this.sex = sex;
  },

  // 选中标签
  handleChooseTag(e) {
    const {name} = e.currentTarget.dataset;
    let selectedTag = this.selectedTag;

    // 已存在则删除
    // 未存在则添加
    const index = selectedTag.indexOf(name);
    if(index !== -1) {
      selectedTag = selectedTag.splice(index, 1);
    } else if(name !== '……') {
      selectedTag.push(name);
    }

    this.selectedTag = selectedTag;
  },

  // 提交按钮：提交信息；更新记录使用者性别
  async handleSubmit(e) {
    // 获取openid
    const openid = wx.getStorageSync('openid');

    try {
      // 提交信息
      await request({
        url: '/gift/user/addTag',
        method: 'POST',
        data: {
          openid,
          sex: this.sex === 0 ? '男' : '女',
          tags: this.selectedTag
        },
        header: {
          'content-type': 'application/json'
        }
      });

      // 记录性别
      const userinfo = wx.getStorageSync('userinfo');
      if(this.sex !== userinfo.gender) {
        userinfo.gender = this.sex;
        wx.setStorageSync('userinfo', userinfo);
      }
    } catch (err) {
      console.log(err);
    }

    // 返回首页
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
});
