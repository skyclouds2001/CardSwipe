export const getUserProfile = ({
  desc,
  lang,
}) => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: desc ?? ' ',
      lang: lang ?? 'en',
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
  title,
  icon,
  duration,
  mask,
}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: icon ?? 'success',
      mask: mask ?? true,
      duration: duration ?? 1500,
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
  timeout,
}) => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: timeout ?? 10000,
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
  count,
  mediaType,
  sourceType,
  maxDuration,
  sizeType,
  camera,
}) => {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: count ?? 9,
      mediaType: mediaType ?? ['image', 'video'],
      sourceType: sourceType ?? ['album', 'camera'],
      maxDuration: maxDuration ?? 10,
      sizeType: sizeType ?? ['original', 'compressed'],
      camera: camera ?? 'back',
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
  title,
  content,
}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title ?? ' ',
      content: content ?? ' ',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
