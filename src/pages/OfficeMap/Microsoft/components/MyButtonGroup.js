// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';

import { Radio } from 'antd';
import 'antd/lib/button/style/css';
import 'antd/lib/radio/style/css';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const styles = {
  container: {
    display: 'flex',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    boxShadow: '0 0 16px rgba(0,0,0,0.2)',
  },
  left: {
    width: 120,
    height: 60,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#262834',
  },
  center: {
    width: 120,
    height: 60,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#262834',
  },
  right: {
    width: 120,
    height: 60,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#262834',
  },
  selected: {
    backgroundColor: '#444444',
    border: '1px solid #444444',
    color: '#ffffff',
  },
  locked: {
    color: '#bbbbbb',
    backgroundColor: '#eeeeee',
  },
};

class MyButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '4',
    };
  }

  setValue(value) {
    this.setState({ value });
  }

  blur() {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    this.timer = setTimeout(() => {
      this.group.state.value = '4';
      this.setState({ value: '4' });
    }, 2000);
  }

  render() {
    const { onChange, data } = this.props;
    const { value } = this.state;
    return (
      <div style={styles.container}>
        <RadioGroup
          ref={o => {
            this.group = o;
          }}
          size="large"
          onChange={(group) => {
            onChange(group);
            this.blur();
            this.setValue(group.target.value);
          }}
          defaultValue="4"
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <RadioButton
            style={Object.assign({}, styles.left, value === '1' ? styles.selected : {}, data.locked === 'on' ? styles.locked : {})}
            disabled={data.locked === 'on'}
            value="1"
          >
            110cm
          </RadioButton>
          <RadioButton
            style={Object.assign({}, styles.center, value === '2' ? styles.selected : {}, data.locked === 'on' ? styles.locked : {})}
            disabled={data.locked === 'on'}
            value="2"
          >
            75cm
          </RadioButton>
          <RadioButton style={Object.assign({}, styles.right, value === '3' ? styles.selected : {})} value="3">
            {data.locked === 'on' ? 'unLock' : 'Lock'}
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default MyButtonGroup;
