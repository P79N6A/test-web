import React from "react";
import { Chart, Geom, Axis, Tooltip } from "bizcharts";

class Basic extends React.Component {
  render() {
    const { data } = this.props.data;
    const cols = {
      value: {
        min: 10000
      },
      year: {
        range: [0, 1]
      }
    };
    return (
      <div>
        <Chart height={200} data={data} scale={cols} forceFit>
          <Axis name="year" />
          <Axis
            name="value"
            label={{
              formatter: val => {
                return (val / 10000).toFixed(1) + "h";
              }
            }}
          />
          <Tooltip
            crosshairs={{
              type: "line"
            }}
          />
          <Geom type="area" position="year*value" color="rgba(166, 214, 208, 0.2)" />
          <Geom type="line" position="year*value" size={2} color="#A6D6D0" />
        </Chart>
      </div>
    );
  }
}

export default Basic;