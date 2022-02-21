import React from 'react';
import { Card, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const AsrCard = React.forwardRef((props: any, ref) => {
  console.log(props);
  const { actions, ...restProps } = props;
  return (
    <Card
      title={props.title}
      bordered={true}
      hoverable
      {...restProps}
      actions={[
        <Tooltip title="详情" key="tooltips-info">
          <ExclamationCircleOutlined
            key="info"
            onClick={() => actions.checkDetail()}
          />
        </Tooltip>,
        <Tooltip title="删除" key="tooltips-delete">
          <DeleteOutlined key="delete" onClick={() => actions.deleteDetail()} />
        </Tooltip>,
      ]}
    />
  );
});

AsrCard.displayName = 'AsrCard';

export default AsrCard;
