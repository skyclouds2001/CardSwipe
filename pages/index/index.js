// pages/welcome/welcome.js

import { request } from '../../lib/request.js';

Page({
  
  data: {
    // 标记页面进度所处的状态，将整个页面分为页面1、页面2、页面3
    STATE: 0,

    // 页面3渲染用标签名数组
    tag: [],
  },
  // 记录玩家性别，0为男性，1为女性；默认为男性
  sex: 0,

  onLoad: function () {

    // 通过userinfo内有无sex属性判断是否需经过welcome页
    const userinfo = wx.getStorageSync('userinfo');

    if(userinfo?.sex) {

      // 跳转至首页
      wx.switchTab({
        url: '../../pages/judge/judge',
      });

    } else {

      // 设置初始页面
      this.setData({
        STATE: 1,
      });

      // 设置页面1至页面2的跳转，延迟时间3s
      setTimeout(() => {
        this.setData({
          STATE: 2,
        });
      }, 3000);

      // 初始化标签
      this.initTag();

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
    
    const tag = this.data.tag;
    tag.forEach(v => v.name === name.trim() && v.name !== '……' ? v.is_selected = !v.is_selected : '');

    this.setData({
      tag,
    });
  },

  // 提交按钮：提交信息；更新记录使用者性别；移入存储
  async handleSubmit() {
    // 获取选择的标签
    let selectedTag = [];
    this.data.tag.forEach(v => v.is_selected ? selectedTag.push(v.name) : '');

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
          tags: selectedTag
        },
        header: {
          'content-type': 'application/json'
        }
      });

      // 记录性别：更新至存储
      const userinfo = wx.getStorageSync('userinfo') || {};
      userinfo.sex = this.sex;
      wx.setStorageSync('userinfo', userinfo);
    } catch (err) {
      console.log(err);
    }

    // 返回首页
    wx.switchTab({
      url: '/pages/judge/judge',
    });
  },

  initTag() {
    let tag = [];
    const tag_name = ['运动', '读书', '旅行', '美食', '收藏', '艺术', '桌游', '网游','智力游戏', '学习', '美丽|帅气', '独处', '影视剧', '追星', '睡觉', '……'];

    for (const v of tag_name) {
      tag.push({
        name: v,
        is_selected: false,
      });
    }

    this.setData({
      tag,
    });
  },

});
