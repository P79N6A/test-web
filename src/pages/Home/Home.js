import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, DatePicker, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field, Bar } from '@/components/Charts';
import G from '@/global';
import { getTimeDistance } from '../../utils/utils';

import styles from './Home.less';

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

@connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/getHomeStand'],
}))
export default class Home extends Component {
  state = {
    rangePickerValue: getTimeDistance('DAILY'),
    type: 'DAILY'
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'home/getResourceNum' });
    dispatch({ type: 'home/getUserNum' });
    dispatch({ type: 'home/getNotificationCount' });
    dispatch({ type: 'home/getStandNum' });
    this.getHomeStand({});
  }

  getHomeStand({ date, type2 }) {
    const { dispatch } = this.props;
    const { rangePickerValue, type } = this.state;
    dispatch({
      type: 'home/getHomeStand',
      payload: {
        date:
          G.moment(date).format('YYYY-MM-DD') || G.moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        type: type2 || type,
      },
    });
    dispatch({
      type: 'home/getHomeRank',
      payload: {
        date:
          G.moment(date).format('YYYY-MM-DD') || G.moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        type: type2 || type,
      },
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
    this.setState({ rangePickerValue, type: 'MONTHLY' });
    this.getHomeStand({ date: rangePickerValue[0], type2: 'MONTHLY' });
  };

  selectDate = type => {
    const rangePickerValue = getTimeDistance(type);
    this.setState({ rangePickerValue, type });
    this.getHomeStand({ date: rangePickerValue[0], type2: type });
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

  disabledDate = (nowValue) => {
    const oldValue = G.moment();
    return nowValue.valueOf() > oldValue.valueOf();
  }

  render() {
    const { rangePickerValue } = this.state;
    const { home } = this.props;
    const { resourceNum, userNum, notificationNum, standNum, homeStand, homeRank } = home;
    // return null;
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('DAILY')} onClick={() => this.selectDate('DAILY')}>
            今日
          </a>
          <a className={this.isActive('WEEKLY')} onClick={() => this.selectDate('WEEKLY')}>
            近7天
          </a>
          <a className={this.isActive('MONTHLY')} onClick={() => this.selectDate('MONTHLY')}>
            近30天
          </a>
          <a className={this.isActive('YEARLY')} onClick={() => this.selectDate('YEARLY')}>
            近1年
          </a>
        </div>
        <MonthPicker
          allowClear={false}
          value={rangePickerValue[0]}
          onChange={this.handleMonthPickerChange}
          style={{ width: 100 }}
          locale={'zh-cn'}
          disabledDate={this.disabledDate}
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
              style={{ borderRadius: '4px' }}
              title="设备数"
              total={() => <h4>{numeral(resourceNum.totalCount).format('0,0')}</h4>}
              footer={
                <Field
                  label="使用率"
                  value={resourceNum.totalCount === 0 ? '0.00%' : `${Number((resourceNum.liveCount / resourceNum.totalCount) * 100).toFixed(
                    2
                  ) || 0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                使用数
                <span className={styles.trendText}>{resourceNum.liveCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title="用户数"
              total={numeral(userNum.totalCount).format('0,0')}
              footer={
                <Field
                  label="当前使用率"
                  value={userNum.totalCount === 0 ? '0.00%' : `${Number((userNum.liveCount / userNum.totalCount) * 100).toFixed(2) ||
                    0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                使用数
                <span className={styles.trendText}>{userNum.liveCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title="通知数"
              total={numeral(notificationNum.total).format('0,0')}
              footer={
                <Field
                  label="阅读率"
                  value={notificationNum.viewTotal === 0 ? '0.00%' : `${Number(
                    (notificationNum.viewTotal /
                      (notificationNum.viewTotal + notificationNum.unreadTotal)) *
                    100
                  ).toFixed(2) || 0}% `}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                阅读量
                <span className={styles.trendText}>{notificationNum.viewTotal}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title="站立时长"
              total={`${parseInt(standNum.duration)}天`}
              footer={
                <Field
                  label="站坐时间比例"
                  value={`${Number(standNum.rate * 100).toFixed(2) || 0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                平均次数
                <span className={styles.trendText}>{standNum.count}</span>
              </font>
            </ChartCard>
          </Col>
        </Row>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: '4px' }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="站立时间趋势" key="views">
                <Row>
                  <Col xl={16} lg={16} md={16} sm={24} xs={24} className={styles.scalesTab}>
                    <div className={styles.salesBar}>
                      {homeStand.length > 0 ? (
                        <Bar padding={0} height={400} title="单位（h）" data={homeStand} color="#A6D6D0" autoLabel={false} />
                      ) : (
                          <div className={styles.emptyBar}>
                            <img src={`${G.picUrl}stand_time_trend_none.png`} />
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>人员站立时间排行</h4>
                      {homeRank && homeRank.length > 0 ? (
                        <ul className={styles.rankingList}>
                          {homeRank.map((item, i) => {
                            const { duration, username } = item;
                            const days = G.moment.duration(duration, 'm').days();
                            const hours = G.moment.duration(duration, 'm').hours();
                            const minutes = G.moment.duration(duration, 'm').minutes();
                            return (
                              <li key={`standRank${i}`}>
                                <div>
                                  <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                  <span>{username}</span>
                                  <span>
                                    {days || null}
                                    {days ? <i>天</i> : null}
                                    {hours || null}
                                    {hours ? <i>小时</i> : null}
                                    {minutes || null}
                                    {minutes ? <i>分钟</i> : <i style={{ fontSize: 14 }}>0<i>分钟</i></i>}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                          <div className={styles.emptyRand}>
                            <img src={`${G.picUrl}stand_time_rank_none.png`} />
                          </div>
                        )}
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
