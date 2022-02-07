// pages/info/info.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    iconsrc: "../../icons/shoucang.png",
    iconsrcSelect: "../../icons/shoucang _click.png",
    gift_info: {}
  },

  onLoad: async function (options) {
    const {id} = options;

    try {
      // 请求获取礼物信息
      const {data} = await request({
        url: '/gift/gift/getGiftById/' + id,
        method: 'GET',
        data: {
          id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });

      // 请求成功则设置礼物信息；否则弹出提示信息
      if(data.success) {
        const {gift} = data.data;
        gift.is_collect = false;
        this.setData({
          gift_info: data.data.gift
        });
      } else {
        await showToast({
          title: '网络异常',
          icon: 'error'
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 响应收藏
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