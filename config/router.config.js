export default [
  // Dshow登录页面
  {
    path: '/dshow',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/dshow', redirect: '/dshow/login' },
      { path: '/dshow/login', component: './Dshow/Login/DshowLogin' },
    ],
  },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      // dashboard
      { path: '/', redirect: '/user/login' },
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // 重定向
  { path: '/', redirect: '/user/login' },
  // admin_user
  {
    path: '/admin_user',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/admin_user', redirect: '/admin_user/login' },
      { path: '/admin_user/login', component: './User/Login' },
    ],
  },
  // space-user
  {
    path: '/spacex-user',
    component: '../layouts/SpacexUserLayout',
    routes: [
      { path: '/spacex-user', redirect: '/spacex-user/login' },
      { path: '/spacex-user/login', component: './User/SpaceLogin' },
    ],
  },
  // 只有头部没有权限设置的外接页面
  {
    path: '/external',
    name: 'external',
    component: '../layouts/ExternalLayout',
    routes: [
      { path: '/external', redirect: '/external/RetrievePassword' },
      // 找回密码
      { name: 'reset.password', path: '/external/RetrievePassword', component: './Password/RetrievePassword' },
      // 找回密码的邮箱模板
      { name: 'retrieve.mail', path: '/external/RetrieveMail', component: './Password/RetrieveMail' },
      { name: 'new.password', path: '/external/NewPassword', component: './Password/RetrieveMail/NewPassword' },
      { redirect: '/exception/404' },
    ],
  },
  // office-map展示页面
  {
    path: '/office-map',
    component: '../layouts/OfficeMapLayout',
    routes: [
      { path: '/office-map', redirect: '/office-map/9amdemo' },
      { path: '/office-map/9amdemo', component: './OfficeMap/TianChuang' },
      { path: '/office-map/weworkfun', component: './OfficeMap/WeworkFun' },
      { path: '/office-map/demo2', component: './OfficeMap/Furniture' },
      { path: '/office-map/demo2-2', component: './OfficeMap/Furniture' },
      { path: '/office-map/microsoft', component: './OfficeMap/Microsoft' },
      { path: '/office-map/microsoftHall', component: './OfficeMap/Microsoft/MicrosoftHall' },
      { path: '/office-map/jd', component: './OfficeMap/JD' },
      { redirect: '/exception/404' },
    ],
  },

  // space 工位实时状态以及数据统计展示
  {
    path: '/spacex',
    component: '../layouts/SpacexLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/spacex', redirect: '/spacex/space-status' },
      { path: '/spacex/space-status', component: './Spacex/SpaceStatus' },
      { path: '/spacex/space-demo', component: './Spacex/SpaceStatus' },
      { path: '/spacex/global-status', component: './Spacex/GlobalStatus' },
      { path: '/spacex/space-statistics', component: './Spacex/OfficeUsage' },
      { redirect: '/exception/404' },
    ],
  },
  // home
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        name: 'changePassword',
        path: './changePassword',
        component: './Password/ChangePassword/ChangePassword',
        authority: ['admin', 'user'],
        hideInMenu: true,
      },
      {
        name: 'home',
        icon: 'home',
        path: './home',
        component: './Home/Home',
        authority: ['admin', 'user'],
      },
      {
        name: 'management',
        icon: 'table',
        path: './management',
        routes: [
          {
            path: '/management/customer',
            name: 'customer',
            component: './Management/Customer/Customer',
            authority: ['admin'],
          },
          {
            path: '/management/newCustomer',
            name: 'newCustomer',
            hideInMenu: true,
            component: './Management/Customer/NewCustomer',
            authority: ['admin', 'user'],
          },
          {
            path: '/management/person',
            name: 'person',
            component: './Management/Person/Person',
            authority: ['user'],
          },
          {
            path: '/management/person-group',
            name: 'personGroup',
            component: './Management/PersonGroup',
            authority: ['user'],
          },
          {
            path: '/management/device',
            name: 'device',
            component: './Management/Device/Device',
            authority: ['admin', 'user'],
          },
          {
            path: '/management/notice',
            name: 'notice',
            component: './Dshow/Notice/Notice',
            authority: ['user'],
          },
          {
            path: '/management/newNotice',
            name: 'newNotice',
            hideInMenu: true,
            component: './Dshow/Notice/NewNotice',
            authority: ['user'],
          },
          {
            path: '/management/detailNotice',
            name: 'detailNotice',
            hideInMenu: true,
            component: './Dshow/Notice/DetailNotice',
            authority: ['user'],
          },
          {
            path: '/management/banner',
            name: 'banner',
            hideInMenu: true,
            component: './Dshow/Banner/Banner',
            authority: ['user'],
          },
          { redirect: '/exception/404' },
        ],
      },
      {
        name: 'statistics',
        icon: 'pie-chart',
        path: './statistics',
        routes: [
          {
            path: '/statistics/spaceState',
            name: 'spaceState',
            component: './Statistics/SpaceState/SpaceState',
            authority: ['user'],
          },
          {
            path: '/statistics/spaceUsage',
            name: 'spaceUsage',
            component: './Statistics/spaceUsage',
            authority: ['user'],
          },
          { redirect: '/exception/404' },
        ],
      },
      {
        name: 'settings',
        icon: 'setting',
        path: './setting',
        routes: [
          {
            path: '/setting/gateway',
            name: 'gateway',
            component: './Setting/All',
            authority: ['admin'],
          },
          { redirect: '/exception/404' },
        ],
      },
      {
        name: 'device',
        icon: 'profile',
        path: './device',
        routes: [
          {
            path: '/device/sensor',
            name: 'sensor',
            component: './Device/Sensor',
          },
          { redirect: '/exception/404' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
          { redirect: '/exception/404' },
        ],
      },
      { redirect: '/exception/404' },
    ],
  },
];
