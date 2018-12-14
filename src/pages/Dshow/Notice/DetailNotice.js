import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Icon, Row, Col, Button } from 'antd';
import G from '@/global';
import { connect } from 'dva';
import styles from './components/NewNoticeForm.less';
import { routerRedux } from 'dva/router';

@connect(({ ManagementNotice }) => ({
  ManagementNotice,
}))
export default class DetailNotice extends Component {
  goList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementNotice/setCopyValue',
      payload: '',
    });
    this.props.dispatch(routerRedux.push('/management/notice'));
  }

  componentWillMount() {
    const { ManagementNotice } = this.props;
    if (!ManagementNotice.copyValue) {
      this.props.dispatch(routerRedux.push('/management/notice'));
    }
  }

  render() {
    const { ManagementNotice } = this.props;
    const { copyValue } = ManagementNotice;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '2%',
          borderRadius: '4px',
          backgroundColor: '#fff',
        }}
      >
        <p>
          <FormattedMessage id="menu.management.detailNotice" />
        </p>
        <div style={{ padding: '2% 5%' }}>
          <h3 style={{ fontSize: '28px' }}>{copyValue.title}</h3>
          <p>
            <Icon type="eye-o" style={{ marginRight: '6px' }} />
            {copyValue.viewCount || 0}
            <Icon type="clock-circle-o" style={{ marginLeft: '18px', marginRight: '6px' }} />
            {G.moment(copyValue.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </p>
          <br />
          <br />
          <div
            className={styles.box}
            dangerouslySetInnerHTML={{
              __html: `<style>.box {font-size: 24px;color: #35536C}.box img {max-width: 100%;}</style><div class="box">${
                copyValue.content
                }</div>`,
            }}
          />
        </div>
        {/* 推送效果 */}
        <p style={{ marginTop: '30px' }}><FormattedMessage id="notice.operate.push-preview" /></p>
        <div style={{ padding: '5% 5% 3%' }}>
          <div className={styles.mobile}>
            {/* 内容展示区 */}
            <div className={styles.mobileText}>
              {copyValue.type === 0 ? <p>{copyValue.message}</p> : <img src={copyValue.message} />}
            </div>
            <Icon
              type="close-circle"
              theme="filled"
              style={{ fontSize: '24px', marginTop: '15px', color: '#F3F5F7' }}
            />
          </div>
        </div>
        <Row style={{ paddingTop: '20px', borderTop: '1px solid #F2F2F2', marginTop: '20px' }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" size="small" onClick={this.goList.bind(this)}>
              <FormattedMessage id="all.back" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
