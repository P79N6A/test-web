import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Spin } from 'antd';
import * as charts from 'bizcharts';
import DataSet from '@antv/data-set';

import G from '@/global';
import styles from './StationRate.less';

class StationRate extends Component {
  state = {
    loading: false,
  }

  getColor(status) {
    if (status === formatMessage({ id: "device.use" })) return '#FCB0B1';
    if (status === formatMessage({ id: "device.leisure" })) return '#BDE4E1';
    return '#F3F3F3';
  }

  getUseRate(type) {
    this.setState({
      loading: true
    })
    const { dispatch } = this.props;
    const date = G.moment(new Date()).format('YYYY-MM-DD');
    dispatch({ type: 'office/getUseRate', payload: { type, date, callback: this.requestAllData.bind(this) } });
  }

  requestAllData(data) {
    this.setState({
      loading: false
    })
  }

  render() {
    const { loading } = this.state;
    const { useRate } = this.props;
    const { data, type } = useRate;
    const { DataView } = DataSet;
    const dv = new DataView().source(data);
    dv.transform({
      type: 'percent',
      field: 'value',
      dimension: 'status',
      groupBy: ['date'],
      as: 'percent',
    });
    const cols = {
      date: {
        type: 'linear',
        tickInterval: type === 'MONTHLY' ? 5 : 1,
      },
      percent: {
        formatter(value) {
          let percent = value || 0;
          percent *= 100;
          return `${parseInt(percent, 10)}%`;
        },
        alias: 'percent(%)',
      },
      sales: {
        alias: 'date',
      },
    };
    return (
      <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
        <div>
          <span className={styles.deskDduration}><FormattedMessage id="spaceUsage.station.usage.trend" /></span>
          <ul className={styles.selector}>
            <a
              className={type === 'WEEKLY' ? '' : styles.active}
              onClick={this.getUseRate.bind(this, 'WEEKLY')}
            >
              {' '}
              <FormattedMessage id="spaceUsage.week" />
            </a>
            <a
              className={type === 'MONTHLY' ? '' : styles.active}
              onClick={this.getUseRate.bind(this, 'MONTHLY')}
            >
              {' '}
              <FormattedMessage id="spaceUsage.month" />
            </a>
          </ul>
          {data.length > 0 ? (
            <div style={{ position: 'relative' }}>
              <charts.Chart height={400} data={dv} scale={cols} padding="auto" forceFit>
                <charts.Axis
                  name="date"
                  label={{
                    formatter(text) {
                      if (type === 'WEEKLY') {
                        return G.moment(G.moment().day(text)._d).format('dddd');
                      }
                      if (type === 'YEARLY') {
                        return `${text}${formatMessage({ id: "spaceUsage.months" })}`;
                      }
                      return `${text}${formatMessage({ id: "spaceUsage.days" })}`;
                    },
                    textStyle: {
                      fill: '#9AA9B5',
                    },
                  }}
                /><br />
                <charts.Axis
                  name="percent"
                  label={{
                    textStyle: {
                      fill: '#9AA9B5',
                    },
                  }}
                />
                <charts.Legend position="bottom-right" marker="circle" />
                <charts.Tooltip crosshairs={{ type: 'line' }} />
                <charts.Geom
                  type="areaStack"
                  position="date*percent"
                  opacity={1}
                  color={['status', this.getColor.bind(this)]}
                  tooltip={[
                    'time*status*percent',
                    (time, status, percent) => ({
                      name: status,
                      title: `${time}`,
                      value: `${parseInt(percent * 100, 10)}%`,
                    }),
                  ]}
                />
                <charts.Geom
                  type="lineStack"
                  position="date*percent"
                  size={2}
                  color={['status', this.getColor.bind(this)]}
                />
              </charts.Chart>
              <Spin size="large" style={{ display: loading ? 'block' : 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
            </div>
          ) : (
              <div className={styles.emptyBar}>
                <font className={styles.emptyText}><FormattedMessage id="spaceUsage.none" /></font>
              </div>
            )}
        </div>
        <br />
      </Card>
    );
  }
}

export default StationRate;
