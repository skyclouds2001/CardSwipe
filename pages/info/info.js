// pages/info/info.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

const app = getApp();

Page({

  data: {
    gift: {},
  },
  openid: '',

  onLoad: async function (options) {
    // 提取礼物id
    const {id} = options;

    try {

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

        gift.is_collect = app.globalData.collect.includes(parseInt(id));
        gift.boyprogress = (gift.boylike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);
        gift.girlprogress = (gift.girllike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);

        this.setData({
          gift,
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
  async handleCollectGift() {

    // 提取礼物信息
    let {gift} = this.data;

    // 请求更新数据
    if(!gift.is_collect) {  // 添加收藏

      // 请求添加收藏
      const res = await request({
        url: `/gift/collection/add/${this.openid}/${gift.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res.data?.success) {  // 请求成功

        // 显示请求成功信息
        showToast({
          title: '添加收藏成功',
          icon: 'success',
        });
        // 更新至page.data
        gift.is_collect = true;
        this.setData({
          gift,
        });
        // 更新至app.globalData
        app.globalData.collect.push(gift.id);

      } else {  // 请求失败
        // 显示错误提示信息
        showToast({
          title: '添加收藏失败',
          icon: 'error',
        });
      }

    } else {  // 取消收藏

      const res = await request({
        url: `/gift/collection/delete/${this.openid}/${gift.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res.data?.success) {
        showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
        gift.is_collect = false;
        this.setData({
          gift,
        });
        app.globalData.collect.filter(v => v !== gift.id);
      } else {
        showToast({
          title: '取消收藏失败',
          icon: 'error',
        });
      }

    }
    
  },

});
