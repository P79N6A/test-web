import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Popover, Icon, Radio } from 'antd';
import G from '@/global';
import Deskcount from './DeskCount';
import Yusecount from './YuseCount';
import Yunusecount from './YunuseCount';
import StationRate from './StationRate';
import ServiceDuration from './ServiceDuration';
import DeskDuration from './DeskDuration';
import DeskUseDuration from './DeskUseDuration';
import styles from './index.less'

const RadioGroup = Radio.Group;

@connect(({ office, loading }) => ({
  office,
  loading: loading.effects['office/getUseRate'],
}))
export default class OfficeUsage extends Component {

  componentDidMount() {
    const { dispatch, office } = this.props;
    const { condition_type } = office.global;
    // 初进页面调取接口
    this.obOneLine({ condition_type });
    this.obUseRate({ condition_type });
  }

  // 选取9小时24小时
  onChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'office/changeGlobalType',
      payload: {
        condition_type: e.target.value
      },
    });
    // 修改完成之后，重新调取各个接口
    this.obOneLine({ condition_type: e.target.value });
    this.obUseRate({ condition_type: e.target.value });
  };

  // 获取工位总数、昨日使用数、未使用数、服务时长统计
  obOneLine(condition_type) {
    const { dispatch } = this.props;
    dispatch({ type: 'office/getDeskCount', payload: { ...condition_type } });
    dispatch({ type: 'office/getYuseCount', payload: { ...condition_type } });
    dispatch({ type: 'office/getServiceDuration', payload: { ...condition_type } });
  }

  // 获取工位使用趋势的数据
  obUseRate(condition_type) {
    const { dispatch, office } = this.props;
    const { use_rate } = office.global;
    dispatch({
      type: 'office/getUseRate',
      payload: {
        ...use_rate,
        ...condition_type,
        callback: () => { }
      }
    });
  }


  render() {
    const topColResponsiveProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8, style: { marginBottom: 24 } };
    const deskrankprops = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, style: { marginBottom: 24 } };
    const { office, dispatch } = this.props;
    // 获取参数
    const { condition_type, use_rate } = office.global;
    // 获取数据
    const { daskTotalCount, yesterdayUseCount, useRate, serviceDuration } = office;
    const content = (<div><p><FormattedMessage id="spaceUsage.nine.hour.note" /></p><p className={styles.time_solt}>（9:00~18:00）</p><p><FormattedMessage id="spaceUsage.twenty.four.hour.note" /></p><p className={styles.time_solt}>（0:00~24:00）</p></div>);
    return (
      <Fragment>
        <Row gutter={24} className={styles.top}>
          <Col span={12}>
            <h3 className={styles.title}>空间使用情况</h3>
          </Col>
          <Col span={12} className={styles.topRight}>
            {/* 选项 */}
            <Radio.Group buttonStyle="solid" onChange={this.onChange.bind(this)} value={condition_type}>
              <Radio.Button value={9}><FormattedMessage id="spaceUsage.nine.hour" /></Radio.Button>
              <Radio.Button value={24}><FormattedMessage id="spaceUsage.twenty.four.hour" /></Radio.Button>
            </Radio.Group>
            {/* 标签注释 */}
            <Popover
              placement="bottomRight"
              title={formatMessage({ id: "spaceUsage.note" })}
              content={content}
              trigger="hover"
            >
              <Icon
                type="info-circle"
                theme="outlined"
                style={{
                  float: 'right',
                  fontSize: '18px',
                  margin: '7px 15px',
                  color: 'RGBA(53, 83, 108, 0.2)',
                  cursor: 'pointer',
                }}
              />
            </Popover>
          </Col>
        </Row>
        {/* one */}
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Deskcount daskTotalCount={daskTotalCount} />
          </Col>
          <Col {...topColResponsiveProps}>
            <Yusecount yesterdayUseCount={yesterdayUseCount} />
          </Col>
          <Col {...topColResponsiveProps}>
            <Yunusecount yesterdayUseCount={yesterdayUseCount} />
          </Col>
        </Row>
        {/* two */}
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <StationRate useRate={useRate} use_rate={use_rate} condition_type={condition_type} dispatch={dispatch} />
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ServiceDuration serviceDuration={serviceDuration} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
