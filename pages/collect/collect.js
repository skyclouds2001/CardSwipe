// pages/collect/collect.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {
    gift_data: [
      {
        gift_id: 1,
        gift_name: "西瓜",
        gift_tag: "水果",
        gift_img_src: "../../images/1.jpg"
      }
    ]
  },

  onLoad: function (options) {
    try {
      const token = wx.getStorageSync('token') || '';
      this.getCollectInfo(token);
    } catch (err) {
      console.log(err);
    }
  },

  // 获取收藏信息
  async getCollectInfo(token) {
    const res = await request({
      url: '/gift/gift/selectCollectGift',
      data: {
        token
      }
    });
    console.log(res);

    // this.setData({
    //   gift_data: {}
    // });
  }
})