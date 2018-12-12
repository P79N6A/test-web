import React from "react";
import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import { Icon } from 'antd';

class Area extends React.Component {
  render() {
    const data = this.props.data;
    const cols = {
      value: {
        min: 0,
        type: 'linear',
        tickCount: 3, // 定义坐标轴刻度线的条数，默认为 5
      },
      date: {
        range: [0, 1],
      },
    };
    return (
      <div style={{ position: 'relative' }}>
        <Chart height={220} data={data} scale={cols} forceFit>
          <Axis name="date" />
          <Axis
            name="value"
            label={{
              formatter: val => {
                return `${val  }h`;
              },
            }}
          />
          <Tooltip
            crosshairs={{
              type: "line",
            }}
            itemTpl={`<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{value} 小时/工位数</li>`}
          />
          <Geom type="area" position="date*value" color="rgb(166, 214, 208)" />
          <Geom type="line" position="date*value" size={3} color="rgb(166, 214, 208)" />
        </Chart>
        <div style={{ position: 'absolute', right: '0', bottom: '20px' }}>
          <Icon style={{ color: '#A6D6D0', marginRight: '6px' }} type="minus" />
          <font style={{ color: '#9AA9B5', fontSize: '12px' }}>日平均时长（小时/工位数）</font>
        </div>
      </div>
    );
  }
}

export default Area;