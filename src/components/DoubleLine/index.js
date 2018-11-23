import React from 'react';
import G from '@/global';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

const startTime = 1540137600;
class DoubleLine extends React.Component {
  random(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  getData() {
    const data = [];
    for (let i = 0; i < 31; i++) {
      const moment = G.moment
        .unix(startTime)
        .add(i, 'day')
        .unix();
      const standCount = this.random(200, 1200);
      const liftCount = this.random(200, 1200);
      data.push({
        moment,
        time: G.moment.unix(moment).format('M月D日'),
        standNumber: this.random(20, 400), // 站立人数
        liftNumber: this.random(20, 400), // 升降人数
        standCount, // 站立次数
        liftCount, // 升降次数
        standCountCopy: standCount - 100,
        liftCounCopy: liftCount - 50,
        index: `${i}`,
      });
    }
    return data;
  }

  render() {
    const getG2Instance = chart => {
      chartIns = chart;
    };
    const data = this.getData();
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['standNumber', 'liftNumber'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });
    const scale = {
      standCount: {
        type: 'linear',
        min: 0,
        max: 1200,
      },
      liftCount: {
        type: 'linear',
        min: 0,
        max: 1200,
      },
      standCountCopy: {
        type: 'linear',
        min: 0,
        max: 1200,
      },
      liftCountCopy: {
        type: 'linear',
        min: 0,
        max: 1200,
      },
      value: {
        type: 'linear',
        min: 0,
        max: 1200,
        tickInterval: 200, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
        tickCount: 6, // 定义坐标轴刻度线的条数，默认为 5
      },
    };
    return (
      <div>
        <Chart height={400} data={dv} scale={scale} padding={['auto', '10%']} forceFit>
          <Legend />
          <Axis
            name="index"
            label={{
              formatter: val => {
                if (val % 5 === 0) {
                  return data[val].time;
                }
                return '';
              },
              autoRotate: false,
            }}
          />
          <Axis name="value" position="left" />
          <Tooltip />
          <Geom
            type="interval"
            position="index*value"
            color={[
              'type',
              value => {
                if (value === 'standNumber') {
                  return '#A6D6D0';
                }
                return '#FCB0B1';
              },
            ]}
            adjust={[
              {
                type: 'dodge',
                marginRatio: 1 / 32,
              },
            ]}
          />
          <Geom type="line" position="index*standCount" color="#A6D6D0" size={3} shape="smooth" />
          <Geom type="point" position="index*standCount" color="#A6D6D0" size={3} shape="circle" />
          <Geom type="line" position="index*liftCount" color="#FCB0B1" size={3} shape="smooth" />
          <Geom type="point" position="index*liftCount" color="#FCB0B1" size={3} shape="circle" />
        </Chart>
      </div>
    );
  }
}

export default DoubleLine;
