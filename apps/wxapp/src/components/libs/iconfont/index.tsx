/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';

export type IconNames = 'entry-visit-offline' | 'clock' | 'email' | 'leader' | 'pending' | 'group' | 'flag' | 'call' | 'entry-visit' | 'entry-admin' | 'entry-activity' | 'entry-statistics' | 'entry-team' | 'entry-message' | 'copy' | 'entry-audit' | 'entry-volunteer' | 'enter' | 'refresh' | 'menu' | 'scan';

export interface IconProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<IconProps> = () => {
  return null;
};

export default IconFont;
