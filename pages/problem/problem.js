// pages/problem/problem.js

import {request} from '../../lib/request.js';
import regeneratorRuntime from '../../lib/runtime.js';
import {showToast} from '../../utils/promise.js';

Page({
  // 提交问题
  async submitProblem(e) {
    const {problem_content} = e.detail.value;
    const userinfo = wx.getStorageSync('userinfo') || {};

    // 检测问题反馈内容长度
    if(problem_content.trim().length === 0) {
      await showToast({
        title: '问题反馈为空！',
        icon: 'error',
        duration: 2000,
      });
      return;
    }

    // 正式提交问题反馈内容
    try {
      await request({
        url: '/gift/question/pullQuest',
        method: 'POST',
        data: {
          questionList : {
            examine: 0,
            id: 0,
            insertTime: new Date().toString(),
            name: userinfo.nickName,
            question: problem_content,
            url: userinfo.avatarUrl,
          },
        },
        header: {
          'Content-Type': 'application/json'
        },
      });
      /* 由于后端返回的结果一直报500错误，但后台监测发现该报错并不影响正常提交问题功能，故注释掉相应的提示代码 */
      // const {data} = res;
      // if(data.success) {

      await showToast({
        title: '提交成功！',
        icon: 'success',
      });
      
      setTimeout(() => {
        wx.switchTab({
          url: '../../pages/mine/mine',
        });
      }, 1500);
      
      // } else {
        // await showToast({
        //   title: '提交失败！',
        //   icon: 'error'
        // });
      // }
    } catch (err) {
      console.log(err);
    }
  }
})