import React from 'react';
import Link from 'umi/link';
import DocumentTitle from 'react-document-title';
import G from '@/global';
import styles from './index.less';

class SpaceUserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={`${G.picUrl}/image/login-logo.png`} />
                </Link>
              </div>
            </div>
            {children}
            <p className={styles.ps}>Copyright©2018 9AM Inc.</p>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default SpaceUserLayout;
