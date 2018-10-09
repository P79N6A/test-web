import G from '@/global';
const config = {
  403: {
    img: `${G.picUrl}four_zero_three.png`,
    title: '无权限访问该页面',
    desc: '【403】权限不足',
  },
  404: {
    img: `${G.picUrl}four_zero_four.png`,
    title: '糟糕，设计稿飞了',
    desc: '【404】找不到页面',
  },
  500: {
    img: `${G.picUrl}five_zero_zero.png`,
    title: '服务器开了个小差',
    desc: '【500】别着急，马上回来',
  },
};

export default config;
