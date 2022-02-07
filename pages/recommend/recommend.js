// pages/recommend/recommend.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  
  data: {
    tag: [
    ],
    icon: '../../icons/shoucang.png',
    icon_click: '../../icons/shoucang _click.png'
  },

  
  onLoad: function (options) {
    this.loadTag();
  },

  // 提交标签
  handleSubmit() {},

  // 处理点击收藏
  handleSelect(e) {
    const {id} = e.currentTarget.dataset;
    const {tag} = this.data;

    const index = tag.findIndex(item => item.id === id);
    tag[index].is_selected = !tag[index].is_selected;

    this.setData({
      tag
    });
  },

  // 标签初始化
  loadTag() {
    const tag_name = [
      '运动', '旅行', '收藏', '学习', '独处', 
      '桌游', '影视剧', '艺术', '网游', '睡觉', 
      '美食', '追星', '美丽', '智力游戏', '读书'
    ];
    const tag_l = [
      10, 37, 70, 5, 30, 
      60, 75, 35, 13, 65, 
      40, 12, 32, 50, 10
    ];
    const tag_t = [
      5, 10, 20, 25, 35, 
      42, 45, 50, 54, 61, 
      65, 69, 75, 80, 86
    ];
    const num = 15;
    let tag = [];

    for(let i = 0; i < num; ++i) {
      tag.push({
        title: tag_name[i],
        l: tag_l[i] + '%',
        t: tag_t[i] + '%',
        is_selected: false,
        id: i
      });
    }

    this.setData({
      tag
    });
  }
})