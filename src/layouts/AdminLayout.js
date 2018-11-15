import React from 'react';
import { Link } from 'dva/router';
import G from '@/global';
import styles from './UserLayout.less';
import DocumentTitle from 'react-document-title';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <DocumentTitle title='登录-9AM智能办公'>
        <div className={styles.admin_container}>
          <div className={styles.containers}>
            <div className={styles.contents}>
              <img alt="背景图片" src={`${G.picUrl}image/backcharts.png`} />
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={`${G.picUrl}image/logoBlue.png`} />
                  </Link>
                </div>
                <div className={styles.desc}>Create Healthier & Smarter Workplace</div>
              </div>
              {children}
              <p className={styles.ps}>Copyright©2018 9AM Inc.</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
