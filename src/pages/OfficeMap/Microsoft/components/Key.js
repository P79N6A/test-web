// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#262834',
    fontWeight: 200,
  },
  activeText: {
    fontSize: 14,
    color: '#262834',
    marginLeft: 10,
    fontWeight: 200,
  },
  activeText2: {
    fontSize: 14,
    color: '#262834',
    marginLeft: 10,
    fontWeight: 200,
    marginRight: 80,
  },
  peskView: {
    width: 24,
    height: 24,
    backgroundColor: '#ccedeb', // 浅蓝
    border: '1px solid #00a699',
    borderRadius: 4,
    marginLeft: 20,
  },
  peskView2: {
    width: 24,
    height: 24,
    backgroundColor: '#ffdedf', // 浅红
    border: '1px solid #f34146',
    borderRadius: 4,
    marginLeft: 20,
  },
};

class Key extends Component {
  render() {
    return (
      <div style={styles.container}>
        <img alt="" src={`${G.picUrl}/9am_logo.png`} style={{ width: '200px', height: '60px', marginBottom: 10 }} />
        <font style={{ fontSize: 30, color: '#a5a6ab' }}>X</font>
        <img alt="" src={`${G.picUrl}/microsoft_logo.png`} style={{ width: '180px', height: '80px', marginLeft: '16px' }} />
        <div style={{ flex: 1 }} />
        <font style={styles.text}>Legend</font>
        <div style={styles.peskView2} />
        <font style={styles.activeText}>Occupied</font>
        <div style={styles.peskView} />
        <font style={styles.activeText2}>Vacant</font>
      </div>
    );
  }
}

export default Key;
