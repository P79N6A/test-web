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
    this.props.dispatch(routerRedux.push('/management/notice'))
  }

  render() {
    const { dispatch, ManagementNotice } = this.props;
    const { copyValue } = ManagementNotice;
    return (
      <div style={{ width: '100%', height: '100%', padding: '2%', borderRadius: '4px', backgroundColor: '#fff' }}>
        <p><FormattedMessage id='menu.management.detailNotice' /></p>
        <div style={{ padding: '2% 5%' }}>
          <h3 style={{ fontSize: '28px' }}>{copyValue.title}</h3>
          <p>
            <Icon type="eye-o" style={{ marginRight: '6px' }} />
            {copyValue.viewCount || 0}
            <Icon type="clock-circle-o" style={{ marginLeft: '18px', marginRight: '6px' }} />
            {G.moment(copyValue.lastTime).format('YYYY-MM-DD hh:mm:s')}
          </p>
          <br />
          <br />
          <div className={styles.box} dangerouslySetInnerHTML={{ __html: copyValue.content }} />
        </div>
        {/* 推送效果 */}
        <p style={{ marginTop: '30px' }}>推送效果</p>
        <div style={{ padding: '5% 5% 3%' }}>
          <div className={styles.mobile}>
            {/* 内容展示区 */}
            <div className={styles.mobileText}>
              {copyValue.type === 0 ? <p>{copyValue.messages}</p> : <img src={copyValue.messages} />}
            </div>
            <Icon type="close-circle" theme="filled" style={{ fontSize: '24px', marginTop: '15px', color: '#F3F5F7' }} />
          </div>
        </div>

        <Row style={{ paddingTop: '20px', borderTop: '1px solid #F2F2F2', marginTop: '20px' }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" size='small' onClick={this.goList.bind(this)}>返回</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
