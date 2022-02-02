// pages/mine/mine.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {
    // 下部选项数组
    menu_item: [
      {
        iconSrc: "../../icons/shoucang.png",
        iconActiveSrc: "../../icons/shoucang _click.png",
        text: "我的收藏",
        isActive: false,
        url: "../../pages/collect/collect"
      },
      // {
      //   iconSrc: "../../icons/wode.png",
      //   iconActiveSrc: "../../icons/wode_click.png",
      //   text: "我的朋友",
      //   isActive: false,
      //   url: "../../pages/friend/friend"
      // },
      {
        iconSrc: "../../icons/xinfeng.png",
        iconActiveSrc: "../../icons/xinfeng_click.png",
        text: "问题反馈",
        isActive: false,
        url: "../../pages/problem/problem"
      },
      {
        iconSrc: "../../icons/shaogouwu.png",
        iconActiveSrc: "../../icons/shaogouwu_click.png",
        text: "礼物添加",
        isActive: false,
        url: "../../pages/add/add"
      }
    ],
    // 头像链接
    imgurl: '../../images/1.jpg',
    // 昵称
    nickname: '昵称'
  },

  onLoad: function (options) {
    try {
      const userinfo = wx.getStorageSync('userinfo') || [];
      if(userinfo.length !== 0) {
        this.setData({
          nickname: userinfo.nickName,
          imgurl: userinfo.avatarUrl
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 点击选项响应
  handleOnChange(e) {
    const {id} = e.currentTarget.dataset;
    const {type} = e;
    let {menu_item} = this.data;

    if(type === "touchstart")
      menu_item[id].isActive = true;
    if(type === "touchend")
      menu_item[id].isActive = false;
    
    this.setData({
      menu_item
    });
  }
})