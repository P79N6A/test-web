import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";

class Stackedpercentagecolumn extends React.Component {
  render() {
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(this.props.data)
      .transform({
        type: "percent",
        field: "value",
        // 统计销量
        dimension: "country",
        // 每年的占比
        groupBy: ["year"],
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
    return (
      <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend position="bottom-right" />
          <Axis name="year" />
          <Axis name="percent" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="year*percent"
            color={["country", ['#C2CBD3', '#BDE4E1', '#FCB0B1']]}
          />
        </Chart>
      </div>
    );
  }
}

export default Stackedpercentagecolumn;