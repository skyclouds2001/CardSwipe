// pages/mine/mine.js

import { getUserProfile } from '../../utils/promise.js';

Page({

  data: {
    // 头像链接
    imgurl: '../../images/defaultImg.jpg',
    // 昵称
    nickname: '点击登录',
    // 标记活跃的项
    isActive: -1,
    // 标记是否显示登录提示框
    showModal: false,
  },
  defaultImgUrl: '../../images/defaultImg.jpg',
  defaultNickname: '点击登录',
  hasUserInfo: false,

  onLoad: function () {
    try {
      
      const userinfo = wx.getStorageSync('userinfo');

      // 存在则直接设置数据|不存在则请求用户信息童叟预先设置默认值
      if(typeof userinfo === 'object') {
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl
        });
        this.hasUserInfo = true;
      } else {
        this.setData({
          showModal: true,
          imgurl: this.defaultImgUrl,
          nickname: this.defaultNickname,
        });
        this.hasUserInfo = false;
      }
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * @function
   * @description 点击登录响应
   * @returns {void}
   */
  handleLoad() {
    if(!this.hasUserInfo) {
      this.setData({
        showModal: true,
      });
      this.handleModal();
    }
  },

  /**
   * @function
   * @async
   * @description 模态框响应
   * @param {Event} e 事件回调函数参数
   * @returns {Promise<void>}
   */
  async handleModal(e) {
    // 获取性别信息
    const {sex} = wx.getStorageSync('userinfo') ?? {};

    const {flag} = e.currentTarget.dataset;
    // 允许获取则请求数据
    if(flag) {

      try {

        // 请求userinfo数据
        const res = await getUserProfile({
          desc: '获取个人头像及昵称'
        });

        // 提取userinfo有效数据
        const {userInfo} = res;
        const userinfo = {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          sex: sex,
        };

        // 设置data
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl,
          showModal: false,
        });

        // 设置存储
        wx.setStorageSync('userinfo', userinfo);

        this.hasUserInfo = true;

      } catch (err) {
        console.log(err);
      }

    } else {  // 否则使用默认头像替代

      this.setData({
        imgurl: this.defaultImgUrl,
        nickname: this.defaultNickname,
        showModal: false,
      });

      this.hasUserInfo = false;

    }

  },

});