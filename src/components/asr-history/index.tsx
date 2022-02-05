import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Row, Tooltip } from 'antd';
import suspender from '../../common/suspender';
import DB from '../../common/indexed-db';
import UniqueString from 'unique-string';
import { Navigate, useNavigate } from 'react-router-dom';

import './asrHistory.scss';
import { getFilesize } from '../../common/util';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// const db = suspender(
//   DB.createDB('howare', 12, [{ name: '12', config: { keyPath: '' } }]),
// ).data.read;
const asrHistory = () => {
  // const [ss, setSS] = useState(db());
  // console.log('ss: ', ss);

  const [asrHistoryList, setList] = useState([]);

  const [store, setStore] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    //  查看是否存在 db
    const checkDB = async () => {
      const hasDB = await DB.existDB('asrIDB');
      if (hasDB === 0) {
        // 没有的话 就创建一个
        await DB.createDB('asrIDB', 1, [
          { name: 'asrList', config: { keyPath: 'asrListKey' } },
        ]);
      } else {
        // 已经存在该数据库
        const db = await DB.openDB('asrIDB', 1);
        // 判断是否存在 对应的 list ， 如果不存在就创建一个 TODO:
        // asrListKey
        const menuStore = await DB.transaction(
          db, // transaction on our DB
          ['asrList'], // object stores we want to transact on
          'readwrite', // transaction mode
        ).getStore('asrList'); // retrieve the store we want
        // console.log('menuStore: ', menuStore);
        const newString = UniqueString();
        // const result = await DB.addObjectData(menuStore, {
        //   // set an unique ID
        //   // object 的key 就是我们创建数据库的时候 config 的key
        //   asrKeyList: newString,
        //
        //   // set name to be value of mealName state
        //   name: '大帅比',
        // });

        const result: any = await DB.getAllObjectData(menuStore);
        //   效果见： https://imgur.com/a/vXweuVW
        console.log('result: ', result);

        setList(result);
      }
    };

    checkDB().then();
    // 如果存在就进行获取数据
    // 如果不存在就在这里创建 db
  }, []);

  const deleteHistoryItem = async (key: any) => {
    const db = await DB.openDB('asrIDB', 1);
    // 判断是否存在 对应的 list ， 如果不存在就创建一个 TODO:
    // asrListKey
    const menuStore = await DB.transaction(
      db, // transaction on our DB
      ['asrList'], // object stores we want to transact on
      'readwrite', // transaction mode
    ).getStore('asrList');
    const result = await DB.deleteObjectData(menuStore, key);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setList(result[1]);
  };

  const checkHistoryItem = (key: any) => {
    console.log('来了吗：： ');
    const locationPart = `/asr/${key}`;

    navigate(locationPart, { replace: false });
  };
  return (
    <>
      {asrHistoryList.length > 0 && (
        <>
          <Divider />
          <h1>最近转字幕记录</h1>
          <div className="site-card-wrapper">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {asrHistoryList.length > 0 &&
                asrHistoryList.map((item: any) => {
                  console.log(item);
                  return (
                    <Col
                      xs={20}
                      sm={16}
                      md={16}
                      lg={6}
                      xl={6}
                      className="gutter-row"
                      key={item.asrListKey}
                    >
                      <Card
                        title={item.fileName}
                        bordered={true}
                        hoverable
                        actions={[
                          <Tooltip title="详情" key="tooltips-info">
                            <ExclamationCircleOutlined
                              key="info"
                              onClick={() => checkHistoryItem(item.asrListKey)}
                            />
                          </Tooltip>,
                          <Tooltip title="删除" key="tooltips-delete">
                            <DeleteOutlined
                              key="delete"
                              onClick={() => deleteHistoryItem(item.asrListKey)}
                            />
                          </Tooltip>,
                        ]}
                      >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={6}>文件名</Col>
                          <Col span={18} style={{ wordBreak: 'break-all' }}>
                            {item.fileName}
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={6}>大小</Col>
                          <Col span={18} style={{ wordBreak: 'break-all' }}>
                            {getFilesize(item.fileSize)}
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={6}>云端位置</Col>
                          <Col span={18} style={{ wordBreak: 'break-all' }}>
                            {item.fileLocation}
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={6}>创建时间</Col>
                          <Col
                            span={18}
                            style={{
                              wordBreak: 'break-all',
                              fontStyle: 'italic',
                            }}
                          >
                            {dayjs(item.createdTime).format(
                              'YY/MM/DD HH:mm:ss',
                            )}
                          </Col>
                        </Row>
                        <p />
                        {/*<Button*/}
                        {/*  onClick={() => checkHistoryItem(item.asrListKey)}*/}
                        {/*>*/}
                        {/*  查看*/}
                        {/*</Button>*/}
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default asrHistory;
