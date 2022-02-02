// pages/add/add.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast, chooseMedia} from '../../utils/promise.js';

Page({
  data: {
    imgurl: ''
  },

  // 提交礼物信息方法
  async submitGiftInfo(e) {
    const {value} = e.detail;

    // 检测输入是否合法
    for(var v in value) {
      if(value[v].trim().length === 0) {
        await showToast({
          title: '信息不能为空',
          icon: 'error'
        });
        return;
      }
    }

    // 提交礼物信息
    try{
      const res = await request({
        url: '/gift/gift/addGift',
        method: 'POST',
        data: {
          buyurl: value.gift_pos,
          des: value.gift_discribe,
          tag: value.gift_tags,
          title: value.gift_name,
          url: this.data.imgurl,
          price: value.gift_price
        },
        header: {
          'content-type': 'application/json'
        }
      });

      const {data} = res;
      if(data.success) {
        await showToast({
          title: '提交成功！',
          icon: 'success'
        });
        wx.navigateTo({
          url: '../../pages/mine/mine',
        });
      } else {
        await showToast({
          title: '提交失败！',
          icon: 'error'
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 上传图片方法
  async handleUpdateImg() {
    // 检测是否已存在图片
    // 图片只可上传一次
    if(this.data.imgurl) {
      await showToast({
        title: '只可上传一张图片',
        icon: 'error'
      });
      return;
    }

    try {
      // 选取图片
      const res = await chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });
      
      // 上传图片
      wx.uploadFile({
        filePath: res.tempFiles[0].tempFilePath,
        name: 'file',
        url: 'https://www.yangxiangrui.xyz:9092/eduoss/fileoss',
        timeout: 60000,
        header: {
          "Content-Type": "multipart/form-data",
        },
        success: async (res) => {
          await showToast({
            title: '图片上传成功',
            icon: 'success'
          });
          const data = JSON.parse(res.data);
          this.setData({
            imgurl: data.data.url
          });
        },
        fail: (err) => {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
})