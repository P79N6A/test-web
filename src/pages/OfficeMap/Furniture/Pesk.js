import React, { Component } from 'react';
import { connect } from 'dva';
import Item from './component/Item';

const styles = {
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    width: 'auto',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
  },
  center2: {
    width: 'auto',
    height: 250,
    display: 'flex',
    flexDirection: 'row',
  },
  left: {
    height: 300,
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  left2: {
    height: 250,
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  right: {
    marginLeft: 100,
    height: 300,
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  right2: {
    marginLeft: 100,
    height: 250,
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#325471',
    fontWeight: 500,
  },
};

const params = [
  'A2_1202', // 42
  'A2_1203', // 43
  'A2_1204', // 44
];

@connect(() => ({}))
class Pesk extends Component {
  constructor(props) {
    super(props);
    this.defaultData = [];
    for (let i = 0; i < params.length; i += 1) {
      this.defaultData.push({ active: false, value: i + 1, status: 'offline' });
    }
    this.state = {
      list: this.defaultData,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
  }

  updateList(response) {
    this.deskStatusLoading = false;
    if (response.status === 'fail') {
      return;
    }
    this.setState({ list: response.data });
  }

  fetch() {
    const { dispatch } = this.props;
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    dispatch({
      type: 'officeMap/getDeviceStatus',
      payload: {
        callback: this.updateList.bind(this),
        tags: { tags: params },
      },
    });
  }

  render() {
    const { list } = this.state;
    const { number, shouldRotate } = this.props;
    const style = {
      ...styles.right2,
      marginLeft: shouldRotate ? 0 : 100,
    };
    if (number === 2) {
      return (
        <div style={styles.container}>
          <div style={styles.center2}>
            <div style={styles.left2}>
              {shouldRotate && <div style={{ height: 80 }} />}
              <Item data={list[0]} />
              <div style={{ flex: 1 }} />
              <font style={styles.text}>Pesk1</font>
            </div>
            <div style={style}>
              <div style={{ transform: shouldRotate ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                <Item data={list[1]} />
              </div>
              <div style={{ flex: 1 }} />
              <font style={styles.text}>Pesk2</font>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.container}>
        <div style={styles.center}>
          <div style={styles.left}>
            <Item data={list[0]} style={{ marginTop: 65 }} />
            <div style={{ flex: 1 }} />
            <font style={styles.text}>Pesk</font>
          </div>
          <div style={styles.right}>
            <Item data={list[1]} />
            <Item data={list[2]} style={{ marginTop: 10 }} />
            <div style={{ flex: 1 }} />
            <font style={styles.text}>Twins</font>
          </div>
        </div>
      </div>
    );
  }
}

export default Pesk;
