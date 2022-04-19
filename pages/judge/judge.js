/**
 * @file 礼物评测 judge
 */

import { request } from '../../lib/request.js';
import { showToast } from '../../utils/promise.js';

/**
 * @type {App} app
 */
const app = getApp();

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

Page({

  data: {

    /**
     * @type {Array<Gift>}
     * @description 轮播图礼物信息
     */
    gift_list: [],

    /**
     * @type {number}
     * @description 礼物当前下标
     */
    gift_index: 0,

    /**
     * @type {Gift}
     * @description 当前礼物
     */
    gift: {},

  },

  /**
   * @type {string}
   */
  openid: '',

  /**
   * @type {string}
   */
  token: '',

  /**
   * @type {number}
   * @description 性别信息，0代表男性，1代表女性
   */
  gender: 0,

  /**
   * @constant
   * @default
   * @readonly
   * @type {number}
   * @description 单次请求的礼物数量
   */
  DEFAULT_REQUEST_GIFT_SIZE: 10,

  /**
   * @constant
   * @default
   * @readonly
   * @type {number}
   * @description 轮播图中最少的礼物数量（应为奇数）
   */
  DEFAULT_SWIPER_GIFT_NUMBER: 7,

  onLoad: function () {

    // 获取openid与token及gender并保存
    const openid = wx.getStorageSync('openid');
    const gender = wx.getStorageSync('gender');
    const token = wx.getStorageSync('token');
    this.openid = openid;
    this.token = token;
    this.gender = Number(gender);
    // 声明临时存储礼物与收藏信息的数组
    let gift = [];
    let collect = [];

    // 并行获取礼物信息及用户收藏信息
    Promise.allSettled([
      this.getGiftInfo(),
      this.getCollectInfo(),
    ]).then(([giftS, collectS]) => {
      // 保存礼物及收藏信息
      app.globalData.collect = (collect = collectS.value);
      gift = giftS.value;
      // 对礼物进行预处理
      gift.forEach(v => {
        v.is_collect = collect.includes(v.id);
        v.url ??= './../../images/gift.png';
        v.des ??= '暂无';
      });
    }).then(() => {
      // 初始化礼物信息
      let list = [];
      list.push({...gift[0]});
      list[0].key = String(gift[0].id);
      for(let i = 1; i < gift.length; ++i) {
        list.push({...gift[i]});
        list.unshift({...gift[i]});
        list[0].key = 'p' + gift[i].id;
        list[list.length - 1].key = 'c' + gift[i].id;
      }

      // 存储礼物信息
      this.setData({
        gift_list: list,
        gift_index: ~~(list.length / 2),
        gift: list[~~(list.length / 2)],
      });
      this.previous = ~~(list.length / 2);

    }).catch(error => {
      console.log(error);
      showToast({
        title: '网络异常',
        icon: 'error',
        mask: true,
      });
    });

  },

  onShow: function () {

    showToast({
      title: '右滑表示喜欢，左滑表示不喜欢',
      icon: 'none',
      duration: 3000,
    });

  },

  /**
   * @function
   * @async
   * @description 获取礼物信息，并对返回信息有效性感觉id进行检验
   * @returns {Promise<Array<Gift>>} 返回给定数量的随机的礼物
   */
  async getGiftInfo () {

    try {
      // 请求获取礼物信息
      const {data: res} = await request({
        url: `/gift/gift/getRandomGifts/${this.DEFAULT_REQUEST_GIFT_SIZE}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      // 检测请求是否成功
      if(res.success) {
        // 存储礼物信息：同时简单根据id是否存在进行筛选
        return res.data.randomGifts.filter(v => v?.id);
      } else {
        throw new Error('请求礼物信息失败');
      }

    } catch (error) {
      console.log(error);
    }

  },

  /**
   * @function
   * @async
   * @description 获取用户的收藏信息
   * @returns {Promise<Array<Number>>} 用户的收藏id
   */
  async getCollectInfo () {

    try {
      const {data: res} = await request({
        url: `/gift/collection/select/${this.openid}`,
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return res.data?.['collections:']?.filter(v => v?.id)?.map(v => v.id) ?? [];
    } catch (error) {
      console.log(error);
      return Promise.reject();
    }

  },

  /**
   * @function
   * @async
   * @description 用户点击收藏的响应
   * @returns {void}
   */
  async handleCollectGift () {

    // 显示加载信息
    wx.showLoading({
      title: '操作中...',
      mask: true,
    });

    // 更新至data对象
    let {gift_list, gift_index, gift: gift_item} = this.data;

    try {
      if(!gift_item.is_collect) {  // 未收藏：添加收藏

        // 请求添加收藏
        const {data: res} = await request({
          url: `/gift/collection/add/${this.openid}/${gift_item.id}`,
          method: 'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        // 关闭加载信息
        wx.hideLoading();
        
        if(res.success) {  // 请求成功
          // 显示请求成功信息
          showToast({
            title: '添加收藏成功',
            icon: 'success',
          });
          // 更新至page.data
          gift_list[gift_index].is_collect = true;
          gift_item.is_collect = true;
          this.setData({
            gift_list,
            gift: gift_item,
          });
          // 更新至app.globalData
          app.globalData.collect.push(gift_item.id);
        } else {  // 请求失败
          // 显示错误提示信息
          showToast({
            title: '添加收藏失败',
            icon: 'error',
          });
        }

      } else {  // 收藏：取消收藏

        const {data} = await request({
          url: `/gift/collection/delete/${this.openid}/${gift_item.id}`,
          method: 'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        // 关闭加载信息
        wx.hideLoading();
        
        if(data.success) {
          showToast({
            title: '取消收藏成功',
            icon: 'success',
          });
          // 更新至page.data
          gift_list[gift_index].is_collect = false;
          gift_item.is_collect = false;
          this.setData({
            gift_list,
            gift: gift_item,
          });
          // 更新至app.globalData
          app.globalData.collect.filter(v => v !== gift_item.id);
        } else {
          showToast({
            title: '取消收藏失败',
            icon: 'error',
          });
        }

      }
    } catch (error) {
      console.log(error);
    }
    
  },

  /**
   * @function
   * @description 预览图片效果
   * @param {Event} e
   * @returns {void}
   */
  handlePreviewImage (e) {
    const {url} = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
      current: url,
    });
  },

  /**
   * @function
   * @async
   * @description 处理轮播图滑动方法
   * @param {Event} e
   * @returns {void}
   */
  async handleAnimationFinish (e) {
    const {current: cur} = e.detail;
    const {previous: pre} = this;
    let {gift_list: list, gift} = this.data;

    if(pre > cur) {
      list.splice(cur + 1, (pre - cur) * 2);
      this.handleLike(gift.id);
    } else if (pre < cur) {
      list.splice(cur - (cur - pre) * 2, (cur - pre) * 2);
      this.handleDislike(gift.id);
    } else {
      return;
    }

    this.setData({
      gift_list: list,
      gift: list[~~(list.length / 2)],
      gift_index: ~~(list.length / 2),
    });
    this.previous = ~~(list.length / 2);
    setTimeout(() => {
      this.setData({
        gift_index: ~~(list.length / 2),
      });
    }, 1000);

    // 礼物数量不足时添加礼物
    if(this.DEFAULT_SWIPER_GIFT_NUMBER >= list.length) {
      const {collect} = app.globalData;
      const gift = await this.getGiftInfo();
      gift.forEach(v => {
        v.is_collect = collect.includes(v.id);
        v.url ??= './../../images/gift.png';
        v.des ??= '暂无';
      });

      const {gift_list: list} = this.data;
      for(let i = 0; i < gift.length; ++i) {
        list.push({...gift[i]});
        list.unshift({...gift[i]});
        list[0].key = 'p' + gift[i].id;
        list[list.length - 1].key = 'c' + gift[i].id;
      }

      this.setData({
        gift_list: list,
        gift: list[~~(list.length / 2)],
        gift_index: ~~(list.length / 2),
      });
      this.previous = ~~(list.length / 2);
      setTimeout(() => {
        this.setData({
          gift_index: ~~(list.length / 2),
        });
      }, 1000);
    }
  },

  /**
   * @type {number}
   * @description 标记之前礼物的下标
   */
  previous: 0,

  /**
   * @function
   * @async
   * @description 处理喜欢礼物
   * @param {number} id - 礼物id
   * @returns {void}
   */
  async handleLike (id) {
    showToast({
      title: `您已选择喜欢该礼物`,
      icon: 'none',
    });

    const {gender} = this;
    try {
      await request({
        url: `/gift/gift/${gender === 0 ? 'boy' : 'girl'}like/${id}`,
        method: 'PUT',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": this.token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * @function
   * @async
   * @description 处理不喜欢礼物
   * @param {number} id - 礼物id
   * @returns {void}
   */
  async handleDislike (id) {
    showToast({
      title: `您已选择不喜欢该礼物`,
      icon: 'none',
    });
  },

  /**
   * @description 礼物图片显示失败处理，重置礼物信息为默认图片
   * @param {Event} e 
   * @returns {boolean}
   */
  handleImageLoadFail(e) {
    const {id} = e.currentTarget.dataset;
    const {gift_list} = this.data;
    gift_list.forEach(v => v.id === id ? v.url = './../../images/gift.png' : '');
    this.setData({
      gift_list,
    });
    return false;
  },

});
