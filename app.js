/**
 * @file CardSwipe
 * @author CSY<skyclouds2001@163.com>
 * @license MIT
 * @copyright 15th Jan 2022
 * @version 1.1.0
 */

import { request } from './lib/request.js';
import { login, showToast } from './utils/promise.js';

/**
 * @typedef Gift
 * @type {Object}
 */

App({

  onLaunch: async function () {
    // colorui 库导航栏预设代码
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    });
    
    // 换取openid和token
    try {
      const {code} = await login({
        timeout: 10000,
      });
      const {data: res} = await request({
        url: '/login/wx',
        method: 'POST',
        data: {
          code,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if(res?.data?.user) {
        const {token, openid} = res.data.user;
        wx.setStorageSync('token', token);
        wx.setStorageSync('openid', openid);
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: error,
        icon: 'error',
        mask: true,
        duration: 2500,
      });
    }
    
  },

  onUnhandledRejection: function (e) {
    console.error(e.reason);
  },

  /**
   * @global
   */
  globalData: {
    StatusBar: 20,
    Custom: {
      bottom: 56,
      height: 32,
      left: 281,
      right: 367,
      top: 24,
      width: 86,
    },
    CustomBar: 60,
    /**
     * @type {Array<Gift>} - 收藏的礼物
     */
    collect: [],
  },

});
