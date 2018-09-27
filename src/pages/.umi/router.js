import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from 'E:/company/item9AM/space-web/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "redirect": "/user/login",
    "exact": true
  },
  {
    "path": "/admin_user",
    "redirect": "/user/login",
    "exact": true
  },
  {
    "path": "/",
    "redirect": "/home",
    "exact": true
  },
  {
    "path": "/user",
    "component": dynamic({ loader: () => import('../../layouts/UserLayout'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
    "routes": [
      {
        "path": "/user/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/admin_user",
    "component": dynamic({ loader: () => import('../../layouts/AdminLayout'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
    "routes": [
      {
        "path": "/admin_user/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "name": "changePassword",
        "path": "/changePassword",
        "component": dynamic({ loader: () => import('../User/ChangePassword'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
        "authority": [
          "admin",
          "user"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "name": "home",
        "icon": "home",
        "path": "/home",
        "component": dynamic({ loader: () => import('../Home/Home'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
        "authority": [
          "admin",
          "user"
        ],
        "exact": true
      },
      {
        "name": "management",
        "icon": "table",
        "path": "/management",
        "routes": [
          {
            "path": "/management/customer",
            "name": "customer",
            "component": dynamic({ loader: () => import('../Management/Customer'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin"
            ],
            "exact": true
          },
          {
            "path": "/management/newCustomer",
            "name": "newCustomer",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Management/newCustomer'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "user"
            ],
            "exact": true
          },
          {
            "path": "/management/person",
            "name": "person",
            "component": dynamic({ loader: () => import('../Management/Person'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "user"
            ],
            "exact": true
          },
          {
            "path": "/management/device",
            "name": "device",
            "component": dynamic({ loader: () => import('../Management/Device'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "user"
            ],
            "exact": true
          },
          {
            "path": "/management/notice",
            "name": "notice",
            "component": dynamic({ loader: () => import('../Management/Notice'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "user"
            ],
            "exact": true
          },
          {
            "path": "/management/newNotice",
            "name": "newNotice",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Management/newNotice'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "user"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "exception",
        "icon": "warning",
        "path": "/exception",
        "hideInMenu": true,
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": dynamic({ loader: () => import('../Exception/403'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": dynamic({ loader: () => import('../Exception/404'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": dynamic({ loader: () => import('../Exception/500'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Exception/TriggerException'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('E:/company/item9AM/space-web/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('E:/company/item9AM/space-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];

export default function() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
