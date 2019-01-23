// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";

class Stackedcolumn extends React.Component {
  render() {
    const { data, date } = this.props;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: date,
      key: "时间",
      value: "个数"
    });
    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Legend position='bottom-right' />
          <Axis name="时间" />
          <Axis name="个数" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="时间*个数"
            color={['type', (type) => {
              if (type === '离线') {
                return '#C2CBD3'
              } else if (type === '空闲') {
                return '#BDE4E1'
              } else if (type === '使用') {
                return '#FCB0B1'
              }
            }]}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default Stackedcolumn;
