// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    select:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    enterxiangqing(){
      const currentid=this.data.card.id
      wx.navigateTo({
        url: '../xiangqing/xiangqing',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
        
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { id: currentid })
        }
      })
    },
change:function(){
  this.setData({
    select:!this.data.select
  })
  wx.setStorageSync('select', this.data.select)
}
  }
})
