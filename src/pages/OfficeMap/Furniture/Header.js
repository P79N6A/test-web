import React, { Component } from 'react';
import G from '@/global';
import Key from './component/Key';

const styles = {
  container: {
    width: '100%',
    height: '52px',
    marginTop: 48,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 64,
    paddingRight: 64,
  },
  img: {
    height: 51,
    width: 245,
  },
};

export default class Header extends Component {
  render() {
    return (
      <div style={styles.container}>
        <img alt="" src={`${G.picUrl}/image/logo@3x.png`} style={styles.img} />
        <div style={{ flex: 1 }} />
        <Key />
      </div>
    );
  }
}
