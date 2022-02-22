// index.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    // 礼物信息
    gift_info: {},
  },
  openid: '',
  page: 1,    // 用于礼物请求时所用的page 
  index: 0,     // 用于礼物数组中下标记录
  gift: [],
  collect: [],

  onLoad: async function () {
    const openid = wx.getStorageSync('openid');

    await showToast({
      title: '为了更好的使用体验，请先登录',
      icon: 'none',
    });
    await showToast({
      title: '右滑表示喜欢，左滑表示不喜欢',
      icon: 'none',
    });

    this.openid = openid;
    this.page = 1;
    this.index = 0;
    
    await this.getGiftInfo();
    await this.getCollectInfo();
    await this.checkCollectSession();
  },

  onHide: function () {
    if(this.collect)
      wx.setStorageSync('collect', this.collect);
  },

  onUnload: function () {
    if(this.collect)
      wx.setStorageSync('collect', this.collect);
  },

  onShareAppMessage: function () {
    return {
      title: '从心礼选',
      query: '../../pages/index/index',
      imageUrl: 'https://edu-1014.oss-cn-beijing.aliyuncs.com/2022/02/08/8c1e0e85b4c341639e93d34d7f1a5306share-img.jpg',
    };
  },

  onAddToFavorites: function () {
    return {
      title: '从心礼选',
      imageUrl: 'https://edu-1014.oss-cn-beijing.aliyuncs.com/2022/02/08/8c1e0e85b4c341639e93d34d7f1a5306share-img.jpg',
      query: '../../pages/index/index',
    };
  },

  onShareTimeline: function () {
    return {
      title: '从心礼选',
      query: '../../pages/index/index',
    };
  },

  // 获取礼物信息方法
  async getGiftInfo() {

    try {

      // 请求获取礼物信息
      const {data} = await request({
        url: `/gift/gift/getGift/${this.openid}/${this.page}`,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        }
      });

      if(data?.success === null) {
        this.page = this.page + 1;

        // 提取礼物信息并更新页面内容
        const gift = data?.data?.['giftList:'];
        // 存入gift数组
        this.gift = [...this.gift, ...gift];

        let gift_info = gift[this.index];
        gift_info['is_collect'] = false;
        this.setData({
          gift_info,
        });
      }

    } catch (err) {
      console.log(err);
    }

  },

  // 获取用户当前收藏信息
  async getCollectInfo() {

    const openid = this.openid;

    try {

      const res = await request({
        url: `/gift/collection/select/${openid}`,
        method: 'GET',
        data: {
          openid,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const collect = res?.data?.data?.['collections:'];
      if(collect) {
        const collect_id = collect?.map(v => v.id);

        this.collect = collect_id;
        wx.setStorageSync('collect', collect_id);
      } else {
        wx.setStorageSync('collect', []);
      }

    } catch (e) {
      console.log(e);
    }

  },

  // 更新收藏信息
  async checkCollectSession() {

    const gift = this.data.gift_info;
    if(this.collect.includes(gift.id)) {
      gift.is_collect = true;
      this.setData({
        gift_info: gift,
      });
    }
    
  },

  // 用户点击收藏响应
  async handleCollect() {

    // 记录是否已收藏
    const {gift_info} = this.data;
    const flag = !gift_info.is_collect;

    // 请求更新数据&维护至collect数组
    const res = await request({
      url: `/gift/collection/${flag ? 'add' : 'delete'}/${this.openid}/${gift_info.id}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if(res.data.success) {
      await showToast({
        title: `${flag ? '添加' : '删除'}收藏成功`,
        icon: 'success',
      });

      // 更新收藏信息至collect数组
      flag ? this.collect.push(gift_info.id) : this.collect.splice(this.collect.indexOf(gift_info.id), 1);

      // 更新是否已收藏信息至gift对象
      gift_info.is_collect = !gift_info.is_collect;
      this.setData({
        gift_info
      });
    } else {
      await showToast({
        title: `${flag ? '添加' : '删除'}收藏失败
                请稍后再试`,
        icon: 'error',
      });
    }
    
  },

  // 处理左滑右滑
  cx: -1,
  cy: -1,
  async handleTouchStart(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    this.cx = x;
    this.cy = y;
  },
  async handleTouchEnd(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let cx = this.cx;
    let cy = this.cy;
    this.cx = -1;
    this.cy = -1;

    if (Math.abs(x - cx) > 50 && Math.abs(y - cy) < 50) {
      // 左滑：不喜欢 刷新礼物
      // 右滑：喜欢 刷新礼物
      
      // 自增礼物下标
      this.index = this.index + 1;

      // 检测礼物下标是否超出范围：若超出重新请求数据
      if(this.index === this.gift.length) {
        // 页数自增
        this.page = this.page + 1;
        // 获取礼物信息
        await this.getGiftInfo();
      }

      // 获取礼物信息并添加收藏属性，随后设置进data
      const gift = this.gift[this.index];
      if(!gift.hasOwnProperty('is_collect')) {
        gift['is_collect'] = this.collect.includes(gift.id);
      }
      this.setData({
        gift_info: gift,
      });
    }

    if(cx - x > 50 && Math.abs(y - cy) < 50) {
      // 左滑：不喜欢 删除该礼物

      // 提取礼物id
      const {id} = e.currentTarget.dataset;
      // 查找该礼物对应下标
      const index = this.gift.findIndex(v => v.id === id);
      // 删除该礼物
      this.gift.splice(index, 1);

      showToast({
        title: '已选择不喜欢该商品',
        icon: 'none',
      });
    }

    if(x - cx > 50 && Math.abs(y - cy) < 50) {
      // 右滑：喜欢
      showToast({
        title: '已选择喜欢该商品',
        icon: 'none',
      });
    }

  },

  // 预览图片效果
  handlePreviewImage(e) {
    const {url} = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
      current: url,
    });
  },
  
});
