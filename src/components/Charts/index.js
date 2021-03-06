// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import numeral from 'numeral';
import './g2';
import ChartCard from './ChartCard';
import Bar from './Bar';
import LineBar from './LineBar';
import Pie from './Pie';
import Radar from './Radar';
import Gauge from './Gauge';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Field from './Field';
import WaterWave from './WaterWave';
import TagCloud from './TagCloud';
import Area from './AreaGlobal';
import TimelineChart from './TimelineChart';
import IntervalChart from './IntervalChart';
import MiniLine from './MiniLine';

const yuan = val => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
  yuan,
  Bar,
  LineBar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
  Area,
  IntervalChart,
  MiniLine,
};

export {
  Charts as default,
  yuan,
  Bar,
  LineBar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
  Area,
  IntervalChart,
  MiniLine,
};
