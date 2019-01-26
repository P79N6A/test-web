// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Radio, Spin } from 'antd';
import { Bar } from '@/components/Charts';
import G from '@/global';

import styles from './index.less';

class DeskDuration extends Component {
  state = {
    loading: false,
    number: 0,
    avg_dur: {
      WEEKLY: [{ title: formatMessage({ id: 'home.nearly.one.year' }), value: 'LAST_YEAR' }, { title: formatMessage({ id: 'spaceUsage.nearly-four-week' }), value: 'LAST_4WEEKS' }],
      HOURLY: [
        { title: formatMessage({ id: 'spaceUsage.year' }), value: 'CURRENT_YEAR' },
        { title: formatMessage({ id: 'home.nearly.thirty.day' }), value: 'LAST_30DAYS' },
        { title: formatMessage({ id: 'home.nearly.seven.day' }), value: 'LAST_7DAYS' },
        { title: formatMessage({ id: 'spaceUsage.yesterday' }), value: 'LAST_DAY' },
      ],
    },
  };

  componentDidMount() {
    if (document.body.clientWidth < 500) {
      this.setState({
        number: 12,
      })
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

  // 修改参数
  changeGlobal(type) {
    const { dispatch, desk_avg_duration } = this.props;
    dispatch({
      type: 'office/changeGlobalType',
      payload: {
        desk_avg_duration: {
          ...desk_avg_duration,
          ...type,
        },
      },
    });
  }

  // 请求数据
  requireAvg(condition_typeCopy, date_type) {
    this.setState({
      loading: true,
    })
    const { dispatch, desk_avg_duration, condition_type } = this.props;
    const { type } = desk_avg_duration;
    const date = G.moment(new Date()).format('YYYY-MM-DD');
    this.changeGlobal();
    dispatch({
      type: 'office/getAvgDuration',
      payload: {
        type: condition_typeCopy || type,
        date_type,
        date,
        condition_type,
        callback: this.requestAllData.bind(this),
      },
    });
    this.changeGlobal({ type: condition_typeCopy || type, date_type, date_type });
  }

  requestAllData() {
    this.setState({
      loading: false,
    })
  }

  render() {
    const deskuseRateProps = { xs: 24, sm: 12, md: 7, lg: 7, xl: 7, style: { marginBottom: 24 } };
    const deskuseRatePropsO = { xs: 24, sm: 24, md: 9, lg: 9, xl: 9, style: { marginBottom: 24 } };
    const { avg_dur, number, loading } = this.state;
    const { deskAvgDurationList, desk_avg_duration } = this.props;
    const { type, date_type } = desk_avg_duration;
    return (
      <Row gutter={24} className={styles.deskdurationBox}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <Row gutter={24}>
              <Col {...deskuseRatePropsO}>
                {/* 工位使用时长分布 */}
                <h3 className={styles.deskDduration}><FormattedMessage id="spaceUsage.station-use-time" /></h3>
              </Col>
              <Col {...deskuseRateProps}>
                <Radio.Group value={type} onChange={this.onChange}>
                  <Radio.Button value="HOURLY"><FormattedMessage id="spaceUsage.distribution-hour" /></Radio.Button>
                  <Radio.Button value="WEEKLY"><FormattedMessage id="spaceUsage.distribution-week" /></Radio.Button>
                </Radio.Group>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                {avg_dur[type].map((item, index) => (
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
                {deskAvgDurationList ?
                  <Bar height={395} data={deskAvgDurationList} number={number} color="#FCB0B1" />
                  : (
                    <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-90px' }}>
                      <FormattedMessage id="spaceUsage.none" />
                    </div>
                  )}
                <Spin size="large" style={{ display: loading ? 'block' : 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
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
