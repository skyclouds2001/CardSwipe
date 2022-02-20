export const getUserProfile = ({
  desc = ' ',
  lang = 'en',
}) => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc,
      lang,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

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

export const login = ({
  timeout = 10000,
}) => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const chooseMedia = ({
  count = 9,
  mediaType = ['image', 'video'],
  sourceType = ['album', 'camera'],
  maxDuration = 10,
  sizeType = ['original', 'compressed'],
  camera = 'back',
}) => {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType,
      sourceType,
      maxDuration,
      sizeType,
      camera,
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
  placeholderText = '',
  showCancel = true,
  cancelText = '取消',
  cancelColor = '#000000',
  confirmText = '确定',
  confirmColor = '#576B95',
  editable = false,
}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      placeholderText,
      showCancel,
      cancelText,
      cancelColor,
      confirmText,
      confirmColor,
      editable,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const uploadFile = ({
  url,
  filePath,
  name,
  header = {
    'Content-Type': 'application/json',
  },
  timeout = 10000,
}) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath,
      name,
      url,
      header,
      timeout,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
