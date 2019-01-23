// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const AdminLayout = routerData['/admin_user'].component;
  const SpacexUserLayout = routerData['/SpacexUserLayout'].component;
  const BasicLayout = routerData['/'].component;
  const ExternalLayout = routerData['/external'].component;
  const OfficeMapLayout = routerData['/office-map'].component;
  const SpacexLayout = routerData['/spacex'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/admin_user" component={AdminLayout} />
          <Route path="/space-user" component={SpacexUserLayout} />
          <Route path="/dshow" component={BlankLayout} />
          <Route path="/external" component={ExternalLayout} />
          <Route path="/office-map" component={OfficeMapLayout} />
          <AuthorizedRoute
            path="/spacex"
            render={props => <SpacexLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/spacex-user/login', {
              redirect: window.location.href,
            })}
          />
          {/* 判定权限默认全部 */}
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
