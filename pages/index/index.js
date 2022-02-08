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

  onLoad: function () {
    // 先检测有无用户信息
    // 没有表示尚未登录
    const openid = wx.getStorageSync('openid');
    this.openid = openid;
    this.page = 1;

    if(!openid) {
      wx.navigateTo({
        url: '../../pages/welcome/welcome',
      });
    } else {
      this.getGiftInfo();
    }
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

  // 用户点击收藏响应
  handleStarOnClick(e) {
    // 更新至data对象
    const {gift_info} = this.data;
    const {is_collect} = gift_info;
    gift_info.is_collect = !is_collect;
    this.setData({
      gift_info
    });
  },

  // 处理左滑右滑时间
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
      // 左滑：不喜欢 删除该礼物并刷新礼物
      // 右滑：喜欢 保留该礼物并刷新
      
      // 自增礼物下标
      this.index = this.index + 1;

      // 检测礼物下标是否超出范围：若超出重新请求数据
      if(this.index === this.gift.length) {
        // 页数自增
        this.page = this.page + 1;
        // 获取礼物信息
        this.getGiftInfo();
      }

      // 获取礼物信息并添加收藏属性，随后设置进data
      const gift = this.gift[this.index];
      if(!gift.hasOwnProperty('is_collect')) {
        gift['is_collect'] = false;
      }
      this.setData({
        gift_info: gift, 
      });
    }
    if(cx - x > 50 && Math.abs(y - cy) < 50) {
      // 左滑：不喜欢 删除该礼物并刷新礼物

      // 提取礼物id
      const {id} = e.currentTarget.dataset;
      // 查找该礼物对应下标
      const index = this.gift.findIndex(v => v.id === id);
      // 删除该礼物
      this.gift.splice(index, 1);
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
