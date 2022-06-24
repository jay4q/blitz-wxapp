/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'entry-visit-offline' | 'clock' | 'email' | 'leader' | 'pending' | 'group' | 'flag' | 'call' | 'entry-visit' | 'entry-admin' | 'entry-activity' | 'entry-statistics' | 'entry-team' | 'entry-message' | 'copy' | 'entry-audit' | 'entry-volunteer' | 'enter' | 'refresh' | 'menu' | 'scan';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
