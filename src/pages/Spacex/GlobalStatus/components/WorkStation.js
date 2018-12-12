import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Spin } from 'antd';
import DataSet from '@antv/data-set';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ globalStatus, loading }) => ({
  globalStatus,
  loading: loading.effects['globalStatus/getWorkStation'],
}))
class WorkStation extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalStatus/getWorkStation',
    });
  }

  render() {
    const { globalStatus, loading } = this.props;
    const { workStation } = globalStatus;

    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(workStation)
      .transform({
        type: 'percent',
        field: 'value',
        dimension: 'type',
        groupBy: ['date'],
        as: 'percent',
      });
    const cols = {
      percent: {
        min: 0,
        mix: 1,
        formatter(val) {
          return `${(val * 100).toFixed(0)}%`;
        },
      },
      date: {
        tickInterval: 1, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
      },
    };
    const labelX = {
      offset: 10, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
      textStyle: {
        textAlign: 'center', // 文本对齐方向，可取值为： start center end
        fill: '#9AA9B5', // 文本的颜色
        fontSize: '10', // 文本大小
        fontWeight: 'regular', // 文本粗细
      },
      formatter(text) {
        return text.split('/')[0];
      },
    };
    const labelY = { ...labelX, offset: 30 };

    return (
      <div className={styles.workStationView}>
        <div className={styles.workStationTitleView}>
          <font className={styles.workStationTitle}>Trending in Workstation Utilization</font>
          <div style={{ flex: 1 }} />
          <div className={styles.workStationOccupiedCircle} />
          <font className={styles.workStationOccupied}>Occupied</font>
          <div className={styles.workStationVacantCircle} />
          <font className={styles.workStationOccupied}>Vacant</font>
          <div className={styles.workStationOfflineCircle} />
          <font className={styles.workStationOccupied}>Offline</font>
        </div>
        <div style={{ flex: 1, marginLeft: -30, overflow: 'hidden', height: '240px' }}>
          <Chart height={300} data={dv} scale={cols} forceFit>
            <Axis name="date" label={labelX} />
            <Axis name="percent" label={labelY} />
            <Tooltip />
            <Geom
              type="intervalStack"
              position="date*percent"
              color={['type', ['#E0E5E9', '#BDE4E1', '#FCB0B1']]}
            />
          </Chart>
        </div>
        <Spin
          size="large"
          style={{
            display: loading ? 'block' : 'none',
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
        />
      </div>
    );
  }
}

export default WorkStation;
