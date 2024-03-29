const InfoId = {
  like: 'b_JFxHhkQlp9nvVXyH2EE02YIH2U6kUj71UqsspyFM8',
  content: 'gSZolmS3oikRODqlJy0LGyrWtJgRZv2wV05CZBmW8ko',
  reply: 'OhXH6fGsvmuAQGzrTBZYnggUlasZfqBjd0xzFvgZtjI',
  band: 'm1ULncMbn3rDVirXA_2-EoLHtmRWSsVc3Fg8NlCWW_s',
  joinGroup: 'gVM-0N8z4sipyh4riEaEUrSuRVusfgsfk6U3DrDV_-w',
  examine: 'HDFi5dRAZ-sWt-J7LJ6OR59Oc3hgAqtOTqyfosR3qX4',
  forward: '-G-UDwc7TcN9fqymhEOQVyRKabgx0nt4M8BmW0BHSsA',
  signIn: "Ca_xIYFYmajur3jRrlxqATJlBmA-Z1E8pu9IlyvLnIo",
  follow: "FK_z03HLwu5lAtmwPxXd0wd81owIbs077fD0kVtpAec"
}
const InfoName = {
  [InfoId.like]: '点赞',
  [InfoId.content]: '评论',
  [InfoId.reply]: '回复',
  [InfoId.band]: '组乐队申请',
  [InfoId.joinGroup]: '申请加入小组',
  [InfoId.examine]: '审核结果',
  [InfoId.forward]: '作品转发',
  [InfoId.signIn]: '签到',
  [InfoId.follow]: '关注'
}

const requestUrls = {
  Dev: {
    // baseUrl:"http://192.168.1.173:3000"
    // baseUrl: "http://localhost:3000"
    // baseUrl: "http://192.168.31.40:3000",
    // baseUrl: "http://192.168.0.145:3000"
    //  baseUrl:"http://192.168.31.40:3000"
    baseUrl: "https://www.shengruo.top"
    //  baseUrl:"https://www.shengruo.top"
    // baseUrl: "http://47.111.87.121:3000"
    //  baseUrl:"https://www.eigene.cn"
    // baseUrl:"http://eigene.free.idcfengye.com"
  },
  Test: {
    // baseUrl: "https://www.eigene.cn"
  },
  Prod: {
    // baseUrl: "https://www.eigene.cn"
  },
  SocketProd: {
    // baseUrl:"http://localhost:8000"
    //  baseUrl:"https://localhost",
    // baseUrl: "wss://www.eigene.cn"
    baseUrl: "wss://www.shengruo.top"
    // baseUrl:"ws://47.111.87.121:8000"
  },
  Qiniu: {
    baseUrl: 'http://cdn.shengruo.top'
  },


}
module.exports = {
  InfoId: InfoId,
  InfoName: InfoName,
  requestUrls: requestUrls
}