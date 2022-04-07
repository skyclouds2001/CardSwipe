// pages/recommend/recommend.js

import { request } from '../../lib/request.js';
import { showToast } from '../../utils/promise.js';

Page({
  
  data: {
    tag: [],
    gift: {},
    STATE: false,  // 记录分页：false代表选择标签页，true代表礼物页
  },
  openid: '',

  onLoad: function () {

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

  onHide: function () {

    // 切页重置：STATE重置为false即重置至首页；tag 重置为未选择状态
    const {tag} = this.data;
    tag.forEach(v => v.is_selected = false);
    setTimeout(() => {
      this.setData({
        STATE: false,
        tag,
      });
    }, 500);

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

    // 提交信息并获取礼物列表
    const {data} = await request({
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

    if(data.data?.['gift_rank:']) {
      
      // 提交成功提示
      showToast({
        title: '提交成功',
        icon: 'success',
      });

      // 跳转礼物信息页 & 提取记录礼物信息
      setTimeout(() => {
        this.setData({
          gift: data.data['gift_rank:'].filter(v => Boolean(v.url)),
          STATE: true,
        });
      }, 1500);
      
    } else {
      showToast({
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
      '桌游', '影视', '艺术', '网游', '睡觉', 
      '美食', '追星', '美丽', '游戏', '读书',
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

});
