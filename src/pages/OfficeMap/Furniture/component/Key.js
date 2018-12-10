import React, { Component } from 'react';

const styles = {
  container: {
    height:24,
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    color: '#35536C',
  },
  peskView2: {
    width: 24,
    height: 24,
    backgroundColor: '#ffdedf', // 浅红
    border: '1px solid #f34146',
    borderRadius: 4,
    marginLeft: 30,
  },
  activeText: {
    fontSize: 12,
    color: '#262834',
    lineHeight: '26px',
    marginLeft: 8,
  },
  peskView: {
    width: 24,
    height: 24,
    backgroundColor: '#ccedeb', // 浅蓝
    border: '1px solid #00a699',
    borderRadius: 4,
    marginLeft: 30,
  },
  activeText2: {
    fontSize: 12,
    color: '#262834',
    lineHeight: '26px',
    marginLeft: 8,
  },
  peskView3: {
    width: 24,
    height: 24,
    backgroundColor: '#DCDCDC',
    border: '1px solid #808080',
    borderRadius: 4,
    marginLeft: 30,
  },
};

class Key extends Component {
  render() {
    return (
      <div style={styles.container}>
        <font style={styles.text}>Legend</font>
        <div style={styles.peskView2} />
        <font style={styles.activeText}>Occupied</font>
        <div style={styles.peskView} />
        <font style={styles.activeText2}>Vacant</font>
        <div style={styles.peskView3} />
        <font style={styles.activeText2}>Offline</font>
      </div>
    );
  }
}

export default Key;
