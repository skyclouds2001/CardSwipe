// pages/add/add.js

import {request} from '../../lib/request.js';
import {showToast, chooseMedia, showModal, uploadFile} from '../../utils/promise.js';

Page({

  data: {
    /**
     * 提交的图片链接
     * @type {string}
     */
    imgurl: '',
  },

  /**
   * @function
   * @async
   * @description 提交礼物信息方法
   * @param {Event} e 事件回调函数参数
   * @returns {Promise<void>}
   */
  async submitGiftInfo(e) {
    const {value} = e.detail;

    // 检测输入是否合法
    for(var v in value) {
      if(value[v].trim().length === 0) {
        await showToast({
          title: '信息不能为空',
          icon: 'error',
        });
        return;
      }
    }

    // 提交礼物信息
    try{
      const { data: res } = await request({
        url: '/gift/gift/addGift',
        method: 'POST',
        data: {
          buyurl: value.gift_pos,
          des: value.gift_discribe,
          tag: value.gift_tags,
          title: value.gift_name,
          url: this.data.imgurl,
          price: value.gift_price,
        },
        header: {
          'content-type': 'application/json',
        },
      });

      if(res.success) {
        showToast({
          title: '提交成功！',
          icon: 'success',
        });
        setTimeout(() => {
          wx.switchTab({
            url: '../../pages/mine/mine',
          });
        }, 2000);
      } else {
        showToast({
          title: '提交失败！',
          icon: 'error',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * @function
   * @async
   * @description 上传图片
   * @returns {Promise<void>}
   */
  async handleUpdateImg() {
    try {
      // 选取图片
      const res = await chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
      });
      
      // 上传图片
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      const {data} = await uploadFile({
        filePath: res.tempFiles[0].tempFilePath,
        name: 'file',
        url: 'https://www.yangxiangrui.xyz:9092/eduoss/fileoss',
        timeout: 60000,
        header: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      wx.hideLoading();
      const info = JSON.parse(data);
      if(info.success) {
        showToast({
          title: '图片上传成功',
          icon: 'success',
        });
        this.setData({
          imgurl: info.data.url,
        });
      } else {
        showToast({
          title: '图片上传失败\n请稍后再试',
          icon: 'error',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 删除图片方法
  async handleRemoveImg() {
    try {
      const res = await showModal({
        title: '确认删除图片？',
        content: '',
        confirmText: '确认',
        cancelText: '再想想',
      });
      if(res.confirm) {
        this.setData({
          imgurl: '',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

});