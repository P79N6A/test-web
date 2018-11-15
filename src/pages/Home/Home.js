import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field, Bar } from '@/components/Charts';
import G from '@/global';
import { getTimeDistance } from '../../utils/utils';

import styles from './Home.less';

const { TabPane } = Tabs;

@connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/getHomeStand'],
}))
export default class Home extends Component {
  state = {
    rangePickerValue: getTimeDistance('LAST_DAY'),
    type: 'LAST_DAY'
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
          G.moment().format('YYYY-MM-DD'),
        type: type2 || type,
      },
    });
    dispatch({
      type: 'home/getHomeRank',
      payload: {
        date:
          G.moment().format('YYYY-MM-DD'),
        type: type2 || type,
      },
    });
  }

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
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('LAST_DAY')} onClick={() => this.selectDate('LAST_DAY')}>
            <FormattedMessage id="home.yesterday" />
          </a>
          <a className={this.isActive('LAST_7DAYS')} onClick={() => this.selectDate('LAST_7DAYS')}>
            <FormattedMessage id="home.nearly.seven.day" />
          </a>
          <a className={this.isActive('LAST_30DAYS')} onClick={() => this.selectDate('LAST_30DAYS')}>
            <FormattedMessage id="home.nearly.thirty.day" />
          </a>
          <a className={this.isActive('LAST_YEAR')} onClick={() => this.selectDate('LAST_YEAR')}>
            <FormattedMessage id="home.nearly.one.year" />
          </a>
        </div>
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
              title={formatMessage({ id: 'home.device.number' })}
              total={() => <h4>{numeral(resourceNum.totalCount).format('0,0')}</h4>}
              footer={
                <Field
                  label={formatMessage({ id: 'home.inuse.rate' })}
                  value={resourceNum.totalCount === 0 ? '0.00%' : `${Number((resourceNum.liveCount / resourceNum.totalCount) * 100).toFixed(
                    2
                  ) || 0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                <FormattedMessage id="home.inuse.number" />
                <span className={styles.trendText}>{resourceNum.liveCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title={formatMessage({ id: 'home.users.number' })}
              total={numeral(userNum.totalCount).format('0,0')}
              footer={
                <Field
                  label={formatMessage({ id: 'home.inuse.rate' })}
                  value={userNum.totalCount === 0 ? '0.00%' : `${Number((userNum.liveCount / userNum.totalCount) * 100).toFixed(2) ||
                    0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                <FormattedMessage id="home.inuse.number" />
                <span className={styles.trendText}>{userNum.liveCount}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title={formatMessage({ id: 'home.notice.number' })}
              total={numeral(notificationNum.total).format('0,0')}
              footer={
                <Field
                  label={formatMessage({ id: 'home.reading.rate' })}
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
                <FormattedMessage id="home.reading.volume" />
                <span className={styles.trendText}>{notificationNum.viewTotal}</span>
              </font>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              style={{ borderRadius: '4px' }}
              title={formatMessage({ id: 'home.standing.time' })}
              total={standNum.duration ? `${parseInt(standNum.duration)}${formatMessage({ id: 'home.day' })}` : 0}
              footer={
                <Field
                  label={formatMessage({ id: 'home.standing.time.ratio' })}
                  value={`${Number(standNum.rate * 100).toFixed(2) || 0}%`}
                />
              }
              contentHeight={46}
            >
              <font style={{ marginRight: 16 }}>
                <FormattedMessage id="home.average.number" />
                <span className={styles.trendText}>{standNum.count ? standNum.count : 0}</span>
              </font>
            </ChartCard>
          </Col>
        </Row>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: '4px' }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab={formatMessage({ id: 'home.standing.time.trend' })} key="views">
                <Row>
                  <Col xl={16} lg={16} md={16} sm={24} xs={24} className={styles.scalesTab}>
                    <div className={styles.salesBar}>
                      {homeStand.length > 0 ? (
                        <Bar padding={0} height={400} title={`${formatMessage({ id: 'home.unit' })}(${formatMessage({ id: 'home.hour' })})`} data={homeStand} color="#A6D6D0" autoLabel={false} />
                      ) : (
                          <div className={styles.emptyBar}>
                            <img src={`${G.picUrl}${formatMessage({ id: "stand.time.trend.none" })}`} />
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}><FormattedMessage id="home.person.standing.time.ranking" /></h4>
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
                                  <font className={i < 3 ? styles.active : ''}>{i + 1}</font>
                                  <font>{username}</font>
                                  <font>
                                    {days || null}
                                    {days ? <i><FormattedMessage id="home.day" /></i> : null}
                                    {hours || null}
                                    {hours ? <i><FormattedMessage id="home.hour" /></i> : null}
                                    {minutes || null}
                                    {minutes ? <i><FormattedMessage id="home.minute" /></i> : <i style={{ fontSize: 14 }}>0<i><FormattedMessage id="home.minute" /></i></i>}
                                  </font>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                          <div className={styles.emptyRand}>
                            <img src={`${G.picUrl}${formatMessage({ id: "stand.time.rank.none" })}`} />
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
