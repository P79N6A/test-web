import React, { Component } from 'react';

import Item from './Item';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#a5a6ab',
    marginTop: 20,
  },
};

class PeskView extends Component {
  render() {
    const { data, title } = this.props;
    return (
      <div style={styles.container}>
        <div style={{ height: 150 }} />
        <Item data={data} type="PESK" hideValue />
        <font style={styles.title}>{title}</font>
      </div>
    );
  }
}

export default PeskView;
