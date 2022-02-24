// pages/info/info.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    gift_info: {},
  },
  openid: '',
  collect: [],

  onLoad: async function (options) {
    const {id} = options;

    try {

      // 获取礼物收藏信息
      const collect = wx.getStorageSync('collect') || [];
      this.collect = collect;

      // 请求获取礼物信息
      const {data} = await request({
        url: '/gift/gift/getGiftById/' + id,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      // 请求成功则设置礼物信息；否则弹出提示信息
      if(data.success) {
        const {gift} = data.data;

        gift.is_collect = collect.includes(parseInt(id));
        gift.boyprogress = (gift.boylike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);
        gift.girlprogress = (gift.girllike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);

        this.setData({
          gift_info: data.data.gift,
        });
      } else {
        await showToast({
          title: '网络异常\n请稍后再试',
          icon: 'error',
        });
      }

    } catch (err) {
      console.log(err);
    }

    // 获取openid
    const openid = wx.getStorageSync('openid');
    this.openid = openid;

  },

  // 响应收藏
  async handleCollect() {

    // 更新至data对象
    const {gift_info} = this.data;
    gift_info.is_collect = !gift_info.is_collect;
    this.setData({
      gift_info,
    });

    // 请求更新数据
    if(gift_info.is_collect) {

      const res = await request({
        url: `/gift/collection/add/${this.openid}/${gift_info.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res?.data?.success) {
        await showToast({
          title: '收藏成功',
          icon: 'success',
        });
      } else {
        await showToast({
          title: '收藏失败\n请稍后再试',
          icon: 'error',
        });
      }

    } else {

      const res = await request({
        url: `/gift/collection/delete/${this.openid}/${gift_info.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res?.data?.success) {
        await showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
      } else {
        await showToast({
          title: '取消收藏失败\n请稍后再试',
          icon: 'error',
        });
      }

    }
    
  },

  // 预览图片效果
  handlePreviewImage() {
    const url = this.data.gift_info.url;
    wx.previewImage({
      urls: [url],
      current: url,
    });
  },

});
