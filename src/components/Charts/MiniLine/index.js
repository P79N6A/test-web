import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class MiniLine extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  render() {
    const { height, title, forceFit = true, data, color, padding } = this.props;
    const { autoHideXLabels } = this.state;
    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
        tickCount: 5,
      },
    };
    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: `${y}h`,
      }),
    ];
    return (
      <div style={{ height, marginLeft: '40px', width: '200px' }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={data}
            padding={padding || 'auto'}
          >
            <Axis
              name="x"
              label={{
                htmlTemplate(text, data, index) {
                  let bgcolor = '';
                  let paddingRight = '10px';
                  if (index < 7) {
                    bgcolor = 'rgba(53,83,108,0.4)';
                  } else {
                    bgcolor = '#35536C';
                  }
                  if (index === 0) paddingRight = '5px';
                  return `<div style="position:absolute; left:23px; bottom:-10px; "><font style="font-size:8px;color:${bgcolor};padding-right:${paddingRight};">${10 -
                    index}</font><font style="font-size:8px;color:#9aa9b5;">${text}</font></div>`;
                },
                offset: 0,
              }}
            />
            <Axis
              name="y"
              color={color}
              min={0}
              label={{
                formatter(text) {
                  return `${text}h`;
                },
                textStyle: {
                  fill: '#9AA9B5',
                  fontSize: '10',
                },
                offset: 5,
              }}
            />
            <Coord transpose />
            <Tooltip showTitle={false} crosshairs={false} />
            <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
          </Chart>
        </div>
      </div>
    );
  }
}

export default MiniLine;
