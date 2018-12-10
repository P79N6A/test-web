import React, { Component } from 'react';
import G from '@/global';
import styles from './index.less';
import PageCount from './PageCount';

class PageMapTemplate extends Component {
  render() {
    const { offlineCount, vacantCount, occupiedCount, children } = this.props;
    let minHeight = window.screen.height - 250;
    if (minHeight < 670) minHeight = 670;
    return (
      <div className={styles.App} style={{ minHeight, minWidth: '1100px' }}>
        <div className={styles.header}>
          <img className={styles.logo} alt="logo" src={`${G.picUrl}/image/space_logo.png`} />
          <div style={{ flex: 1 }} />
          <font className={styles.copyRightText}>Copyright ©️ 2018 9AM Inc.</font>
        </div>
        <div className={styles.emptyHeightView} />
        <div className={styles.container}>
          <div className={styles.left}>
            <PageCount
              offlineCount={offlineCount}
              vacantCount={vacantCount}
              occupiedCount={occupiedCount}
            />
          </div>
          <div className={styles.emptyWidthView} />
          <div className={styles.right}>{children}</div>
        </div>
        <div className={styles.emptyHeightView} />
      </div>
    );
  }
}

export default PageMapTemplate;
