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
  token: '',
  openid: '',

  onLoad: function (options) {
    try {
      const token = wx.getStorageSync('token') || '';
      const openid = wx.getStorageSync('openid') || '';
      this.token = token;
      this.openid = openid;

      this.getCollectInfo();
    } catch (err) {
      console.log(err);
    }
  },

  // 获取收藏信息
  async getCollectInfo() {
    const openid = this.openid;

    const res = await request({
      url: `/gift/gift/selectCollectGift`,
      method: 'GET',
      data: {
        openid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    console.log(res.data);

    // this.setData({
    //   gift_data: {}
    // });
  }
})