export const showToast = ({
  title = '提示',
  icon = 'success',
  duration = 1500,
  mask = true,
}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      mask,
      duration,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const showModal = ({
  title = '提示',
  content = '',
  showCancel = true,
  cancelText = '取消',
  cancelColor = '#000000',
  confirmText = '确定',
  confirmColor = '#576B95',
  editable = false,
  placeholderText = '',
}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel,
      cancelText,
      cancelColor,
      confirmText,
      confirmColor,
      editable,
      placeholderText,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
