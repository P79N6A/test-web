import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Card, Spin, Radio } from 'antd';
import PercentageStackedHistogram from "@/components/Charts/PercentageStackedHistogram";
import Area from '@/components/Charts/Area';
import Stackedcolumn from '@/components/Charts/Stackedcolumn';

import G from '@/global';
import styles from './StationRate.less';

class StationRate extends Component {
  state = {
    loading: false,
  }

  // 选取时长还是工位
  onChange = e => {
    this.changeGlobal({ type: e.target.value });
  };

  // 修改参数
  changeGlobal(type) {
    const { dispatch, use_rate } = this.props;
    dispatch({
      type: 'office/changeGlobalType',
      payload: {
        use_rate: {
          ...use_rate,
          ...type
        }
      }
    });
    this.setState({
      loading: true
    });
    this.getData(type);
  }

  // 请求接口
  getData(value) {
    const { dispatch, use_rate, condition_type } = this.props;
    dispatch({
      type: 'office/getUseRate',
      payload: {
        ...use_rate,
        ...value,
        condition_type,
        callback: this.closeLoding.bind(this)
      }
    });
  }

  // 请求接口成功之后或者失败的函数
  closeLoding(res) {
    this.setState({
      loading: false
    });
  }


  render() {
    const { loading } = this.state;
    const { useRate, use_rate } = this.props;
    const { useRateTend, useRateAverage, date } = useRate;
    return (
      <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
        <div className={styles.deskDdurationBox}>
          <span className={styles.deskDduration}><FormattedMessage id="spaceUsage.station-usage-trend" /></span>
          <Radio.Group className={styles.deskType} buttonStyle="solid" onChange={this.onChange.bind(this)} value={use_rate.type}>
            <Radio.Button value={'duration'}><FormattedMessage id="spaceUsage.duration" /></Radio.Button>
            <Radio.Button value={'workStation'}><FormattedMessage id="spaceUsage.station" /></Radio.Button>
          </Radio.Group>
          <ul className={styles.selector}>
            <a
              className={use_rate.date_type === 'LAST_7DAYS' ? '' : styles.active}
              onClick={this.changeGlobal.bind(this, { date_type: 'LAST_7DAYS' })}
            >
              {' '}
              <FormattedMessage id="home.nearly.seven.day" />
            </a>
            <a
              className={use_rate.date_type === 'LAST_30DAYS' ? '' : styles.active}
              onClick={this.changeGlobal.bind(this, { date_type: 'LAST_30DAYS' })}
            >
              {' '}
              <FormattedMessage id="home.nearly.thirty.day" />
            </a>
            <a
              className={use_rate.date_type === 'LAST_1YEAR' ? '' : styles.active}
              onClick={this.changeGlobal.bind(this, { date_type: 'LAST_1YEAR' })}
            >
              {' '}
              <FormattedMessage id="home.nearly.one.year" />
            </a>
          </ul>
        </div>
        {useRate && useRate.useRateTend && useRate.useRateTend.length > 0 ? (
          <div style={{ position: 'relative' }}>
            {
              use_rate.type === 'duration' ?
                <PercentageStackedHistogram data={useRateTend} color={['#C2CBD3', '#BDE4E1', '#FCB0B1']} />
                :
                <Stackedcolumn data={useRateTend} date={date} />
            }
            <Area data={useRateAverage} />
            <Spin size="large" style={{ display: loading ? 'block' : 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
          </div>
        ) : (
            <div className={styles.emptyBar}>
              <font className={styles.emptyText}><FormattedMessage id="spaceUsage.none" /></font>
            </div>
          )}
      </Card>
    );
  }
}

export default StationRate;
