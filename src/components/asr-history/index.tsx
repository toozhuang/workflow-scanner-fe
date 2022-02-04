import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Row } from 'antd';
import suspender from '../../common/suspender';
import DB from '../../common/indexed-db';
// const db = suspender(
//   DB.createDB('howare', 12, [{ name: '12', config: { keyPath: '' } }]),
// ).data.read;
const asrHistory = () => {
  // const [ss, setSS] = useState(db());
  // console.log('ss: ', ss);

  useEffect(() => {
    //  查看是否存在 db
    const checkDB = async () => {
      const hasDB = await DB.existDB('asrIDB');
      if (hasDB === 0) {
        // 没有的话 就创建一个
        await DB.createDB('asrIDB', 1, [
          { name: 'asrList', config: { keyPath: 'asrKeyList' } },
        ]);
      } else {
        console.log('已经存在该数据库, 下面demo 插入一个值试试看');
        const db = await DB.openDB('asrIDB', 1);

        const menuStore = await DB.transaction(
          db, // transaction on our DB
          ['asrList'], // object stores we want to transact on
          'readwrite', // transaction mode
        ).getStore('asrList'); // retrieve the store we want

        console.log('menuStore: ', menuStore);
        await DB.addObjectData(menuStore, {
          // set an unique ID
          // object 的key 就是我们创建数据库的时候 config 的key
          asrKeyList: '嗷嗷阿胶',

          // set name to be value of mealName state
          name: '大帅比',
        });
        //   效果见： https://imgur.com/a/vXweuVW
      }
    };

    checkDB().then();
    // 如果存在就进行获取数据
    // 如果不存在就在这里创建 db
  }, []);

  return (
    <>
      <Divider />
      <h1>最近转字幕记录</h1>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default asrHistory;
