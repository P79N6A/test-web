import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Modal, Button, Upload, message, Table, Tooltip, Progress } from 'antd';
import G from '@/global';
import styles from './PersonTemplate.less';


class PersonTemplate extends Component {
  state = {
    title: formatMessage({ id: "person.import.batch-user" }),
    modelBtn: formatMessage({ id: "all.cancel" }),
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
      this.changeTitle(formatMessage({ id: "person.import.batch-user" }), formatMessage({ id: "all.cancel" }))
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
    const { dispatch, groupActive } = this.props;
    dispatch({
      type: 'ManagementPerson/usersBatchImport',
      payload: {
        file,
        force,
        gruopId: groupActive,
        callback: (res) => {
          this.uploadNumberAdd('none', 100);
          if (res.status === 'success') {
            message.success(`${formatMessage({ id: "person.import.success" })}${res.data.successCount}${formatMessage({ id: "person.import.success.data" })}`);
            closeTemplate();
            this.changeTitle(formatMessage({ id: "person.import" }), formatMessage({ id: "all.cancel" }));
          } else {
            if (res.data && res.data.dataList && res.data.dataList.length > 0) {
              this.changeTitle(formatMessage({ id: "person.import.certain" }), formatMessage({ id: "person.import.again" }));
              this.setState({
                type: 1
              })
            } else {
              message.error(G.errorLists[res.code][`message_${getLocale()}`] || 'error');
              this.changeTitle(formatMessage({ id: "person.import" }), formatMessage({ id: "all.cancel" }));
              closeTemplate();
            }
          };
          setTimeout(() => {
            this.uploadNumberAdd('none', 0)
          }, 1000)
        }
      },
    });
  }

  // 定义表格
  getColumns() {
    const columns = [
      {
        title: formatMessage({ id: "person.import.row" }),
        key: 'row',
        width: 80,
        render: (text) => (
          <Fragment>
            <font>{text.row}</font>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: "person.import.col-title" }),
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
        title: formatMessage({ id: "person.import.cell-content" }),
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
        title: formatMessage({ id: "person.import.error-reson" }),
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
      beforeUpload: (info) => {
        const fileType = info.name.split('.')[info.name.split('.').length - 1];
        if ('xls,xlsx'.indexOf(fileType) < 0) {
          message.error(`${formatMessage({ id: "person.support.file.type" })}：xls，xlsx`);
          return;
        };
        this.uploadNumberAdd('block', 1)
        this.uploadFile(info, false);
      }
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
            <Button key="submit" size='small' type="primary" onClick={this.okHandle.bind(this, type)}>
              <FormattedMessage id="person.import.confirm-import" />
            </Button>
          ]}
        >
          {
            type === 0 ?
              <div className={styles.download}>
                <p className={styles.staps}><FormattedMessage id="person.import.step-by-step" /></p>
                <div className={styles.stapOne}>
                  <p className={styles.stapTitle}><font>1</font><FormattedMessage id="person.import.download-template" /></p>
                  <p className={styles.stapText}><FormattedMessage id="person.import.download-model-first" /></p>
                  <a className={styles.stapBtn} href={`${G.picUrl}download/9am_user_importTemplate%20.zip`}>
                    <FormattedMessage id="person.import.download-template" />
                  </a>
                </div>
                <div className={styles.stapOne}>
                  <p className={styles.stapTitle}><font>2</font><FormattedMessage id="person.import.person" /></p>
                  <p className={styles.stapText}>· <FormattedMessage id="person.import.supported-file-type" />：xls，xlsx</p>
                  <p className={styles.stapText}>· <FormattedMessage id="person.import.max-amount" /></p>
                  <p className={styles.stapText}>· <FormattedMessage id="person.import.error" /></p>
                  <Upload {...props}>
                    <Button className={styles.stapBtn} size="small" type="primary">
                      <FormattedMessage id="person.import.file" />
                    </Button>
                  </Upload>
                </div>
              </div>
              :
              <div>
                <p>{`${formatMessage({ id: "person.import.file-success-one" })}${errorList.totalLine}${formatMessage({ id: "person.import.file-success-two" })}${errorList.successLine}${formatMessage({ id: "person.import.file-success-three" })}`}</p>
                <p className={styles.errorList}>{`${formatMessage({ id: "person.import.file-error-one" })}${errorList.totalLine - errorList.successLine}${formatMessage({ id: "person.import.file.error.two" })}`}</p>
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
            <p><FormattedMessage id="person.import.loading" /></p>
            <Progress percent={number} status="active" strokeColor="#A6D6D0" />
          </div>
        </div>
      </div>
    );
  }
}

export default PersonTemplate;
