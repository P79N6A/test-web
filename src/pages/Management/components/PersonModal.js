import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import * as qiniu from 'qiniu-js';
import { Modal, Button, Input, Form, Icon, Upload } from 'antd';
import G from '@/global';
import styles from './PersonModal.less';

const FormItem = Form.Item;

const ACCESSKEY = 'h07mPP3LHfjO8BHJfCyIRsiichflVYIHtyNkXNoM';
const SECRETKEY = '6keig4uqFJFLjs80aLAPfjb3rnaMaiPOgRNJ9uik';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class PersonModal extends Component {
  state = {
    imageUrl: '',
    avatarLoading: false,
    title: formatMessage({ id: 'person.new.users' }),
  };

  componentWillReceiveProps(nextProps) {
    const { visible, editValue } = nextProps;
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
          position: editValue.position,
          remark: editValue.remark
        });
        this.setState({ title: formatMessage({ id: 'person.edit.users' }) });
      } else {
        nextProps.form.setFieldsValue({
          name: '',
          phone: '',
          position: '',
          remark: '',
        });
        this.setState({ title: formatMessage({ id: 'person.new.users' }) });
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
        editValue.uid
      );
    });
  };

  checkPhone = (rule, value, callback) => {
    if (!value) {
      callback(' ');
      return;
    }
    const re = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if (value.length === 11 && re.test(value)) {
      callback();
    } else {
      callback(formatMessage({ id: 'person.phone.format.message' }));
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
      imageUrl: G.uploadPicUrl + response.key,
    });
  }

  beforeUpload(file) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaPerson/getQiniuToken',
      payload: {
        callback: (res) => {
          if (res.status === 'success') {
            const { editValue } = this.props;
            const config = { useCdnDomain: true };
            const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
            const avatarUrl = `${editValue.uid}-${G.moment().unix()}.png`;
            this.setState({ avatarLoading: true });
            const observable = qiniu.upload(file, avatarUrl, res.data, putExtra, config);
            observable.subscribe(this.next.bind(this), this.error.bind(this), this.complete.bind(this));
            return false;
          } else {
            message.error(formatMessage({ id: 'person.refresh.page' }));
          }
        }
      },

    });

  }

  render() {
    const { visible, loading, handleCancel, form } = this.props;
    const { imageUrl, avatarLoading, title } = this.state;
    const { getFieldDecorator } = form;
    const uploadButton = (
      <div className="avatar-uploader2">
        <Icon type={avatarLoading ? 'loading' : 'plus'} />
      </div>
    );
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.okHandle}
        onCancel={this.onCancel.bind(this, handleCancel)}
        footer={[
          <Button key="back" size='small' onClick={this.onCancel.bind(this, handleCancel)}>
            <FormattedMessage id="all.close" />
          </Button>,
          <Button key="submit" size='small' type="primary" loading={loading} onClick={this.okHandle}>
            <FormattedMessage id="all.submit" />
          </Button>
        ]}
      >
        <FormItem {...formItemLayout} label={formatMessage({ id: 'person.avatar' })}>
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
        <br />
        <FormItem {...formItemLayout} label={formatMessage({ id: 'person.name' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'person.name.test.message' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'test.max.long.twenty' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'person.name.input' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'person.phone' })}>
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'person.phone.test.message' }),
              },
              {
                validator: this.checkPhone.bind(this),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'person.phone.input' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'person.position' })}>
          {getFieldDecorator('position', {
            rules: [
              {
                max: 10,
                message: formatMessage({ id: 'test.max.long.ten' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'person.position.input' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'all.remarks' })}>
          {getFieldDecorator('remark', {
            rules: [
              {
                max: 100,
                message: formatMessage({ id: 'text.max.long.one.hundred' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'person.remarks.input' })} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(PersonModal);
