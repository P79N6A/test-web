import React, { Component } from 'react';
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
    title: '新增用户',
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
        this.setState({ title: '编辑用户' });
      } else {
        nextProps.form.setFieldsValue({
          name: '',
          phone: '',
          position: '',
          remark: '',
        });
        this.setState({ title: '新增用户' });
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
      callback('手机号格式有误');
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
            message.error('请刷新页面');
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
            关闭
          </Button>,
          <Button key="submit" size='small' type="primary" loading={loading} onClick={this.okHandle}>
            提交
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label="头像">
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
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '姓名不能为空',
              },
              {
                max: 20,
                message: '最大长度20',
              },
            ],
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="手机">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: '手机号不能为空',
              },
              {
                validator: this.checkPhone.bind(this),
              },
            ],
          })(<Input placeholder="请输入手机号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="职务">
          {getFieldDecorator('position', {
            rules: [
              {
                max: 10,
                message: '最大长度10',
              },
            ],
          })(<Input placeholder="请输入职务" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [
              {
                max: 100,
                message: '最大长度100',
              },
            ],
          })(<Input placeholder="请输入备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(PersonModal);
