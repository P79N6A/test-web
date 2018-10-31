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
      WEEKLY: [{ title: formatMessage({ id: 'home.nearly.one.year' }), value: 'NEARLY_YEAR' }, { title: formatMessage({id:'spaceUsage.nearly.four.week'}), value: 'NEARLY_4WEEK' }],
      HOURLY: [
        { title: formatMessage({id:'spaceUsage.year'}), value: 'CURRENT_YEAR' },
        { title: formatMessage({id:'home.nearly.thirty.day'}), value: 'NEARLY_30DAY' },
        { title: formatMessage({id:'home.nearly.seven.day'}), value: 'NEARLY_7DAY' },
        { title: formatMessage({id:'spaceUsage.yesterday'}), value: 'NEARLY_DAY' },
      ],
    },
  };

  componentDidMount() {
    if (document.body.clientWidth < 500) {
      this.setState({
        number: 12
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

  // 请求数据
  requireAvg(condition_typeCopy, date_type) {
    this.setState({
      loading: true
    })
    const { deskAvgDuration, dispatch } = this.props;
    const { condition_type } = deskAvgDuration;
    const date = G.moment(new Date()).format('YYYY-MM-DD');
    dispatch({
      type: 'office/getAvgDuration',
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
      loading: false
    })
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
                <h3 className={styles.deskDduration}><FormattedMessage id="spaceUsage.station.use.time" /></h3>
              </Col>
              <Col {...deskuseRateProps}>
                <Radio.Group value={condition_type} onChange={this.onChange}>
                  <Radio.Button value="HOURLY"><FormattedMessage id="spaceUsage.distribution.hour" /></Radio.Button>
                  <Radio.Button value="WEEKLY"><FormattedMessage id="spaceUsage.distribution.week" /></Radio.Button>
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
                <Bar height={395} data={deskAvgDuration.dataList} number={number} color={'#FCB0B1'} />
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
