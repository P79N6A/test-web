export default [
  // Dshow登录页面
  {
    path: '/dshow',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/dshow', redirect: '/dshow/login' },
      { path: '/dshow/login', component: './Dshow/DshowLogin' }
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
  // admin_user
  {
    path: '/admin_user',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/admin_user', redirect: '/admin_user/login' },
      { path: '/admin_user/login', component: './User/Login' },
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
        component: './User/ChangePassword',
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
            component: './Management/Customer',
            authority: ['admin'],
          },
          {
            path: '/management/newCustomer',
            name: 'newCustomer',
            hideInMenu: true,
            component: './Management/NewCustomer',
            authority: ['admin', 'user'],
          },
          {
            path: '/management/person',
            name: 'person',
            component: './Management/Person',
            authority: ['user'],
          },
          {
            path: '/management/device',
            name: 'device',
            component: './Management/Device',
            authority: ['admin', 'user'],
          },
          {
            path: '/management/notice',
            name: 'notice',
            component: './Management/Notice',
            authority: ['user'],
          },
          {
            path: '/management/newNotice',
            name: 'newNotice',
            hideInMenu: true,
            component: './Management/NewNotice',
            authority: ['user'],
          },
          {
            component: '404',
          }
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
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
