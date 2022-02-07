// pages/collect/collect.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {
    gift_data: [
      {
        gift_id: 99216,
        gift_name: "西瓜",
        gift_tag: "水果",
        gift_img_src: "../../images/1.jpg",
        is_on_delete: false
      },
      {
        gift_id: 99209,
        gift_name: "西瓜",
        gift_tag: "水果",
        gift_img_src: "../../images/1.jpg",
        is_on_delete: false
      },
    ]
  },
  openid: '',

  onLoad: async function (options) {
    try {
      const openid = wx.getStorageSync('openid') || '';
      this.openid = openid;

      const res = await request({
        url: '/gift/gift/selectCollectGift',
        method: 'GET',
        data: {
          openid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      console.log(res.data);
  
      // this.setData({
      //   gift_data: {}
      // });
    } catch (err) {
      console.log(err);
    }
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

    if(cx - x > 50 && Math.abs(y - cy) < 50 && !flag) {
      gift_data[index].is_on_delete = true;
      this.setData({
        gift_data
      });
    }
    if(x - cx > 50 && Math.abs(y - cy) < 50 && flag) {
      gift_data[index].is_on_delete = false;
      this.setData({
        gift_data
      });
    }
  },

  // 删除收藏事件
  async handleDeleteCollection(e) {
    const {id} = e.currentTarget.dataset;
    const res = await request({
      url: `/gift/collection/delete/${this.openid}/${id}`,
      method: 'GET',
      data: {
        cid: id,
        openid: this.openid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    console.log(res.data);
  },

  // 项目点击事件：未显示删除按钮跳转至详情页面，显示删除按钮隐藏删除按钮
  async handleCollectionInfo (e) {
    const {index} = e.currentTarget.dataset;
    const flag = this.data.gift_data[index].is_on_delete;

    if(flag) {} else {}
  },
})
