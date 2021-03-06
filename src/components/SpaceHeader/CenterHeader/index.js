// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import G from '@/global';
import styles from './index.less';

class ExternalLayout extends React.PureComponent {

  render() {
    return (
      <div className={styles.container}>
        <img className={styles.pic} src={`${G.picUrl}/image/space_logo.png`} />
      </div>
    );
  }
}

export default ExternalLayout;

