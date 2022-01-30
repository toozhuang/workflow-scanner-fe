import React, { MouseEventHandler, useEffect, useState } from 'react';
import {
  Table,
  Tooltip,
  Space,
  Menu,
  Dropdown,
  message,
} from 'antd';
import { getTransferList, updateTransfer } from '../api/transfer.api';
import { TransferType } from './dto/transfer.type';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import * as _ from 'lodash';
import { ColumnsType } from 'antd/es/table';
import { AuthContext } from '../App';
import { MenuInfo } from 'rc-menu/lib/interface';

import { useNavigate } from 'react-router-dom';

function TransferPage() {
  dayjs.extend(duration);

  const userInfo = {}; //TODO: 改为从store 中拿取
  // JSON.parse(Cookies.get('user') || '{}');
  const auth = React.useContext(AuthContext);

  const [transferList, setData] = useState<TransferType[]>([]);

  const columns: ColumnsType<TransferType> = [
    {
      title: 'Name',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 350,
      ellipsis: {
        showTitle: false,
      },
      render: (fileName: string) => {
        return (
          <Tooltip placement="topLeft" title={fileName}>
            {fileName}
          </Tooltip>
        );
      },
    },
    {
      title: 'Work Server',
      dataIndex: 'workServer',
      key: 'workServer',
      width: 180,
      align: 'center', //一定要定义了 ColumnsType 才可以在这里使用 align
    },
    {
      title: 'Dest Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Process Rate',
      dataIndex: 'processRate',
      key: 'processRate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '持续时间',
      dataIndex: 'lastModify',
      key: 'lastModify',
      render: (lastModify: string) => {
        return (
          parseInt(
            '' + dayjs.duration(dayjs().diff(dayjs(lastModify))).asHours(),
          ) + ' 小时'
        );
      },
    },
  ];

  useEffect(() => {
    // 试试直接在这里拿取context的值
    const getList = async () => {
      const { data } = await getTransferList();
      data.map((item: TransferType) => {
        item.type = _.capitalize(item.type);
        return item;
      });
      setData(data);
    };
    getList()
      .then()
      .catch(error => {
        const customMessgaeFromBackend = error.response.data.error;

        const displayError = () => {
          message.error(customMessgaeFromBackend).then();
        };
        displayError();
      });
  }, []);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, onSelectChange] = useState([]);

  const hasSelected = selectedRowKeys.length > 0;

  const rowChangeYa = (value: any) => {
    onSelectChange(value);
  };

  const selectedRow = (item: any) => (event: any) => {
    //    Note 在这里进行 事件添加
    // const dd: any = [item.id, ...selectedRowKeys]
    // Note: TODO: 暂时禁用 点击 row 的逻辑， 因为这个里面涉及到了对 该 Row 的现存的 state 进行改变
    // onSelectChange(dd)
  };

  const action: MouseEventHandler<any> | any = (selecteAction: MenuInfo) => {
    setLoading(true);

    updateTransfer(selectedRowKeys[0], selecteAction.key)
      .then(() => {
        const getList = async () => {
          const { data } = await getTransferList();
          data.map((item: TransferType) => {
            item.type = _.capitalize(item.type);
            return item;
          });
          setData(data); // 用了 setData 本身就会重新刷新页面
          setLoading(false);
        };

        // // todo： 确定一下是否真的会刷新
        getList()
          .then()
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(error => {
        const customMessgaeFromBackend = error.response.data.message;
        const displayError = () => {
          message.error(customMessgaeFromBackend);
        };
        displayError();
        setLoading(false);
      });
  };

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: rowChangeYa,
  };
  const navi = useNavigate();
  // const confirmOut = () => {
  //   auth.signOut(() => {
  //     navi('/login', { replace: true });
  //   });
  // };

  const menu = (
    <Menu onClick={action}>
      <Menu.Item key="complete"> 完成</Menu.Item>
      <Menu.Item key="error"> 错误</Menu.Item>
      <Menu.Item key="restarting"> 重启</Menu.Item>
    </Menu>
  );

  return (
    <div className="Transfer-list">
      <Space align={'end'} style={{ float: 'right', marginBottom: '20px' }}>
        <Dropdown.Button
          type="primary"
          disabled={!hasSelected || transferList.length === 0}
          overlay={menu}
          onClick={action}
        >
          完成
        </Dropdown.Button>
      </Space>

      <Table<any>
        onRow={item => {
          return {
            onClick: selectedRow(item), // 点击行
          };
        }}
        loading={loading}
        locale={{
          emptyText: '当前运行正常',
        }}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={transferList}
        rowKey="id"
        columns={columns}
        bordered
      />
    </div>
  );
}

export default TransferPage;
