// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

// 全局 G2 设置
import { track, setTheme } from 'bizcharts';

track(false);

const config = {
  defaultColor: '#1089ff',
  shape: {
    interval: {
      fillOpacity: 1,
    },
  },
};

setTheme(config);
