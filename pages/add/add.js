// pages/add/add.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast} from '../../utils/promise.js';

Page({

  data: {

  },

  onLoad: function (options) {

  },

  // 提交礼物信息方法
  async submitGiftInfo(e) {
    const {value} = e.detail;

    // 检测输入是否合法
    for(var v in value) {
      if(value[v].trim().length === 0) {
        showToast({
          title: '信息不能为空',
          icon: 'error'
        });
        return;
      }
    }
    if(!Number(value.gift_price)) {
      showToast({
        title: '价格必须为数值',
        icon: 'error'
      });
      return;
    }

    // 提交礼物信息
    try{
      await request({
        url: 'gift/gift/addGift',
        data: {
          tag: value
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  // 上传图片方法
  handleUpdateImg() {
    // 图片云存储？
  }
})