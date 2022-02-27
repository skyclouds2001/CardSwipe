// pages/collect/collect.js

import { get } from 'request';
import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast} from '../../utils/promise.js';

const app = getApp();

Page({

  data: {
    gift_data: [],
  },
  openid: '',

  onLoad: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    try {
      const openid = wx.getStorageSync('openid') || '';
      this.openid = openid;

      const res = await request({
        url: `/gift/collection/select/${openid}`,
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const collect = res.data?.data?.['collections:'] ?? [];

      // 添加is_on_delete属性
      if(collect)
        collect.map(v => v['is_on_delete'] = false);

      this.setData({
        gift_data: collect,
      });
    } catch (err) {
      console.log(err);
    }

    wx.hideLoading();
  },

  // 处理左滑及恢复事件：显示收藏按钮
  cx: -1,
  cy: -1,
  handleTouchStart(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    this.cx = x;
    this.cy = y;
  },
  handleTouchEnd(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let cx = this.cx;
    let cy = this.cy;
    this.cx = -1;
    this.cy = -1;

    const {index} = e.currentTarget.dataset;
    const {gift_data} = this.data;
    let flag = gift_data[index].is_on_delete;

    if(cx - x > 50 && Math.abs(y - cy) < 50 && !flag) { // 左滑
      gift_data[index].is_on_delete = true;
      this.setData({
        gift_data,
      });
    }
    if(x - cx > 50 && Math.abs(y - cy) < 50 && flag) { // 右滑
      gift_data[index].is_on_delete = false;
      this.setData({
        gift_data,
      });
    }
  },

  // 删除收藏事件
  async handleDeleteCollection(e) {
    wx.showLoading({
      title: '操作中...',
      mask: true,
    });

    const {id, index} = e.currentTarget.dataset;
    const {gift_data} = this.data;
    gift_data[index].is_on_delete = false;

    try {

      const res = await request({
        url: `/gift/collection/delete/${this.openid}/${id}`,
        method: 'GET',
        data: {
          cid: id,
          openid: this.openid,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if(res.data?.success) {

        showToast({
          title: '删除成功',
          icon: 'success',
        });
        
        gift_data.splice(index, 1);
        app.globalData.collect = app.globalData.collect.filter(v !== id);

      } else {
        showToast({
          title: '删除失败',
          icon: 'error',
        });
      }

    } catch (err) {
      console.log(err);
    }

    this.setData({
      gift_data,
    });
    
    wx.hideLoading();
  },

  // 项目点击事件：未显示删除按钮跳转至详情页面，显示删除按钮隐藏删除按钮
  async handleCollectionInfo (e) {
    const {index} = e.currentTarget.dataset;
    const {gift_data} = this.data;
    const flag = gift_data[index].is_on_delete;

    if(!flag) {
      const {id} = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../../pages/info/info?id=${id}`,
      });
    } else {
      gift_data[index].is_on_delete = false;
      this.setData({
        gift_data,
      });
    }
  },
  
});
