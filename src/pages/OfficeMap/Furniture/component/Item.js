// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';

const styles = {
  peskView: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '280px',
    height: '120px',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#ccedeb', // 浅蓝
    border: '1px solid #00a699',
  },
  peskView2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    backgroundColor: '#ffdedf', // 浅红
    border: '1px solid #f34146',
  },
  peskView3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    backgroundColor: '#DCDCDC', // 浅灰
    border: '1px solid #808080',
  },
  text1: {
    color: '#00a699',
    fontSize: 16,
  },
  text2: {
    color: '#f34146',
    fontSize: 16,
  },
  text3: {
    color: '#808080',
    fontSize: 16,
  },
};

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anim: props.data.active ? 1 : 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.active && !this.props.data.active) {
      this.startAnim();
    }
    if (nextProps.data && !nextProps.data.active && this.props.data.active) {
      this.endAnim();
    }
  }

  startAnim() {
    this.setState({ anim: 1 });
  }

  endAnim() {
    this.setState({ anim: 0 });
  }

  render() {
    const { data, style, showValue } = this.props;
    return (
      <div style={Object.assign({}, styles.peskView, style)}>
        <div style={Object.assign({}, styles.peskView2, { opacity: this.state.anim })}>
          <font style={styles.text2}>{showValue && data.number}</font>
        </div>
        <div style={Object.assign({}, styles.peskView3, { opacity: data && data.status === 'offline' ? 1 : 0 })}>
          <font style={styles.text3}>{showValue && data.number}</font>
        </div>
        <font style={styles.text1}>{showValue && data.number}</font>
      </div>
    );
  }
}

export default Item;
