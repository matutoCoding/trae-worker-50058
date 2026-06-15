export default defineAppConfig({
  pages: [
    'pages/tide/index',
    'pages/window/index',
    'pages/map/index',
    'pages/harvest/index',
    'pages/mine/index',
    'pages/safety/index',
    'pages/equipment/index',
    'pages/help/index',
    'pages/harvest-add/index',
    'pages/route-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0077B6',
    navigationBarTitleText: '潮间带赶海安全',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F0F8FF'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#0077B6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/tide/index',
        text: '潮汐预报'
      },
      {
        pagePath: 'pages/window/index',
        text: '赶海窗口'
      },
      {
        pagePath: 'pages/map/index',
        text: '海滩地图'
      },
      {
        pagePath: 'pages/harvest/index',
        text: '收获记录'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
