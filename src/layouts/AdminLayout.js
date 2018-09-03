import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';
import G from './../gobal'

function getLoginPathWithRedirectPath() {
  // 路由
  const params = getPageQuery();
  // 参数
  const { redirect } = params;
  // 返回路由加参数的拼接
  return getQueryPath('/admin_user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = 'Smart Space';
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.admin_container}>
          <div className={styles.containers}>
            <div className={styles.contents}>
              <img alt="pic" src={`${G.picUrl}backcharts.png`} />
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img
                      alt="logo"
                      className={styles.logo}
                      src={`${G.picUrl}logoBlue.png`}
                    />
                  </Link>
                </div>
                <div className={styles.desc}>Create Healthier & Smarter Workplace</div>
              </div>
              <Switch>
                {getRoutes(match.path, routerData).map(item => (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                ))}
                <Redirect from="/admin_user" to={getLoginPathWithRedirectPath()} />
              </Switch>
              <p className={styles.ps}>
                帮助&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隐私&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;条款
              </p>
              <p className={styles.ps}>Copyright©2018 9AM Inc.</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
