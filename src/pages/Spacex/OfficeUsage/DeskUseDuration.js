// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Row, Col, Card, Icon, Popover, Radio, Spin } from 'antd';
import { LineBar } from '@/components/Charts';
import G from '@/global';

import styles from './index.less';

const RadioGroup = Radio.Group;

class DeskUseDuration extends Component {
  state = {
    loading: false,
    rank_list: [
      { title: '今年', value: 'LAST_YEAR' },
      { title: '近30天', value: 'LAST_30DAYS' },
      { title: '近7天', value: 'LAST_7DAYS' },
      { title: '昨日', value: 'LAST_DAY' },
    ],
  };

  setVisible(value, visible) {
    const { setVisible } = this.props;
    const params = {};
    params[`desk_use_rank_${value}`] = !visible;
    setVisible(params);
  }

  // 点击出现弹窗
  onShow = (value, visible) => {
    this.setVisible(value, !visible);
  };

  handleVisibleChange = visible => {
    const { deskUseRank } = this.props;
    const { status_type } = deskUseRank;
    this.setVisible(status_type, !visible);
  };

  // 选取9小时24小时
  onChange = e => {
    const { deskUseRank } = this.props;
    const { date_type } = deskUseRank;
    const { rank_list } = this.state;
    const { status_type } = deskUseRank;
    this.requireAvg(status_type, e.target.value, date_type);
    this.handleVisibleChange(false);
  };

  // 工位使用时长分布近七天
  onChangeType = value => {
    const { deskUseRank } = this.props;
    const { status_type } = deskUseRank;
    this.requireAvg(status_type, '', value);
  };

  // 请求数据
  requireAvg(status_type, condition_typeCopy, date_type) {
    this.setState({
      loading: true,
    });
    const { deskUseRank, dispatch } = this.props;
    const { condition_type } = deskUseRank;
    const date = G.moment().format('YYYY-MM-DD');
    dispatch({
      type: 'spacexOffice/getDeskUseRank',
      payload: {
        status_type,
        condition_type: condition_typeCopy || condition_type,
        date_type,
        date,
        callback: this.requestAllData.bind(this),
      },
    });
  }

  requestAllData(data) {
    this.setState({
      loading: false,
    });
  }

  fetchData() {
    const { deskUseRank } = this.props;
    const { status_type, condition_type, date_type } = deskUseRank;
    this.requireAvg(status_type, condition_type, date_type);
  }

  render() {
    const deskuseRateProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 24,
      xl: 9,
      xxl: 12,
      style: { marginBottom: 24 },
    };
    const deskuseRatePropsO = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 24,
      xl: 15,
      xxl: 12,
      style: { marginBottom: 24 },
    };
    const { rank_list, loading } = this.state;
    const { deskUseRank, color, desk_use_rank } = this.props;
    const { status_type, condition_type, date_type } = deskUseRank;
    const text = (
      <div>
        <p>注：</p>
        <p>9&nbsp;小&nbsp;时：仅统计工作时间内的时长</p>
        <p className={styles.time_solt}>（9:00~18:00）</p>
        <p>24小时：统计一天24小时内的时长</p>
        <p className={styles.time_solt}>（0:00~24:00）</p>
      </div>
    );
    const content = (
      <RadioGroup onChange={this.onChange} value={condition_type}>
        <Radio value="9">9小时</Radio>
        <Radio value="24">24小时</Radio>
      </RadioGroup>
    );
    return (
      <Card bordered={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
        <Row gutter={24}>
          <Col {...deskuseRateProps}>
            <h3 className={styles.deskDduration}>
              {status_type === 'HOT' ? '热门工位排行' : '空闲工位排行'}
            </h3>
          </Col>
          <Col {...deskuseRatePropsO}>
            <Popover
              placement="leftTop"
              visible={desk_use_rank}
              title={text}
              content={content}
              onClick={this.onShow.bind(this, status_type, desk_use_rank)}
              onVisibleChange={this.handleVisibleChange}
              trigger="click"
            >
              <Icon
                type="ellipsis"
                theme="outlined"
                style={{
                  float: 'right',
                  fontSize: '24px',
                  color: 'RGBA(53, 83, 108, 0.2)',
                  transform: 'rotate(90deg)',
                  marginLeft: '8px',
                  cursor: 'pointer',
                }}
              />
            </Popover>
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
          <div>
            <LineBar height={300} data={deskUseRank.dataList} color={color} />
            <Spin
              size="large"
              style={{
                display: loading ? 'block' : 'none',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          </div>
        </Row>
        <br />
      </Card>
    );
  }
}

export default DeskUseDuration;
