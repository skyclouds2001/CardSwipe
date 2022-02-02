// pages/friendInfo/friendInfo.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {
    friend_info: {
      friend_icon_url: '/images/1.jpg',
      friend_name: '天空的云',
      friend_id: 0,
      gift_info: [
        {
          gift_id: 0,
          gift_name: '礼物',
          gift_tag: '精美',
          gift_img_src: '/images/1.jpg'
        }
      ]
    }
  },

  onLoad: function (options) {

  }
})