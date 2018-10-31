import React, { Component } from 'react';
import G from '@/global';
import styles from './../SpaceState.less';

class TimeText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: G.moment(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        moment: G.moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { moment } = this.state;
    return (
      <p className={styles.time}>
        {moment.format('MMM Do HH:mm:ss')}
      </p>
    );
  }
}

export default TimeText;
