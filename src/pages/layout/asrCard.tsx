/**
 * date: 2022-02-21, Mon, 17:50
 * author: TooZhun9
 * feature： 抽离了一个 asrCard 的组件， 并给予该组件一定的功能
 */
import React from 'react';
import { Card, Col, Row, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PropTypes, { objectOf, Validator } from 'prop-types';
import { FileType, TransferType } from '../../components/dto/transfer.type';
import { getFilesize } from '../../common/util';
import dayjs from 'dayjs';

// 定义props， 约束输入
export interface AsrCardProps {
  hoverAble: boolean;
  actions: {
    checkDetail: { (keyItem: string): void };
    deleteDetail: { (keyItem: string): void };
  };
  item: FileType;
}

export interface AsCardForwardingComponent<P = unknown> {
  (props: any, ref: any): React.ReactElement | null; // 用来声明这个参数，也就是这个接口方法的入参和返回的值
  propTypes?: any;
  contextTypes?: any;
  defaultProps?: Partial<P>;
  displayName?: string;
}
type ShapeAction = {
  checkDetail: any;
  deleteDetail: any;
};

const objD: ShapeAction = {
  checkDetail: PropTypes.func.isRequired,
  deleteDetail: PropTypes.func,
};

const asrCardPropTypes = {
  title: PropTypes.string,
  hoverAble: PropTypes.bool,
  actions: PropTypes.shape<ShapeAction>(objD),
};

const defaultProps = {};

const AsrCard: AsCardForwardingComponent<AsrCardProps> = React.forwardRef(
  (props: AsrCardProps, ref) => {
    console.log(props);
    const {
      actions,
      item: {
        asrListKey: keyItem,
        fileName,
        fileSize,
        fileLocation,
        createdTime,
      },
      hoverAble = false,
      ...restProps
    } = props;

    return (
      <Card
        title={fileName}
        bordered={true}
        hoverable={hoverAble}
        {...restProps}
        actions={[
          <Tooltip title="详情" key="tooltips-info">
            <ExclamationCircleOutlined
              key="info"
              onClick={() => actions.checkDetail('' + keyItem)}
            />
          </Tooltip>,
          <Tooltip title="删除" key="tooltips-delete">
            <DeleteOutlined
              key="delete"
              onClick={() => actions.deleteDetail('' + keyItem)}
            />
          </Tooltip>,
        ]}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>文件名</Col>
          <Col span={16} style={{ wordBreak: 'break-all' }}>
            {fileName}
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>大小</Col>
          <Col span={16} style={{ wordBreak: 'break-all' }}>
            {getFilesize(fileSize)}
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>云端位置</Col>
          <Col span={16} style={{ wordBreak: 'break-all' }}>
            {fileLocation}
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>创建时间</Col>
          <Col
            span={16}
            style={{
              wordBreak: 'break-all',
              fontStyle: 'italic',
            }}
          >
            {dayjs(createdTime).format('YY/MM/DD HH:mm:ss')}
          </Col>
        </Row>
      </Card>
    );
  },
);

AsrCard.displayName = 'AsrCard';
AsrCard.propTypes = asrCardPropTypes;
AsrCard.defaultProps = defaultProps;

export default AsrCard;
