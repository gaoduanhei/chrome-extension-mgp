/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip, Form, Modal, Select, Spin } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import './Translator.scss';
import { translate } from './query';
import { debounce } from 'lodash';

const FormItem = Form.Item;
const options = [
  { value: 'English', label: '英文' },
  { value: 'Chinese', label: '中文' },
];
const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 4,
  },
};

function Translator() {
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [selectionText, setSelectionText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('Chinese');
  const [resultData, setResultData] = useState('');
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const handleMouseUp = useCallback(
    debounce(
      (event) => {
        const _x =
          event.pageX || event.pageX + document.documentElement.scrollLeft;
        const _y =
          event.pageY || event.pageY + document.documentElement.scrollTop;
        const _text = window.getSelection().toString();
        if (_text) {
          setButtonPosition({ x: _x, y: _y });
          setModalPosition({ x: event.clientX, y: event.clientY });
          setShowButton(true);
          setSelectionText(_text);
        } else {
          setShowButton(false);
        }
      },
      [300]
    ),
    []
  );
  const handleTranslate = (value = language) => {
    setLoading(true);
    setLanguage(value);
    translate(selectionText, value, (data) => {
      setResultData(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);
  return (
    <div
      className="translator-container"
      style={{ top: buttonPosition.y, left: buttonPosition.x }}
    >
      {showButton && (
        <Tooltip title="翻译该文本">
          <TranslationOutlined
            onClick={() => {
              setShowModal(true);
              setShowButton(false);
              handleTranslate();
            }}
          />
        </Tooltip>
      )}
      <Form {...formItemLayout}>
        <Modal
          open={showModal}
          mask={false}
          className="translator-modal"
          title={
            <FormItem label="译为">
              <Select
                value={language}
                options={options}
                bordered={false}
                disabled={loading}
                onChange={(value) => {
                  handleTranslate(value);
                }}
              />
            </FormItem>
          }
          onCancel={() => {
            setShowModal(false);
            setResultData('');
            setLanguage('Chinese');
          }}
          footer={false}
          style={{
            position: 'absolute',
            zIndex: 99,
            top:
              modalPosition.y + 128 > window.innerHeight
                ? modalPosition.y - 128
                : modalPosition.y,

            left: modalPosition.x,
          }}
        >
          <Spin tip="Loading..." spinning={loading}>
            <p className="article">{resultData}</p>
          </Spin>
        </Modal>
      </Form>
    </div>
  );
}

export default Translator;
