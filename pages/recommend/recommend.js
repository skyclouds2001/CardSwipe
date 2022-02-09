// pages/recommend/recommend.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import { showToast } from '../../utils/promise.js';

Page({
  data: {
    tag: [],
    icon: '../../icons/shoucang.png',
    icon_click: '../../icons/shoucang_click.png',
    gift: {},
    STATE: false,  // 记录分页：false代表选择标签页，true代表礼物页
  },
  openid: '',

  
  onLoad: function (options) {
    // 加载标签
    this.loadTag();

    // 提取openid
    const openid = wx.getStorageSync('openid');
    if(openid) {
      this.openid = openid;
    }

    // 强制重置初始为信息提交页
    this.setData({
      STATE: false,
    });
  },

  // 提交标签
  async handleSubmit() {
    // 提取标签
    const {tag} = this.data;
    let tags = [];
    tag.forEach(v => v.is_selected ? tags.push(v.title) : '');

    // 获取性别
    const userinfo = wx.getStorageSync('userinfo');
    const sex = userinfo.gender === 0 ? '男' : '女';

    // 获取openid
    const openid = this.openid;

    const res = await request({
      url: '/gift/gift/getTopByTag',
      method: 'POST',
      data: {
        openid,
        sex,
        tags,
      },
      header: {
        'Content-Type': 'application/json',
      },
    });

    if(res.data.data['gift_rank:']) {
      
      // 提交成功提示
      await showToast({
        title: '提交成功',
        icon: 'success',
      });

      // 跳转礼物信息页 & 提取记录礼物信息
      setTimeout(() => {
        const gift = res.data.data['gift_rank:'];
        this.setData({
          gift,
          STATE: true,
        });
      }, 1500);
      
    } else {
      await showToast({
        title: '提交失败',
        icon: 'error',
      });
    }
  },

  // 处理点击收藏
  handleSelect(e) {
    const {id} = e.currentTarget.dataset;
    const {tag} = this.data;

    const index = tag.findIndex(item => item.id === id);
    tag[index].is_selected = !tag[index].is_selected;

    this.setData({
      tag,
    });
  },

  // 礼物点击跳转
  handleJump(e) {
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../pages/info/info?id=${id}`,
    });
  },

  // 标签初始化
  loadTag() {
    const tag_name = [
      '运动', '旅行', '收藏', '学习', '独处', 
      '桌游', '影视剧', '艺术', '网游', '睡觉', 
      '美食', '追星', '美丽', '智力游戏', '读书',
    ];
    const tag_l = [
      10, 37, 70, 5, 30, 
      60, 75, 35, 13, 65, 
      40, 12, 32, 50, 10,
    ];
    const tag_t = [
      5, 10, 20, 25, 35, 
      42, 45, 50, 54, 61, 
      65, 69, 75, 80, 86,
    ];
    const num = 15;
    let tag = [];

    for(let i = 0; i < num; ++i) {
      tag.push({
        title: tag_name[i],
        l: tag_l[i] + '%',
        t: tag_t[i] + '%',
        is_selected: false,
        id: i,
      });
    }

    this.setData({
      tag,
    });
  },
})