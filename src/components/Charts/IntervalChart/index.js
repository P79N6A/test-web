// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';

class IntervalChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    const dv = new DataSet.View().source(data);
    dv.transform({
      type: 'fold',
      fields: ['duraction'],
      key: 'type',
      value: 'value',
    });
    const scale = {
      duraction: {
        tickCount: 6,
        alias: 'Using Hour',
        formatter(val) {
          return `${val} h`;
        },
      },
      date: {
        tickCount: 8,
        formatter(val) {
          return val < 10 ? `0${val}:00` : `${val}:00`;
        },
      },
    };
    const labelX = {
      offset: 10,
      textStyle: {
        textAlign: 'center',
        fill: '#9AA9B5',
        fontSize: '10',
        fontWeight: 'regular',
      },
      autoRotate: false,
    };
    const labelY = { ...labelX, offset: 30 };
    return (
      <div
        style={{
          flex: 1,
          marginLeft: '-30px',
          padding: '10px 0',
          height: '220px',
        }}
      >
        <Chart height={280} data={data} scale={scale} forceFit>
          <Axis name="date" label={labelX} />
          <Axis name="duraction" label={labelY} />
          <Tooltip />
          <Geom type="interval" position="date*duraction" color="#FCB0B1" />
        </Chart>
      </div>
    );
  }
}

export default IntervalChart;
