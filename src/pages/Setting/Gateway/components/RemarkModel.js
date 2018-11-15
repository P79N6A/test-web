import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Input, Form } from 'antd';
import G from '@/global';

const FormItem = Form.Item;

class RemarkModel extends Component {
  componentWillReceiveProps(nextProps) {
    const { visible, editValue } = nextProps;
    if (this.visible !== visible && !G._.isEqual(this.editValue, editValue)) {
      this.visible = visible;
      this.editValue = editValue;
      if (visible && !G._.isEmpty(editValue)) {
        nextProps.form.setFieldsValue({
          remark: editValue.remark,
        });
      } else {
        nextProps.form.setFieldsValue({
          remark: '',
        });
      }
    }
  }

  okHandle = () => {
    const { form, handleOk, editValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOk({ ...fieldsValue, remark: fieldsValue.remark || '' }, editValue.id);
    });
  };

  render() {
    const { visible, handleCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'all.remarks' })}
        onOk={this.okHandle}
        onCancel={handleCancel}
        footer={[
          <Button key="back" size='small' onClick={handleCancel}>
            <FormattedMessage id='all.cancel' />
          </Button>,
          <Button key="submit" size='small' type="primary" onClick={this.okHandle}>
            <FormattedMessage id='all.save' />
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label={formatMessage({ id: 'all.remarks' })}>
          {getFieldDecorator('remark', {
            rules: [
              {
                max: 100,
                message: formatMessage({ id: 'test.max.long.one.hundred' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'device.remark.text' })} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(RemarkModel);
