// pages/info/info.js

import { request } from '../../lib/request.js';
import { showToast } from '../../utils/promise.js';

const app = getApp();

Page({

  data: {
    gift: {},
  },
  openid: '',

  onLoad: async function (options) {
    // 获取openid
    const openid = wx.getStorageSync('openid');
    this.openid = openid;

    // 提取礼物id
    const {id} = options;

    try {

      // 请求获取礼物信息
      const {data} = await request({
        url: `/gift/gift/getGiftById/${id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // 请求失败抛出异常交由外部try-catch块处理
      if(!data.success) {
        throw new Error('网络异常');
      }

      // 请求成功则处理并设置礼物信息
      const {gift} = data.data;

      // 设置收藏信息
      gift['is_collect'] = app.globalData.collect.includes(parseInt(id));

      // 去除标签分隔符，以空格替代
      gift.tag = gift.tag.replaceAll(/、|，/g, ' ');
      // 设置默认礼物图片
      gift.url = gift.url ?? './../../images/gift.png';

      // TODO：后续男女购买比例优化
      gift.boyprogress = (gift.boylike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);
      gift.girlprogress = (gift.girllike / ((gift.boylike + gift.girllike) / (gift.progress / 100)) * 100).toFixed(0);

      this.setData({
        gift,
      });

    } catch (err) {
      console.info(err);
      showToast({
        title: '网络异常',
        icon: 'error',
      });
    }

  },

  // 响应收藏
  async handleCollectGift() {

    // 提取礼物信息
    let {gift} = this.data;

    // 请求更新数据
    if(!gift.is_collect) {  // 添加收藏

      // 请求添加收藏
      const res = await request({
        url: `/gift/collection/add/${this.openid}/${gift.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).catch(err => console.info(err));
      
      if(res.data?.success) {  // 请求成功

        // 显示请求成功信息
        showToast({
          title: '添加收藏成功',
          icon: 'success',
        });

        // 更新至page.data
        gift.is_collect = true;
        this.setData({
          gift,
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
      }).catch(err => console.info(err));
      
      if(res.data?.success) {
        showToast({
          title: '取消收藏成功',
          icon: 'success',
        });
        gift.is_collect = false;
        this.setData({
          gift,
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

  // 复制剪切板链接
  handleCopyClipboard (e) {
    const {gift} = this.data;
    if(gift.buyurl) {
      wx.setClipboardData({
        data: gift.buyurl,
      });
    }
  },

});
