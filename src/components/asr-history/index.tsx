import React, { useEffect, useState } from 'react';
import AsrCard from '../../pages/layout/asrCard';
import DB from '../../common/indexed-db';
import { useNavigate } from 'react-router-dom';

import './asrHistory.scss';
import { Col, Divider, Row } from 'antd';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import {
  asrHistoryAction,
  asrHistorySelectors,
  asrHistorySlice,
  fetchRecords,
  newStateSelecter,
} from '../../redux/asrHistory-slice';

const asrHistory = (inProps: any) => {
  // const [asrHistoryList, setList] = useState([]);
  const asrHistoryStore = useSelector(
    (state: RootState) => state[asrHistorySlice.name],
  );
  const asrHistory = asrHistoryStore.asrHistories;
  // const demo = useAppSelector((state: RootState) =>
  //   asrHistorySelectors.selectById(state, '123'),
  // );

  // console.log(demo);

  console.log(asrHistorySlice.actions);

  const appDispatch = useAppDispatch();
  const add = () =>
    appDispatch(asrHistoryAction.addCounter({ initialValue: 0 }));
  const fetch = () => appDispatch(fetchRecords());

  const navigate = useNavigate();
  // const haha = useSelector((state: RootState) =>
  //   newStateSelecter.selectById(
  //     state[asrHistorySlice.name].asrHistories,
  //     '123151',
  //   ),
  // );

  useEffect(() => {
    // fetch();
    // add();
    // setTimeout(() => {
    //   console.log(haha);
    // }, 1000);
    //  查看是否存在 db

    fetch().then();

    const checkDB = async () => {
      let hasDB;
      try {
        hasDB = await DB.existDB('asrIDB');
        console.log(hasDB);
      } catch (error) {
        console.log('这就是 哈市DB, ', error);
      }
      if (hasDB === 0) {
        console.log('create db');
        // 没有的话 就创建一个
        await DB.createDB('asrIDB', 1, [
          { name: 'asrList', config: { keyPath: 'asrListKey' } },
        ]);
      } else {
        console.log('transaction here');
        // 已经存在该数据库
        let db;
        try {
          db = await DB.openDB('asrIDB', 1);
          console.log('db:', db);
        } catch (e) {
          console.log('error of open db');
          console.log(e);
        }

        // 判断是否存在 对应的 list ， 如果不存在就创建一个 TODO:
        // asrListKey
        const menuStore = await DB.transaction(
          db, // transaction on our DB
          ['asrList'], // object stores we want to transact on
          'readwrite', // transaction mode
        ).getStore('asrList'); // retrieve the store we want

        const result: any = await DB.getAllObjectData(menuStore);
        //   效果见： https://imgur.com/a/vXweuVW
        console.log('result: ', result);

        // setList(result);
      }
    };

    checkDB().then();
    // 如果存在就进行获取数据
    // 如果不存在就在这里创建 db
  }, [inProps.trigger]);

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
    const locationPart = `/asr/${key}`;

    navigate(locationPart, { replace: false });
  };
  return (
    <>
      {asrHistory.ids.length > 0 && (
        <div style={{ width: '90%', marginLeft: 'auto', marginRight: ' auto' }}>
          <Divider />
          <h1>最近转字幕记录</h1>
          {/*{count}*/}
          <div className="site-card-wrapper">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {asrHistory.ids.length > 0 &&
                asrHistory.ids.map((id: any) => {
                  const item = asrHistory.entities[id];
                  return (
                    item && (
                      <Col
                        xs={20}
                        sm={16}
                        md={16}
                        lg={6}
                        xl={6}
                        className="gutter-row"
                        key={item.asrListKey}
                      >
                        <AsrCard
                          item={item}
                          hoverAble
                          actions={{
                            checkDetail: checkHistoryItem,
                            deleteDetail: deleteHistoryItem,
                          }}
                        />
                      </Col>
                    )
                  );
                })}
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default asrHistory;
