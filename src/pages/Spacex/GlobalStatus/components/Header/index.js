// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';
import style from './index.less';

class Header extends Component {
  render() {
    return (
      <div className={style.container}>
        <img alt="logo" className={style.logo} src={`${G.picUrl}image/space_logo.png`} />
        <div style={{ flex: 1 }} />
        <font className={style.copyRight}>Copyright©2018 9AM Inc.</font>
      </div>
    );
  }
}

export default Header;
