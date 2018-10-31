import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class LineBar extends Component {
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
    const {
      height,
      title,
      forceFit = true,
      data,
      color,
      padding,
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
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
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={data}
            padding={padding || 'auto'}
          >
            <Axis
              name="x"
              title={false}
              textStyle={{
                textAlign: 'left',
                textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
              }}
              label={{
                htmlTemplate(text, data, index) {
                  let bgcolor = '';
                  if (index < 7) {
                    bgcolor = 'rgba(53, 83, 108, 0.4)'
                  } else {
                    bgcolor = 'rgba(53, 83, 108, 1)'
                  }
                  return `<span style="color:#fff;background:${bgcolor};padding:0 2px;border-radius:4px;">${(10 - index) == 10 ? 10 : '0' + (10 - index)}</span>&nbsp;&nbsp;<span>${text}</span>`
                },
              }}
              tickLine={autoHideXLabels ? false : {}}
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
                }
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

export default LineBar;
