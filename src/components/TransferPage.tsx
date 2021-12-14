import React, {MouseEventHandler, useEffect, useState,} from 'react';
import {Table, Tooltip, Button, Space, Avatar, Popconfirm, Menu, Dropdown, Spin} from 'antd';
import {getTransferList, updateTransfer} from "../api/transfer.api";
import {TransferInterface} from "./dto/transfer.interface";

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

import * as _ from 'lodash';
import {ColumnsType} from "antd/es/table";
import {AuthContext} from "../App";
import {MenuInfo} from 'rc-menu/lib/interface'

import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';


function TransferPage() {

    dayjs.extend(duration);

    const userInfo = JSON.parse(Cookies.get('user') || '{}');
    const auth = React.useContext(AuthContext)

    const [user] = useState<any>(userInfo)
    const [transferList, setData] = useState<TransferInterface[]>([]);

    const columns: ColumnsType<TransferInterface> = [
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
                    </Tooltip>);
            },
        },
        {
            title: 'Work Server',
            dataIndex: 'workServer',
            key: 'workServer',
            width: 180,
            align: 'center'   //一定要定义了 ColumnsType 才可以在这里使用 align
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
                return parseInt(
                    '' + dayjs.duration(dayjs().diff(dayjs(lastModify))).asHours(),
                ) + ' 小时'
            }
        },

    ];

    useEffect(() => {
        // 试试直接在这里拿取context的值
        const getList = async () => {
            const {data} = await getTransferList();
            data.map((item: TransferInterface) => {
                item.type = _.capitalize(item.type)
                return item;
            })
            setData(data)
            console.log(' 设置 data 后肯定充值')
        }
        getList().then()

    }, [])


    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, onSelectChange] = useState([])

    const hasSelected = selectedRowKeys.length > 0;

    const rowChangeYa = (value: any) => {
        console.log(value);
        onSelectChange(value)
    }

    const selectedRow = (item: any) => (event: any) => {
        //    Note 在这里进行 事件添加
        // const dd: any = [item.id, ...selectedRowKeys]
        // Note: TODO: 暂时禁用 点击 row 的逻辑， 因为这个里面涉及到了对 该 Row 的现存的 state 进行改变
        // onSelectChange(dd)
    }

    const action:MouseEventHandler<any>| any = (selecteAction:MenuInfo) => {

        setLoading(true)

        updateTransfer(selectedRowKeys[0],selecteAction.key).then(value => {
            const getList = async () => {
                const {data} = await getTransferList();
                data.map((item: TransferInterface) => {
                    item.type = _.capitalize(item.type)
                    return item;
                })
                setData(data)   // 用了 setData 本身就会重新刷新页面
                setLoading(false)
            }
            getList().then()  // todo： 确定一下是否真的会刷新
        })

    }

    const rowSelection: any = {selectedRowKeys: selectedRowKeys, onChange: rowChangeYa}
    const navi = useNavigate();
    const confirmOut = () => {
        auth.signOut(() => {
            navi('/login', {replace: true});
        })
    }


    const menu = (
        <Menu onClick={action}>
            <Menu.Item key="complete"> Complete</Menu.Item>
            <Menu.Item key="error"> Error</Menu.Item>
            <Menu.Item key="pending"> Pending</Menu.Item>
        </Menu>
    );

return (
    <div className="Transfer-list">
        <Popconfirm
            placement="bottomRight"
            title={"确定要登出吗？"}
            onConfirm={confirmOut}
            okText="登出"
            cancelText="取消"
        >
            <Avatar className="avatar-container" style={{cursor: "pointer"}}>
                {user.name}
            </Avatar>
        </Popconfirm>


        <Space align={"end"} style={{float: "right", marginBottom: "20px"}}>
            <Dropdown.Button
                type="primary"
                disabled={!hasSelected || transferList.length === 0}
                overlay={menu} onClick={action}>Complete</Dropdown.Button>
        </Space>


        <Table<any>
            onRow={item => {
                return {
                    onClick: selectedRow(item), // 点击行
                };
            }}
            loading={loading}
            locale={{
                emptyText: "当前运行正常"
            }}
            rowSelection={
                {
                    type: 'radio',
                    ...rowSelection
                }
            }
            dataSource={transferList} rowKey="id" columns={columns} bordered/>

    </div>
);
}

export default TransferPage;
