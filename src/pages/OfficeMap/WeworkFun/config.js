const tags = [
  'A21151',
  'A21152',
  'A21153',
  'A21154',
  'A21155',
  'A21156',
  'A21157',
  'A21158',
  'A21159',
  'A21160',
  'A21161',
  'A21162',
  'A21165',
  'A21166',
  'A21167',
  'A21168',
  'A21169',
  'A21170',
  'A21171',
  'A21172',
  'A21173',
  'A21174',
  'A21175',
  'A21176',
  'A21177',
  'A21178',
  'A21179',
  'A21180',
  'A21181',
  'A21182',
];

// 6张电话亭
const phoneBooth1 = ['A21163', 'A21189'];
const phoneBooth2 = ['A21164', 'A21190'];
const phoneBooth3 = ['A21183', 'A21191'];
const phoneBooth4 = ['A21184', 'A21192'];
const phoneBooth5 = ['A21186', 'A21196'];
const phoneBooth6 = ['A21187', 'A21197'];

// 2张卡座
const booth1 = ['A21185', 'A21193', 'A21194', 'A21195'];
const booth2 = ['A21188', 'A21198', 'A21199', 'A21200'];

module.exports = {
  tags: tags.concat(
    phoneBooth1,
    phoneBooth2,
    phoneBooth3,
    phoneBooth4,
    phoneBooth5,
    phoneBooth6,
    booth1,
    booth2
  ),
  boothArr: [
    phoneBooth1,
    phoneBooth2,
    phoneBooth3,
    phoneBooth4,
    phoneBooth5,
    phoneBooth6,
    booth1,
    booth2,
  ],
};
