// pages/list/list.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {} from '../../utils/promise.js';

Page({

  data: {
    // 渲染爱好下拉框所用
    habitChoice: [ "运动", "读书", "旅行", "美食", "收藏", "艺术", "桌游", "网游", "智力游戏", "学习", "美丽", "帅气" ],
    // 实现下拉框功能用
    isSelectedSex: false,
    isSelectedHabit: false,
    // 礼物信息
    giftInfo: [
      // {
      //   giftName: "礼物",
      //   giftLoveNum: 23,
      //   giftImgSrc: "../../images/1.jpg"
      // }
    ],

    // 记录选择的身份，仅可单选  默认0.1.2
    chooseSituation: 0,
    // 记录选择的性别，仅可单选  默认0男性 1女性
    chooseSex: 0,
    // 记录选择的爱好，仅可单选  默认为-1
    chooseHabit: -1
  },
  // 记录礼物完整信息
  giftRankAll: [],
  // 记录已加载的礼物数量
  giftNumber: 0,

  onLoad: function (options) {
    this.getGiftList();
    this.setGiftList();
  },

  onReachBottom: function (options) {
    this.setGiftList();
  },

  // 获取礼物
  async getGiftList() {
    // 获取各参数
    const {chooseSituation, chooseSex, chooseHabit, habitChoice} = this.data;
    // 提取tags各参数值
    const situation = ["热恋期", "追求ing", "普通朋友"][chooseSituation];
    const sex = chooseSex === 0 ? 'male' : 'female';
    const choice = habitChoice[chooseHabit];

    // 请求礼物信息
    const res = await request({
      url: '/gift/gift/getTopByTag',
      method: 'POST',
      data: {
        openid: '',
        tags: [
          situation,
          sex,
          choice
        ]
      }
    });
    
    // 存储礼物信息
    this.giftRankAll = res.data.data['gift_rank:'];
  },

  // 加载礼物
  setGiftList() {
    // 获取礼物下标
    const start = this.giftNumber;
    const end = (this.giftNumber + 6) <= 50 ? (this.giftNumber + 6) : 50;

    // 提取礼物信息
    const giftInfo = [...this.data.giftInfo, ...this.giftRankAll.slice(start, end)];

    // 更新礼物信息并记录现在已渲染的礼物数量
    this.setData({
      giftInfo
    });
    this.giftNumber = end;
  },

  // 下拉框响应
  handleSelect(e) {
    const {id} = e.currentTarget.dataset;

    switch(id) {
      case "0":
        let {isSelectedSex} = this.data;
        isSelectedSex = !isSelectedSex;
        this.setData({
          isSelectedSex
        });
        break;
      case "1":
        let {isSelectedHabit} = this.data;
        isSelectedHabit = !isSelectedHabit;
        this.setData({
          isSelectedHabit
        });
        break;
    }
  },

  // 身份情况选择
  handleOnChooseSituation(e) {
    const {id} = e.currentTarget.dataset;
    let {chooseSituation} = this.data;
    chooseSituation = id;
    this.setData({
      chooseSituation
    });
  },

  // 性别选择
  handleOnChooseSex(e) {
    const {id} = e.currentTarget.dataset;
    this.setData({
      chooseSex: id
    });
  },

  // 爱好选择
  handleOnChooseHabit(e) {
    const {id} = e.currentTarget.dataset;
    this.setData({
      chooseHabit: id
    });
  }
})