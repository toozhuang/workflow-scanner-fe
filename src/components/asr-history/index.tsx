import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Row } from 'antd';
import suspender from '../../common/suspender';
import DB from '../../common/indexed-db';
import UniqueString from 'unique-string';
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

        console.log('menuStore: ', menuStore);
        const newString = UniqueString();
        // const result = await DB.addObjectData(menuStore, {
        //   // set an unique ID
        //   // object 的key 就是我们创建数据库的时候 config 的key
        //   asrKeyList: newString,
        //
        //   // set name to be value of mealName state
        //   name: '大帅比',
        // });

        const result = await DB.getAllObjectData(menuStore);
        //   效果见： https://imgur.com/a/vXweuVW
        console.log(result);
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
