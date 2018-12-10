import React, { Component } from 'react';
import { connect } from 'dva';
import styles2 from './index.css';
import Key from './components/Key';
import PeskView from './components/PeskView';
import PeskView2 from './components/PeskView2';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  peskView: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
};
const params = ['A2_1001'];

@connect(() => ({}))
class App extends Component {
  constructor(props) {
    super(props);
    const defaultData = [];
    for (let i = 0; i < 1; i += 1) {
      defaultData.push({ active: false, value: i + 1 });
    }
    this.state = {
      list: defaultData,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
  }

  updateList(response) {
    this.deskStatusLoading = false;
    if (response.status === 'fail') return;
    if (response.data.length < 1) return;
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
    return (
      <div className={styles2.App}>
        <div style={styles.container}>
          <div style={styles.top}>
            <Key />
          </div>
          <div style={styles.peskView}>
            <PeskView2 data={list[0]} title="MTC" />
            <div style={{ width: '100px' }} />
            <PeskView data={{ active: false }} title="USA" />
          </div>
          <font style={{ fontSize: 14, color: '#a5a6ab', marginBottom: 40, fontWeight: 200 }}>
            9AM x Microsoft Azure Standing Desk and Smart Workspace Solution
          </font>
        </div>
      </div>
    );
  }
}

export default App;
