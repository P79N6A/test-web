import React, { Component } from 'react';
import { Chart, Geom, Axis, Coord } from 'bizcharts';
import { Progress } from 'antd';
import DataSet from '@antv/data-set';

import styles from './index.less';

class PageCount extends Component {
  constructor(props) {
    super(props);
    this.defaultData = [
      {
        item: 'active',
        count: props.occupiedCount,
      },
      {
        item: 'free',
        count: props.vacantCount,
      },
      {
        item: 'offline',
        count: props.offlineCount,
      },
    ];
  }

  getData(offlineCount, vacantCount, occupiedCount) {
    const data = [];
    data.push({ item: 'active', count: occupiedCount });
    data.push({ item: 'free', count: vacantCount });
    data.push({ item: 'offline', count: offlineCount });
    return data;
  }

  render() {
    const { offlineCount, vacantCount, occupiedCount } = this.props;
    const { DataView } = DataSet;
    const data = this.getData(offlineCount, vacantCount, occupiedCount);
    const dv = new DataView();
    const totalCount = offlineCount + vacantCount + occupiedCount;
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = `${val * 100}%`;
          return val;
        },
      },
    };
    const scale = Math.floor(parseFloat(document.documentElement.style.fontSize)) / 10;
    return (
      <div className={styles.container}>
        <div className={styles.topView}>
          <font className={styles.dataText}>实时数据</font>
          <div className={styles.chartView}>
            <Chart height={200 * scale} data={dv} scale={cols} padding={[0, 0, 0, 0]} forceFit>
              <Coord type="theta" radius={0.75} innerRadius={0.6} />
              <Axis name="percent" />
              <Geom
                type="intervalStack"
                position="percent"
                color={[
                  'item',
                  item => {
                    if (item === 'active') return '#FCB0B1';
                    if (item === 'free') return '#A6D6D0';
                    else return '#C2CBD3';
                  },
                ]}
                style={{
                  lineWidth: 1,
                  stroke: '#fff',
                }}
              />
            </Chart>
          </div>
          <div className={styles.totalView}>
            <font className={styles.countText} style={{ marginLeft: 0 }}>
              工位总数
            </font>
            <font className={styles.totalText}>{totalCount}</font>
          </div>
          <div style={{ flex: 1 }} />
          <div className={styles.lineView}>
            <div className={styles.activeDot} />
            <font className={styles.countText}>使用工位数</font>
            <div style={{ flex: 1 }} />
            <font className={styles.numberText}>{occupiedCount}</font>
          </div>
          <div className={styles.lineView}>
            <div className={styles.freeDot} />
            <font className={styles.countText}>空闲工位数</font>
            <div style={{ flex: 1 }} />
            <font className={styles.smallText}>{vacantCount}</font>
          </div>
        </div>
        <div style={{ height: '24px' }} />
        <div className={styles.bottomView}>
          <font className={styles.dataText}>使用率</font>
          <div className={styles.progressView}>
            <Progress
              type="line"
              percent={parseInt((occupiedCount / totalCount) * 100, 10)}
              showInfo={false}
              strokeWidth={14}
            />
          </div>
          <div className={styles.lineView}>
            <div className={styles.activeDot} />
            <font className={styles.countText}>工位使用率</font>
            <div style={{ flex: 1 }} />
            <font className={styles.rateText}>
              {parseInt((occupiedCount / totalCount) * 100, 10)}
              <font style={{ fontSize: '18px' }}>%</font>
            </font>
          </div>
        </div>
      </div>
    );
  }
}

export default PageCount;
