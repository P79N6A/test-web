export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // admin_user
  {
    path: '/admin_user',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/admin_user', redirect: '/user/login' },
      { path: '/admin_user/login', component: './User/Login' },
    ],
  },
  // home
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],

    routes: [
      // dashboard
      { path: '/', redirect: './home' },
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
        path: '/management',
        authority: ['admin', 'user'],
        routes: [
          // exception
          {
            path: '/management/customer',
            name: 'customer',
            component: './Management/Customer',
          },
          {
            path: '/management/newCustomer',
            name: 'newCustomer',
            hideInMenu: true,
            component: './Management/newCustomer',
          },
          {
            path: '/management/person',
            name: 'person',
            component: './management/Person',
          },
          {
            path: '/management/device',
            name: 'device',
            component: './management/Device',
          },
          {
            path: '/management/notice',
            name: 'notice',
            comments: './management/Notice',
          },
          {
            path: '/management/newNotice',
            name: 'newNotice',
            hideInMenu: true,
            comments: './management/newNotice',
          },
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
