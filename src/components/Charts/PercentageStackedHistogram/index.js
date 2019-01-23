// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";

class PercentageStackedHistogram extends React.Component {
  // type（第一个传入的是最上面的一个type）
  // color（第一个传入的是最上面的一个颜色）
  // date（是字符串，按传入的先后顺序展示）
  render() {
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(this.props.data)
      .transform({
        type: "percent",
        field: "value",
        // 统计销量
        dimension: "type",
        // 每年的占比
        groupBy: ["date"],
        // 以不同产品类别为分组
        as: "percent"
      });
    const cols = {
      percent: {
        min: 0,
        formatter(val) {
          return (val * 100).toFixed(2) + "%";
        }
      }
    };
    const { color } = this.props;
    return (
      <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend position="bottom-right" />
          <Axis name="date" />
          <Axis name="percent" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="date*percent"
            color={["type", color]}
          />
        </Chart>
      </div>
    );
  }
}

export default PercentageStackedHistogram;