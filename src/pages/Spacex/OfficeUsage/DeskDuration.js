// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Row, Col, Card, Radio, Spin } from 'antd';
import { Bar } from '@/components/Charts';
import G from '@/global';

import styles from './index.less';

class DeskDuration extends Component {
  state = {
    loading: false,
    number: 0,
    avg_dur: {
      WEEKLY: [{ title: '近1年', value: 'LAST_YEAR' }, { title: '近4周', value: 'LAST_4WEEKS' }],
      HOURLY: [
        { title: '今年', value: 'CURRENT_YEAR' },
        { title: '近30天', value: 'LAST_30DAYS' },
        { title: '近7天', value: 'LAST_7DAYS' },
        { title: '昨日', value: 'LAST_DAY' },
      ],
    },
  };

  componentDidMount() {
    if (document.body.clientWidth < 500) {
      this.setState({
        number: 12,
      });
    }
  }

  // 工位使用时长分布按时分、按周分
  onChange = e => {
    const { avg_dur } = this.state;
    const a = e.target.value;
    this.requireAvg(e.target.value, avg_dur[a][avg_dur[a].length - 1].value);
  };

  // 工位使用时长分布近七天
  onChangeType = value => {
    this.requireAvg('', value);
  };

  // 请求数据
  requireAvg(condition_typeCopy, date_type) {
    this.setState({
      loading: true,
    });
    const { deskAvgDuration, dispatch } = this.props;
    const { condition_type } = deskAvgDuration;
    const date = G.moment(new Date()).format('YYYY-MM-DD');
    dispatch({
      type: 'spacexOffice/getAvgDuration',
      payload: {
        condition_type: condition_typeCopy || condition_type,
        date_type,
        date,
        callback: this.requestAllData.bind(this),
      },
    });
  }

  requestAllData(data) {
    this.setState({
      loading: false,
    });
  }

  fetchData() {
    const { deskAvgDuration } = this.props;
    const { condition_type, date_type } = deskAvgDuration;
    this.requireAvg(condition_type, date_type);
  }

  render() {
    const deskuseRateProps = {
      xs: 24,
      sm: 12,
      md: 7,
      lg: 7,
      xl: 7,
      style: { marginBottom: 24 },
    };
    const deskuseRatePropsO = {
      xs: 24,
      sm: 24,
      md: 9,
      lg: 9,
      xl: 9,
      style: { marginBottom: 24 },
    };
    const { avg_dur, number, loading } = this.state;
    const { deskAvgDuration } = this.props;
    const { condition_type, date_type } = deskAvgDuration;
    return (
      <Row gutter={24} className={styles.deskdurationBox}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <Row gutter={24}>
              <Col {...deskuseRatePropsO}>
                <h3 className={styles.deskDduration}>工位使用时长分布</h3>
              </Col>
              <Col {...deskuseRateProps}>
                <Radio.Group value={condition_type} onChange={this.onChange}>
                  <Radio.Button value="HOURLY">按时分布</Radio.Button>
                  <Radio.Button value="WEEKLY">按周分布</Radio.Button>
                </Radio.Group>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                {avg_dur[condition_type].map((item, index) => (
                  <span
                    key={`avg${index + 1}`}
                    className={
                      item.value === date_type ? styles.avg_times_active : styles.avg_times
                    }
                    onClick={this.onChangeType.bind(this, item.value)}
                  >
                    {item.title}
                  </span>
                ))}
              </Col>
            </Row>
            <Row gutter={24} style={{ position: 'relative' }}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Bar height={395} data={deskAvgDuration.dataList} number={number} color="#fcb0b1" />
                <Spin
                  size="large"
                  style={{
                    display: loading ? 'block' : 'none',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                  }}
                />
              </Col>
            </Row>
            <br />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default DeskDuration;
