// pages/info/info.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    iconsrc: "../../icons/shoucang.png",
    iconsrcSelect: "../../icons/shoucang _click.png",
    gift_info: {},
  },
  openid: '',

  onLoad: async function (options) {
    const {id} = options;

    try {
      // 请求获取礼物信息
      const {data} = await request({
        url: '/gift/gift/getGiftById/' + id,
        method: 'GET',
        data: {
          id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      // 请求成功则设置礼物信息；否则弹出提示信息
      if(data.success) {
        const {gift} = data.data;
        gift.is_collect = false;
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
        data: {
          openid: this.openid,
          cid: gift_info.id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res?.data?.success) {
        showToast({
          title: '收藏成功',
          icon: 'success',
        });
      } else {
        showToast({
          title: '收藏失败\n请稍后再试',
          icon: 'error',
        });
      }
    } else {
      const res = await request({
        url: `/gift/collection/add/${this.openid}/${gift_info.id}`,
        method: 'GET',
        data: {
          openid: this.openid,
          cid: gift_info.id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if(res?.data?.success) {
        showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
      } else {
        showToast({
          title: '取消收藏失败\n请稍后再试',
          icon: 'error',
        });
      }
    }
  },

});