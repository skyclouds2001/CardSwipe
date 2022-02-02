// pages/problem/problem.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast} from '../../utils/promise.js';

Page({
  // 提交问题
  async submitProblem(e) {
    const {problem_content} = e.detail.value;

    // 检测问题反馈内容长度
    if(problem_content.trim().length === 0) {
      await showToast({
        title: '问题反馈内容不能为空！',
        icon: 'error'
      });
      return;
    }

    // 正式提交问题反馈内容
    try {
      const res = await request({
        url: '/gift/question/pullQuest',
        method: 'POST',
        data: {
          problem: problem_content,
          examine: 0,
          id: 0
        },
        header: {
          'content-type': 'application/json'
        }
      });
      console.log(res.data);

      const {data} = res;
      if(data.success) {
        await showToast({
          title: '提交成功！',
          icon: 'success'
        });
        wx.navigateTo({
          url: '../../pages/mine/mine',
        });
      } else {
        await showToast({
          title: '提交失败！',
          icon: 'error'
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
})