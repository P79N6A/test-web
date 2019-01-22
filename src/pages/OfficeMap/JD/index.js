import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import G from '@/global'

@connect(({ Jd }) => ({
  Jd,
}))
class JD extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // 初始化数据，防止延迟
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 15 * 1000);
  }

  // 离开页面时，清除计时器
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 请求接口
  getData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Jd/fetch',
    });
  }

  render() {
    const { Jd } = this.props;
    const { data } = Jd;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.logo} alt="logo" src={`${G.picUrl}image/space_logo.png`} />
          <div style={{ flex: 1 }} />
          <font className={styles.copyRightText}>Copyright ©️ 2018 9AM Inc.</font>
        </div>
        <div className={styles.countView}>
          <font className={styles.countText}>
            {`${
              data && data.properties && data.properties.reported && data.properties.reported.count ? data.properties.reported.count : 0
              }`}
            人
          </font>
          <font className={styles.countDescribe}>房间人数</font>
        </div>
      </div>
    );
  }
}

export default JD;
