import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import * as qiniu from 'qiniu-js';
import { Modal, Button, Input, Form, Icon, Upload, Row, Col, Select } from 'antd';
import G from '@/global';
import styles from './PersonModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

const ACCESSKEY = 'h07mPP3LHfjO8BHJfCyIRsiichflVYIHtyNkXNoM';
const SECRETKEY = '6keig4uqFJFLjs80aLAPfjb3rnaMaiPOgRNJ9uik';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class PersonModal extends Component {
  state = {
    groupId: '',
    imageUrl: '',
    avatarLoading: false,
    title: formatMessage({ id: 'person.operate.new-users' }),
    subTitle: formatMessage({ id: 'person.operate.new-user-message' }),
  };

  componentWillReceiveProps(nextProps) {
    const { visible, editValue, groupList } = nextProps;
    if (this.visible !== visible && !G._.isEqual(this.editValue, editValue)) {
      this.visible = visible;
      this.editValue = editValue;
      if (visible && !G._.isEmpty(editValue)) {
        this.setState({
          imageUrl: editValue.avatar,
        });
        nextProps.form.setFieldsValue({
          name: editValue.name,
          phone: editValue.phone,
          email: editValue.email,
          position: editValue.position,
          remark: editValue.remark,
          groupId: editValue.groupId,
        });
        this.setState({ title: formatMessage({ id: 'person.operate.edit-users' }) });
        this.setState({ subTitle: formatMessage({ id: 'person.operate.edit-user-message' }) });
      } else {
        nextProps.form.setFieldsValue({
          name: '',
          phone: '',
          email: '',
          position: '',
          remark: '',
          groupId: groupList && groupList.length > 0 ? groupList[0].id : '',
        });
        this.setState({ title: formatMessage({ id: 'person.operate.new-users' }) });
        this.setState({ subTitle: formatMessage({ id: 'person.operate.new-user-message' }) });
      }
    }
  }

  onCancel(handleCancel) {
    this.setState({ imageUrl: '' });
    handleCancel();
  }

  okHandle = () => {
    const { form, handleOk, editValue } = this.props;
    const { imageUrl } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleOk(
        { ...fieldsValue, position: fieldsValue.position || '', remark: fieldsValue.remark || '' },
        imageUrl,
        editValue.uid,
      );
    });
  };

  checkPhone = (rule, value, callback) => {
    if (!value) {
      callback(' ');
      return;
    }
    const re = G.phoneCheck;
    if (value.length === 11 && re.test(value)) {
      callback();
    } else {
      callback(formatMessage({ id: 'person.operate.phone-format-alert' }));
    }
  };

  normFile = e => {
    if (!e || !e.fileList) {
      return e;
    }
    const { fileList } = e;
    return fileList;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ avatarLoading: true });
      return;
    }
    if (info.file.status === 'error') {
      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          avatarLoading: false,
        });
      });
    }
  };

  next() { }

  error() {
    this.setState({ avatarLoading: false });
  }

  complete(response) {
    this.setState({
      avatarLoading: false,
      imageUrl: G.picUrl + response.key,
    });
  }

  beforeUpload(file) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/getQiniuToken',
      payload: {
        callback: (res) => {
          if (res.status === 'success') {
            const { editValue } = this.props;
            const config = { useCdnDomain: true };
            const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
            const avatarUrl = `${editValue.uid}_header_${G.moment().unix()}.png`;
            this.setState({ avatarLoading: true });
            const observable = qiniu.upload(file, avatarUrl, res.data, putExtra, config);
            observable.subscribe(this.next.bind(this), this.error.bind(this), this.complete.bind(this));
            return false;
          } else {
            message.error(formatMessage({ id: 'person.operate.reload-page' }));
          }
        }
      },
    });
  }

  // 选择角色
  changeSelect(value) {
    this.setState({
      groupId: value,
    })
  }

  render() {
    const { visible, loading, handleCancel, form, groupList } = this.props;
    const { imageUrl, avatarLoading, title, subTitle } = this.state;
    const { getFieldDecorator } = form;
    const uploadButton = (<Icon type={avatarLoading ? "loading" : "user"} style={{ fontSize: '30px', lineHeight: '60px', paddingTop: '4px', color: '#DFE4E8' }} />);
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.okHandle.bind(this)}
        onCancel={this.onCancel.bind(this, handleCancel)}
        footer={[
          <Button key="back" size="small" onClick={this.onCancel.bind(this, handleCancel)}>
            <FormattedMessage id="all.cancel" />
          </Button>,
          <Button key="submit" size="small" type="primary" loading={loading} onClick={this.okHandle.bind(this)}>
            <FormattedMessage id="all.save" />
          </Button>
        ]}
      >
        <p className={styles.subTitle}>{subTitle}</p>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'person.operate.avatar' })}>
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload
                  className={styles.avatarUploader}
                  name="avatar"
                  listType="picture-card"
                  accept="image/*"
                  showUploadList={false}
                  onChange={this.handleChange.bind(this)}
                  beforeUpload={this.beforeUpload.bind(this)}
                >
                  {imageUrl ? (
                    <img className={styles.avatar} src={imageUrl} alt="avatar" />
                  ) : (
                      uploadButton
                    )}
                </Upload>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem label={formatMessage({ id: 'person.list.name' })} {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'person.operate.name-empty-alert' }),
                  },
                  {
                    max: 20,
                    message: formatMessage({ id: 'test.max.long.twenty' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'person.operate.name-empty-alert' })} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'person.list.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'person.operate.phone-empty-alert' }),
                  },
                  {
                    validator: this.checkPhone.bind(this),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'person.operate.phone-empty-alert' })} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 邮箱 */}
        <Row gutter={24}>
          <Col span={24}>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    max: 50,
                    message: formatMessage({ id: 'test.max.long.fifty' }),
                  },
                  {
                    pattern: G.emailCheck,
                    message: formatMessage({ id: 'customer.operate.email-message' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.settings.basic.email-message' })} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'person.list.position' })}>
              {getFieldDecorator('position', {
                rules: [
                  {
                    max: 10,
                    message: formatMessage({ id: 'test.max.long.ten' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'person.operate.position-input' })} />)}
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <Col>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'all.remarks' })}>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    max: 100,
                    message: formatMessage({ id: 'test.max.long.one.hundred' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'person.operate.remarks-input' })} />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.line} />
        <Row span={24}>
          <Col>
            <FormItem {...formItemLayout} label="用户组">
              {getFieldDecorator('groupId', {
                rules: [],
              })(
                <Select style={{ width: 354 }} onChange={this.changeSelect.bind(this)}>
                  {
                    groupList && groupList.length > 0
                      ?
                      groupList.map((item, index) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                      })
                      :
                      ''
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(PersonModal);
