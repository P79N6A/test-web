import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Input, Form, message } from 'antd';
import G from '@/global';
import styles from './../index.less';
const { TextArea } = Input;

class ConfigureModel extends Component {
  state = {
    command: '',
    result: []
  }

  // 获取文本内容
  onChangeTextArea = (e) => {
    this.setState({
      command: e.target.value
    });
  }

  // 执行命令
  implement() {
    const { command } = this.state;
    const { dispatch, configureList } = this.props;
    if (!G._.isEmpty(configureList) && !G._.isEmpty(command)) {
      configureList.map((item, i) => {
        dispatch({
          type: 'Gateway/gatewayCommand',
          payload: { id: item, command, callback: this.showResult.bind(this) }
        });
      })
    } else {
      message.error('请填写所要执行的命令');
    }

  }

  // 展示结果
  showResult(res) {
    let newResult = this.state.result;
    newResult.push(res.data)
    this.setState({
      result: newResult,
    })
  }

  // 清空结果
  clear() {
    this.setState({
      result: []
    })
  }

  render() {
    const { handClose, configureList, configureVisible } = this.props;
    const { command, result } = this.state;
    return (
      <Modal
        width={780}
        visible={configureVisible}
        title={'网关'}
        onOk={handClose}
        onCancel={handClose}
        footer={[
          <Button key="back" size='small' onClick={handClose}>
            <FormattedMessage id='all.cancel' />
          </Button>,
          <Button key="submit" size='small' type="primary" onClick={handClose}>
            <FormattedMessage id='all.save' />
          </Button>,
        ]}
      >
        <p className={styles.gatewayNumber}>网关编号：{configureList.toString()}</p>
        <h3 className={styles.command}>命令行</h3>
        <TextArea
          rows={8}
          value={command}
          placeholder={'网关配置指令'}
          style={{ resize: 'none' }}
          onChange={this.onChangeTextArea.bind(this)} />
        <Button key="implement" type="primary" size="small" onClick={this.implement.bind(this)} style={{ marginTop: '16px' }}>执行</Button>
        <h3 className={styles.command}>返回结果 <span className={styles.clear} onClick={this.clear.bind(this)}>清空</span></h3>
        <div className={styles.resultBox}>
          {
            result && result.length > 0 ? result.map((item, i) => {
              return <div key={i} className={styles.resultTextModel}>
                <p className={styles.resultText}>
                  <span className={styles.leftName}>ID</span>
                  <span>{item.id}</span>
                  <span className={styles.rightName}>Status</span>
                  <span>{item.result.status}</span>
                </p>
                <p className={styles.resultText}>
                  <span className={styles.leftName}>StdoutResult</span>
                  <span>{JSON.parse(item.result.payload).stdoutResult}</span>
                </p>
                {
                  G._.isEmpty(JSON.parse(item.result.payload).stderrResult) ? '' :
                    <p className={styles.resultText}>
                      <span className={styles.leftName}>StderrResult</span>
                      <span>{JSON.parse(item.result.payload).stderrResult}</span>
                    </p>
                }

              </div>
            }) : '空'
          }
        </div>
      </Modal >
    );
  }
}

export default Form.create()(ConfigureModel);
