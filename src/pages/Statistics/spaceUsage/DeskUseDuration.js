import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Spin } from 'antd';
import { LineBar } from '@/components/Charts';
import G from '@/global';

import styles from './index.less';

class DeskUseDuration extends Component {
  state = {
    loading: false,
    rank_list: [
      { title: formatMessage({ id: 'spaceUsage.year' }), value: 'LAST_YEAR' },
      { title: formatMessage({ id: 'home.nearly.thirty.day' }), value: 'LAST_30DAYS' },
      { title: formatMessage({ id: 'home.nearly.seven.day' }), value: 'LAST_7DAYS' },
      { title: formatMessage({ id: 'spaceUsage.yesterday' }), value: 'LAST_DAY' },
    ],
  };

  // 工位使用时长分布近七天
  onChangeType = value => {
    const { desk_use_rank } = this.props;
    const { status_type } = desk_use_rank;
    this.requireAvg(status_type, value);
  };

  // 修改参数
  changeGlobal(type, cont) {
    const { dispatch, desk_use_rank } = this.props;
    if (cont === 'HOT') {
      dispatch({
        type: 'office/changeGlobalType',
        payload: {
          desk_use_rank_hot: {
            ...desk_use_rank,
            ...type
          }
        }
      });
    } else {
      dispatch({
        type: 'office/changeGlobalType',
        payload: {
          desk_use_rank_free: {
            ...desk_use_rank,
            ...type
          }
        }
      });
    }
  }

  // 请求数据
  requireAvg(status_types, date_types) {
    this.setState({
      loading: true
    })
    const { desk_use_rank, dispatch, condition_type } = this.props;
    const { date_type, status_type } = desk_use_rank;
    const date = G.moment().format('YYYY-MM-DD');
    dispatch({
      type: 'office/getDeskUseRank',
      payload: {
        status_type: status_types ? status_types : status_type,
        condition_type,
        date_type: date_types ? date_types : date_type,
        date,
        callback: this.requestAllData.bind(this),
      },
    });
    this.changeGlobal({ date_type: date_types }, status_types ? status_types : status_type)
  }

  requestAllData(data) {
    this.setState({
      loading: false
    })
  }

  render() {
    const deskuseRateProps = { xs: 24, sm: 12, md: 12, lg: 24, xl: 9, xxl: 12, style: { marginBottom: 24 } };
    const deskuseRatePropsO = { xs: 24, sm: 12, md: 12, lg: 24, xl: 15, xxl: 12, style: { marginBottom: 24 } };
    const { rank_list, loading } = this.state;
    const { desk_use_rank, color, deskUseRank } = this.props;
    const { status_type, date_type } = desk_use_rank;
    return (
      <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
        <Row gutter={24}>
          <Col {...deskuseRateProps}>
            <h3 className={styles.deskDduration}>
              {status_type === 'HOT' ? formatMessage({ id: 'spaceUsage.hot-station-rank' }) : formatMessage({ id: 'spaceUsage.free-station-rank' })}
            </h3>
          </Col>
          <Col {...deskuseRatePropsO}>
            {rank_list.map((item, index) => (
              <span
                key={`rank${index + 1}`}
                className={item.value === date_type ? styles.avg_times_active : styles.avg_times}
                onClick={this.onChangeType.bind(this, item.value)}
              >
                {item.title}
              </span>
            ))}
          </Col>
        </Row>
        <Row gutter={24} style={{ paddingLeft: '90px', position: 'relative' }}>
          {deskUseRank.dataList && deskUseRank.dataList.length > 0 ? <div>
            <LineBar height={300} data={deskUseRank.dataList} color={color} />
            <Spin size="large" style={{ display: loading ? 'block' : 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
          </div> :
            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-90px' }}>
              <FormattedMessage id="spaceUsage.none" />
            </div>}
        </Row>
        <br />
      </Card>
    );
  }
}

export default DeskUseDuration;
