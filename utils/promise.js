export const getUserProfile = ({
  desc
}) => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

export const showToast = ({
  title,
  icon
}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      mask: true,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
};

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
