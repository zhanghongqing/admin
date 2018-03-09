export default {
  data: [{
    title: '网页管理',
    router: '/web',
    icon: '#icon--',
    sub: [{
      name: '头部导航管理',
      router: '/web/nav'
    }, {
      name: '首页信息管理',
      router: '/web/index/banner',
      handles: [{
        title: 'banner管理',
        router: '/web/index/banner'
      }, {
        title: '菜单管理',
        router: '/web/index/menu'
      }, {
        title: '书籍管理',
        router: '/web/index/book'
      }]
    }, {
      name: '资讯文章管理',
      router: '/web/news',
      handles: [{
        title: '显示',
        router: '/web/news'
      }, {
        title: '添加',
        router: '/web/news/add'
      }]
    }, {
      name: '资料下载管理',
      router: '/web/down',
      handles: [{
        title: '显示资料',
        router: '/web/down'
      }, {
        title: '添加资料',
        router: '/web/down/add'
      }]
    }]
  }, {
    title: '课程管理',
    router: '/course',
    icon: '#icon-kechengguanli-',
    sub: [{
      name: '全部课程',
      router: '/course'
    }, {
      name: '筛选课程',
      router: '/course/filter'
    }, {
      name: '创建课程',
      router: '/course/create'
    }]
  }, {
    title: '图片管理',
    router: '/images',
    icon: '#icon-tupian1',
    sub: [{
      name: '图片分类',
      router: '/images'
    }, {
      name: '图片上传',
      router: '/images/upload'
    }]
  }, {
    title: '用户管理',
    router: '/users',
    icon: '#icon-yonghu',
    sub: [{
      name: '用户概况',
      router: '/users'
    }]
  }]
  //     [{
  //   title: '网页管理',
  //   router: '/web',
  //   sub: [
  //     {
  //       name: '资讯文章管理',
  //       router: '/web/news',
  //       handles: [{
  //         title: '显示',
  //         router: '/web/news'
  //       }, {
  //         title: '添加',
  //         router: '/web/news/add'
  //       }]
  //     },
  //     {
  //       name: '资料下载管理',
  //       router: '/web/down',
  //       handles: [{
  //         title: '显示资料',
  //         router: '/web/down'
  //       }, {
  //         title: '添加资料',
  //         router: '/web/down/add'
  //       }]
  //     }
  //   ]
  // }, {
  //   title: '课程管理',
  //   router: '/course',
  //   sub: [
  //     {
  //       name: '全部课程',
  //       router: '/course'
  //     }, {
  //       name: '筛选课程',
  //       router: '/course/filter'
  //     }, {
  //       name: '创建课程',
  //       router: '/course/create'
  //     }
  //   ]
  // }]
}
