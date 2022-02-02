// pages/info/info.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {} from '../../utils/promise.js';

Page({

  data: {
    iconsrc: [
      "../../icons/shoucang.png", 
      "../../icons/shoucang _click.png"
    ],
    gift_info: {
      id: 0,
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
    }
  },

  onLoad: function (options) {
    const {id} = options;
    this.getGiftInfo(id);
  },

  // 获取礼物
  async getGiftInfo(id) {
    try {
      const res = await request({
        url: '/gift/gift/getGiftById',
        data: {
          id
        }
      });
      console.log(res);

      // this.setData({
      //   gift_info: {}
      // });
    } catch (err) {
      console.log(err);
    }
  },

  // 响应收藏
  handleStarOnClick: function(e) {
    const {gift_info} = this.data;
    const {is_collect} = gift_info;
    gift_info.is_collect = !is_collect;
    this.setData({
      gift_info
    });
    wx.setStorageSync('gift_info', gift_info);
  }
})