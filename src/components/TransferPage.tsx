import React, {useEffect, useState} from 'react';
import {Table, Tooltip, Button, Space} from 'antd';
import {getTransferList} from "../api/transfer.api";
import {TransferInterface} from "./dto/transfer.interface";

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

import * as _ from 'lodash';
import {ColumnsType} from "antd/es/table";


function TransferPage() {

    dayjs.extend(duration);

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
        const getList = async () => {
            const {data} = await getTransferList();
            data.map((item: TransferInterface) => {
                item.type = _.capitalize(item.type)
                return item;
            })
            setData(data)
        }
        getList().then()

    }, [])

    const start = () => {
        console.log('我是大帅比')
    }

    const [loading] = useState(false);
    const [selectedRowKeys, onSelectChange] = useState([])

    const hasSelected = selectedRowKeys.length > 0;

    const rowChangeYa = (value: any) => {
        console.log(value);
        onSelectChange(value)
    }

    const selectedRow = (item: any) => (event: any) => {
        console.log(item)
        //    Note 在这里进行 事件添加
        const dd:any = [item.id,...selectedRowKeys]
        // Note: TODO: 暂时禁用 点击 row 的逻辑， 因为这个里面涉及到了对 该 Row 的现存的 state 进行改变
        // onSelectChange(dd)
    }

    const rowSelection: any = {selectedRowKeys: selectedRowKeys, onChange: rowChangeYa}
    return (
        <div className="Transfer-list">


            <Table<any>
                onRow={item => {
                    return {
                        onClick: selectedRow(item), // 点击行
                    };
                }}
                rowSelection={rowSelection}
                dataSource={transferList} rowKey="id" columns={columns} bordered/>
            <Space align={"end"} style={{float: "right"}}><Button type="primary" onClick={start} disabled={!hasSelected}
                                                                  loading={loading}>
                操作
            </Button></Space>

        </div>
    );
}

export default TransferPage;
