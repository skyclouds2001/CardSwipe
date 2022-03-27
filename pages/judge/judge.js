// index.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {
  hideToast,
  showToast
} from '../../utils/promise.js';

const app = getApp();

Page({

  data: {
    // 礼物信息
    gift_list: [],
    // 礼物当前下标
    gift_index: 0,
    // 当前礼物
    gift: {},
    current: 0,
  },
  openid: '',
  token: '',
  page: 1,    // 用于礼物请求时所用的page：代表当前礼物所处的页数
  sex: 0,   // 记录礼物信息，0代表男性，1代表女性

  onLoad: async function () {

    // 获取openid与token及userinfo并保存
    const openid = wx.getStorageSync('openid');
    const userinfo = wx.getStorageSync('userinfo');
    const token = wx.getStorageSync('token');
    this.openid = openid ?? '';
    this.token = token ?? '';
    this.sex = Number(userinfo?.sex ?? 0);
    
    // 请求与保存礼物信息，请求与检查收藏信息
    await this.getGiftInfo();
    await this.getCollectInfo();
    await this.checkCollectSession();

  },

  onShow: function () {
    showToast({
      title: '右滑表示喜欢，左滑表示不喜欢',
      icon: 'none',
      duration: 3000,
    });
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

  // 获取与设置礼物信息方法
  async getGiftInfo() {

    try {

      // 请求获取礼物信息
      const {data} = await request({
        url: `/gift/gift/getGift/${this.openid}/${this.page}`,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        }
      });

      // 检测请求是否成功
      if(data.success === null) {

        // 更新page值
        this.page = this.page + 1;

        // 提取礼物信息并更新页面内容
        let gift = data.data?.['giftList:'];
        let {gift_list, gift_index} = this.data;
        // 存入gift数组
        gift_list = [...gift_list, ...gift];
        // 添加是否已收藏属性
        gift_list.forEach(v => v.is_collect = false);
        // 保存礼物数据
        this.setData({
          gift_list,
          gift: gift_list[gift_index],
        });

      } else {
        hideToast();
        showToast({
          title: '',
          icon: 'error',
        });
      }

    } catch (err) {
      console.info(err);
    }

  },

  // 获取与设置用户当前收藏信息
  async getCollectInfo() {

    try {

      const {data} = await request({
        url: `/gift/collection/select/${this.openid}`,
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const collect = data.data?.['collections:'];
      if(collect) {
        const collect_id = collect.map(v => v.id);
        app.globalData.collect = collect_id;
      } else {
        app.globalData.collect = [];
      }

    } catch (err) {
      console.info(err);
    }

  },

  // 更新收藏信息
  async checkCollectSession() {

    const {gift_list} = this.data;
    gift_list.forEach(v => v.is_collect = app.globalData.collect.includes(v.id));
    this.setData({
      gift_list,
    });
    
  },

  // 用户点击收藏响应
  async handleCollectGift() {

    // 显示加载信息
    wx.showLoading({
      title: '操作中...',
      mask: true,
    });

    // 更新至data对象
    let {gift_list, gift_index, gift} = this.data;

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

      // 关闭加载信息
      wx.hideLoading();
      
      if(res.data?.success) {  // 请求成功
        // 显示请求成功信息
        showToast({
          title: '添加收藏成功',
          icon: 'success',
        });
        // 更新至page.data
        gift_list[gift_index].is_collect = true;
        this.setData({
          gift_list,
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

      // 关闭加载信息
      wx.hideLoading();
      
      if(res.data?.success) {
        showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
        gift_list[gift_index].is_collect = false;
        this.setData({
          gift_list,
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

  // 预览图片效果
  handlePreviewImage(e) {
    const {url} = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
      current: url,
    });
  },

  // 监视current变化事件：更新gift数据，判断是否主动喜欢
  async handleChangeSwiperItem(e) {
    const current = e.detail.current;  // current变化后礼物index值
    const preview = this.data.gift_index;  // current变化前礼物index值
    const reason = e.detail.source.trim(); // current变化原因
    const id = this.data.gift.id;  // current变化前礼物id
    const SIZE = this.data.gift_list.length;  // 礼物列表长度
    
    this.setData({
      gift_index: current,
      gift: this.data.gift_list[current],
      current: this.data.current>current?current+2:current,
    });

    if(reason === 'touch' && (current < preview && current !== 0 && preview !== SIZE - 1 || preview === 0 && current === SIZE - 1)) {
      showToast({
        title: '已选择喜欢该商品',
        icon: 'none',
        duration: 1000,
      });
      await request({
        url: `/gift/gift/${this.sex ? 'girl' : 'boy'}like/${id}`,
        method: 'PUT',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": `${this.token}`,
        },
        data: {
          token: this.token,
        },
      });
    } else if (reason === 'touch' && (current > preview && preview !== 0 && current !== SIZE - 1 || current === 0 && preview === SIZE - 1)) {
      showToast({
        title: '已选择不喜欢该商品',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  
});
