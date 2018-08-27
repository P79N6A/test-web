import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logo from '../assets/logoBlue.png';
import bgimg from './../assets/backchart.png';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.containers}>
            <div className={styles.contents}>
              <img src={bgimg} />
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo} />
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
                <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
              </Switch>
              <p className={styles.ps}>
                帮助&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隐私&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;条款
              </p>
              <p className={styles.ps}>Copyright©2018 站坐（宁波）技术部出品</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
