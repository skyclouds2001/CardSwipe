// index.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({

  data: {
    // 礼物信息
    gift_info: {},
    // star图标路径
    iconsrc: "../../icons/shoucang.png",
    iconsrc_click: "../../icons/shoucang _click.png",
  },
  openid: '',
  page: 1,
  index: 0,
  gift: [],
  collect: [],

  onLoad: async function () {
    // 先检测有无用户信息
    // 没有表示尚未登录
    const openid = wx.getStorageSync('openid');

    if(!openid) {
      await showToast({
        title: '为了更好的使用体验，请先登录',
        icon: 'none',
      });

      setTimeout(() => {
        wx.navigateTo({
          url: '../../pages/login/login',
        });
      }, 1500);
    } else {
      await showToast({
        title: '右滑表示喜欢，左滑表示不喜欢',
        icon: 'none',
      });

      this.openid = openid;
      this.page = 1;
      this.index = 0;
      
      await this.getCollectInfo();
      await this.getGiftInfo();
      await this.checkCollectSession();
    }
  },

  onHide: function () {
    wx.setStorageSync('collect', this.collect);
  },

  onUnload: function () {
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
      const res = await request({
        url: `/gift/gift/getGift/${this.openid}/${this.page}`,
        method: 'GET',
        data: {
          openid: this.openid,
          page: this.page,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        }
      });
      this.page = this.page + 1;

      // 提取礼物信息并更新页面内容
      const gift = res?.data?.data['giftList:'];
      // 存入gift数组
      this.gift = [...this.gift, ...gift];

      let gift_info = gift[this.index];
      gift_info['is_collect'] = false;
      this.setData({
        gift_info,
      });
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
  
      const collect = res?.data?.data['collections:'] || [];
      const collect_id = collect.map(v => v.id);

      this.collect = collect_id;
      wx.setStorageSync('collect', collect_id);

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

    // 更新信息至data对象
    const {gift_info} = this.data;
    gift_info.is_collect = !gift_info.is_collect;
    this.setData({
      gift_info
    });

    // 请求更新数据
    if(gift_info.is_collect) {

      this.collect.push(gift_info.id);

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

      this.collect.splice(this.collect.indexOf(gift_info.id), 1);

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
        await showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
      } else {
        await showToast({
          title: '取消收藏失败\n请稍后再试',
          icon: 'error',
        });
      };

    }
  },

  // 处理左滑右滑
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
