import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Upload, message, Table, Tooltip, Progress } from 'antd';
import G from '@/global';
import styles from './PersonTemplate.less';


class PersonTemplate extends Component {
  state = {
    title: '批量导入用户',
    modelBtn: '取消',
    type: 0,
    file: '',
    number: 0,
    progress: 'none'
  }

  okHandle = (type) => {
    const { file } = this.state;
    if (type === 1) {
      this.uploadFile(file, true);
    }
  };

  onCancel = (type) => {
    const { closeTemplate } = this.props;
    if (type === 0) {
      closeTemplate();
    } else {
      this.setState({
        type: 0
      });
      this.changeTitle('批量导入用户', '取消')
    }
  };

  // 修改 title 以及 btn
  changeTitle(title, btn) {
    this.setState({
      title: title,
      modelBtn: btn
    })
  }

  // 上传解析中
  uploadNumberAdd(type, show) {
    if (this.timeAction) {
      clearInterval(this.timeAction);
    }
    const { number } = this.state;
    let total = number;
    if (show === 1) {
      this.timeAction = setInterval(() => {
        if (total === 99) {
          clearInterval(this.timeAction);
        }
        total++;
        this.setState({
          number: total
        })
      }, 50)
    } else if (show === 100) {
      this.setState({
        number: 100
      })
    } else {
      this.setState({
        number: 0
      })
    }
    setTimeout(() => {
      this.setState({
        progress: type,
      });
    }, 100)
  }

  // 上传文件
  uploadFile(file, force) {
    const { closeTemplate } = this.props;
    this.setState({
      file
    })
    const { dispatch } = this.props;

    setTimeout(() => {
      dispatch({
        type: 'ManagementPerson/usersBatchImport',
        payload: {
          file,
          force,
          callback: (res) => {
            this.uploadNumberAdd('none', 100);
            if (res.status === 'success') {
              closeTemplate();
              this.changeTitle('批量导入用户', '取消');
            } else {
              if (res.data && res.data.dataList && res.data.dataList.length > 0) {
                this.changeTitle('导入确认', '重新上传');
                this.setState({
                  type: 1
                })
              } else {
                message.error('上传失败');
                this.changeTitle('批量导入用户', '取消');
                closeTemplate();
              }
            };
            setTimeout(() => {
              this.uploadNumberAdd('none', 0)
            }, 1000)
          }
        },
      });
    }, 5000)
  }

  // 定义表格
  getColumns() {
    const columns = [
      {
        title: '行号',
        key: 'row',
        width: 80,
        render: (text) => (
          <Fragment>
            <font>{text.row}</font>
          </Fragment>
        ),
      },
      {
        title: '列标题',
        key: 'title',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.title}>
                <span>{text.title}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: '单元格内容',
        key: 'content',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.content}>
                <span>{text.content}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: '错误原因',
        key: 'message',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.message}>
                <span>{text.message}</span>
              </Tooltip>
            </Fragment>
          )
        }
      }
    ];
    return columns;
  }

  render() {
    const { title, modelBtn, type, number, progress } = this.state;
    const { visible, errorList } = this.props;
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange: (info) => {
        const fileType = info.file.name.split('.')[info.file.name.split('.').length - 1];
        if (info.file.status !== 'uploading') {
          if ('xls,xlsx'.indexOf(fileType) < 0) {
            message.error('支持文件类型：xls，xlsx');
            return;
          };
          this.uploadNumberAdd('block', 1)
          this.uploadFile(info, false);
        }
      },
    };
    const columns = this.getColumns();
    return (
      <div className={styles.modelBox}>
        <Modal
          width={780}
          visible={visible}
          title={title}
          onOk={this.okHandle.bind(this, type)}
          onCancel={this.onCancel.bind(this, type)}
          footer={[
            <Button key="back" size='small' onClick={this.onCancel.bind(this, type)}>{modelBtn}</Button>,
            <Button key="submit" size='small' type="primary" onClick={this.okHandle.bind(this, type)}>确定导入</Button>
          ]}
        >
          {
            type === 0 ?
              <div className={styles.download}>
                <p className={styles.staps}>请按步骤操作</p>
                <div className={styles.stapOne}>
                  <p className={styles.stapTitle}><font>1</font>下载模板</p>
                  <p className={styles.stapText}>请先下载导入用户的表格模板，并根据模板填写用户参数内容</p>
                  <a className={styles.stapBtn} href={`${G.picUrl}download/9am_user_importTemplate%20.zip`}>下载模板</a>
                </div>
                <div className={styles.stapOne}>
                  <p className={styles.stapTitle}><font>2</font>导入用户</p>
                  <p className={styles.stapText}>· 支持文件类型：xls，xlsx</p>
                  <p className={styles.stapText}>· 一次最多导入500条</p>
                  <p className={styles.stapText}>· 每个点位任一参数不符合规则时，对应的用户将不会被导入</p>
                  <Upload {...props}>
                    <Button className={styles.stapBtn} size="small" type="primary">上传文件</Button>
                  </Upload>
                </div>
              </div>
              :
              <div>
                <p>{`文件上传成功。共${errorList.totalLine}个点位，其中${errorList.successLine}条可成功导入`}</p>
                <p className={styles.errorList}>{`以下${errorList.totalLine - errorList.successLine}条不符合要求的数据，将不会被导入`}</p>
                <Table
                  rowKey="errorId"
                  dataSource={errorList.dataList}
                  columns={columns}
                  pagination={
                    { defaultPageSize: 5 }
                  }
                />
              </div>
          }
        </Modal>
        {/* 上传进度条 */}
        <div className={styles.modelProgessBox} style={{ display: `${progress}` }}>
          <div className={styles.modelProgess}>
            <p>上传解析中</p>
            <Progress percent={number} status="active" strokeColor="#A6D6D0" />
          </div>
        </div>
      </div>
    );
  }
}

export default PersonTemplate;
