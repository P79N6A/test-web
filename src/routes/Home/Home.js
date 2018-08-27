import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, DatePicker, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field, Bar } from 'components/Charts';
import G from '../../gobal';
import { getTimeDistance } from '../../utils/utils';

import styles from './Home.less';

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/fetchGatherData'],
}))
export default class Home extends Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    dispatch({
      type: 'home/fetchGatherData',
      payload: rangePickerValue,
    });
    dispatch({
      type: 'home/fetchStandingData',
      payload: rangePickerValue,
    });
    dispatch({
      type: 'home/fetchTimeRanking',
      payload: rangePickerValue,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/clear',
    });
  }

  handleMonthPickerChange = monthPickerValue => {
    const unix = monthPickerValue.unix();
    const rangePickerValue = [
      G.moment.unix(unix).startOf('month'),
      G.moment
        .unix(unix)
        .startOf('month')
        .add(1, 'month')
        .subtract(1, 'day'),
    ];
    this.setState({
      rangePickerValue,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchStandingData',
      payload: rangePickerValue,
    });
    dispatch({
      type: 'home/fetchTimeRanking',
      payload: rangePickerValue,
    });
  };

  selectDate = type => {
    const rangePickerValue = getTimeDistance(type);
    this.setState({
      rangePickerValue,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchStandingData',
      payload: rangePickerValue,
    });
    dispatch({
      type: 'home/fetchTimeRanking',
      payload: rangePickerValue,
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue } = this.state;
    const { home, loading } = this.props;
    const { gatherData, timeRanking, standingData } = home;
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <MonthPicker
          value={rangePickerValue[0]}
          onChange={this.handleMonthPickerChange}
          style={{ width: 100 }}
        />
      </div>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="设备数"
              loading={loading}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <h4>{numeral(gatherData[0].total).format('0,0')}</h4>}
              footer={<Field label="使用率" value={gatherData[0].rate} />}
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                使用数
                <span className={styles.trendText}>{gatherData[0].useCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="用户数"
              loading={loading}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(gatherData[1].total).format('0,0')}
              footer={<Field label="当前使用率" value={gatherData[1].rate} />}
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                使用数
                <span className={styles.trendText}>{gatherData[1].useCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="通知数"
              loading={loading}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(gatherData[2].total).format('0,0')}
              footer={<Field label="阅读率" value={gatherData[2].rate} />}
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                阅读量
                <span className={styles.trendText}>{gatherData[2].useCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="站立时长"
              loading={loading}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`${numeral(gatherData[3].total).format('0,0')}天`}
              footer={<Field label="站坐时间比例" value={gatherData[3].rate} />}
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                平均次数
                <span className={styles.trendText}>{gatherData[3].useCount}</span>
              </font>
            </ChartCard>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="站立时间趋势" key="views">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24} className={styles.scalesTab}>
                    <div className={styles.salesBar}>
                      <Bar height={292} title="" data={standingData} color="#A6D6D0" />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>人员站立时间排行</h4>
                      <ul className={styles.rankingList}>
                        {timeRanking.map((item, i) => (
                          <li key={item.title}>
                            <div>
                              <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                              <span>{item.title}</span>
                              <span>
                                {item.hours}
                                <i>小时</i>
                                {item.minutes}
                                <i>分钟</i>
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}
