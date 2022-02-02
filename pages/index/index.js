// index.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    // 礼物信息
    gift_info: {
      id: 34555,
      title: "礼物名称",
      status: 0,
      des: "礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n礼物文案\n",
      url: "../../images/1.jpg",
      vodurl: 0,
      uid: 0,
      boylike: 20,
      girllike: 20,
      cid: 0,
      progress: 58,
      tag: "礼物标签",
      buyurl: "礼物获得途径",
      taglist: [],

      boyper: 50,
      girlper: 50,
      price: "礼物价格",
      is_collect: false
    },
    // star图标路径
    iconsrc: "../../icons/shoucang.png",
    iconsrc_click: "../../icons/shoucang _click.png"
  },

  onLoad: function (options) {
    // 先检测有无用户信息
    // 没有表示尚未登录
    const userinfo = wx.getStorageSync('userinfo');
    const openid = wx.getStorageSync('openid');
    if(!userinfo || !openid) {
      wx.navigateTo({
        url: '../../pages/welcome/welcome'
      });
    }
  },

  onShow: function (options) {
    this.getGiftInfo();
  },

  // 获取礼物信息方法
  async getGiftInfo() {
    try {
      // 请求获取信息
      const openid = wx.getStorageSync('openid') || '';

      const res = await request({
        url: '/gift/gift/getGift',
        data: {
          openid
        }
      });
      console.log(res);

      // 提取礼物信息并更新页面内容
      const {giftList} = res;
      giftList.is_collect = false;
      this.setData({
        gift_info: giftList
      });

      wx.setStorageSync('giftinfo', giftList);
    } catch (err) {
      console.log(err);
    }
  },

  // 用户点击收藏响应
  handleStarOnClick: function(e) {
    const {gift_info} = this.data;
    const {is_collect} = gift_info;
    gift_info.is_collect = !is_collect;
    this.setData({
      gift_info
    });
    wx.setStorageSync('giftinfo', gift_info);
  }
})
