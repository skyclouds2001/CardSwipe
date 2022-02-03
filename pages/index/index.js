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
  openid: '',
  page: 1,

  onLoad: function () {
    // 先检测有无用户信息
    // 没有表示尚未登录
    const openid = wx.getStorageSync('openid');
    this.openid = openid;

    if(!openid) {
      wx.navigateTo({
        url: '../../pages/welcome/welcome'
      });
    }
  },

  onShow: function () {
    if(!this.openid) {
      const openid = wx.getStorageSync('openid') || '';
      this.openid = openid;
    }

    this.getGiftInfo();
  },

  // 获取礼物信息方法
  async getGiftInfo() {
    try {
      // 请求获取礼物信息
      const res = await request({
        url: '/gift/gift/getGift',
        method: 'GET',
        data: {
          openid: this.openid,
          page: this.page
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });
      this.page = this.page + 1;

      console.log(res.data);

      // 提取礼物信息并更新页面内容
      // const {giftList} = res;
      // giftList.is_collect = false;
      // this.setData({
      //   gift_info: giftList
      // });
    } catch (err) {
      console.log(err);
    }
  },

  // 用户点击收藏响应
  handleStarOnClick: function(e) {
    // 更新至data对象
    const {gift_info} = this.data;
    const {is_collect} = gift_info;
    gift_info.is_collect = !is_collect;
    this.setData({
      gift_info
    });

    // 更新至存储: 保存礼物id
    let collect = wx.getStorageSync('collect') || [];
    const index = collect.indexOf(gift_info.id);
    if(gift_info.is_collect && index === -1) {
      collect.push(gift_info.id);
    } else if (!gift_info.is_collect && index !== -1) {
      collect.splice(index, 1);
    }
    wx.setStorageSync('collect', collect);
  }
})
