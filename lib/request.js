export const request = (params) => {
  const url_base = "https://www.yangxiangrui.xyz:9092";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: url_base + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}