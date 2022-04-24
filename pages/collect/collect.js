// pages/collect/collect.js

import { request } from '../../lib/request.js';
import { showToast } from '../../utils/promise.js';

/**
 * @typedef Gift
 * @type {Object}
 * @property {Number} id - 礼物id
 * @property {String} title - 礼物名称
 * @property {String} tag - 礼物标签
 * @property {String} url - 礼物图片链接
 * @property {Number} boylike - 礼物男性喜爱人数
 * @property {Number} girllike - 礼物女性喜爱人数
 * @property {Number} price - 礼物价格
 * @property {String} des - 礼物描述
 * @property {Number} progress - 礼物喜爱人数比例
 */

const app = getApp();

Page({

  data: {
    /**
     * @type {Gift[]}
     */
    gift_data: [],
  },
  openid: '',

  onLoad: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    try {
      const openid = wx.getStorageSync('openid') ?? '';
      this.openid = openid;

      const {data} = await request({
        url: `/gift/collection/select/${openid}`,
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const collect = data?.data?.['collections:'] ?? [];

      const TITLE_LENGTH = 25;
      // 添加is_on_delete属性
      if(collect)
        collect.forEach(v => {
          v.title = Array.from(v.title.trim()).length > TITLE_LENGTH ? v.title.trim().substr(0, TITLE_LENGTH) + '...' : v.title.trim();
          v.tag = v.tag?.trim()?.replaceAll(/、|，/g, ' ') ?? '暂无标签';
          v['is_on_delete'] = false;
        });

      this.setData({
        gift_data: collect,
      });
    } catch (err) {
      console.info(err);
    }

    wx.hideLoading();
  },

  /** 
   * 处理左滑及右滑事件：显示收藏按钮
   */ 
  cx: -1,
  cy: -1,
  /**
   * @function
   * @param {Event} e 事件回调函数参数
   * @returns {void}
   */
  handleTouchStart(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    this.cx = x;
    this.cy = y;
  },
  /**
   * @function
   * @param {Event} e 事件回调函数参数
   * @returns {void}
   */
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

  /**
   * @function
   * @async
   * @description 删除收藏事件
   * @param {Event} e 
   * @returns {Promise<void>}
   */
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

      wx.hideLoading();
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
      console.info(err);
    }

    this.setData({
      gift_data,
    });
  },

  /**
   * @function
   * @async
   * 项目点击事件
   * - 未显示删除按钮跳转至详情页面
   * - 显示删除按钮隐藏删除按钮
   * @param {Event} e 
   * @returns {Promise<void>}
   */
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
