// pages/problem/problem.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';

Page({

  data: {

  },

  onLoad: function (options) {

  },

  // 提交问题
  async submitProblem(e) {
    const {problem_content} = e.detail.value;

    if(problem_content.trim().length === 0)
      return;

    try {
      await request({
        url: '/gift/question/pullQuest',
        method: 'POST',
        data: {
          problem: problem_content
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
})