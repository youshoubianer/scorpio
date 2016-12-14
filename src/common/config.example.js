'use strict'

module.exports = {
  url: 'http://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url=http%3A//qzs.qq.com/qzone/v6/portal/proxy.html&daid=5&&hide_title_bar=1&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&appid=549000912&style=22&target=self&s_url=http%3A%2F%2Fqzs.qq.com%2Fqzone%2Fv5%2Floginsucc.html%3Fpara%3Dizone&pt_qr_app=%E6%89%8B%E6%9C%BAQQ%E7%A9%BA%E9%97%B4&pt_qr_link=http%3A//z.qzone.com/download.html&self_regurl=http%3A//qzs.qq.com/qzone/v6/reg/index.html&pt_qr_help_link=http%3A//z.qzone.com/download.html',
  
  qzoneUrl: 'http://user.qzone.qq.com',
  
  blog: '2',      //日志
  photo: '4',     //照片
  mood: '311',    //说说
  share: '202',   //分享
  vedio: '847',   //视频
  music: "305",   //音乐
  msgboard: "334",//留言板
  profile: '1',   //个人档
  
  qq: '',
  pwd: '',
  
  loginWait: 3000,
  
  // 本地调试
  localDebug: true,
  
  database:{
    host: 'localhost',
    port: 3306,
    database: '',
    username: '',
    password: '',
    pool: 10,
    dialect: 'mysql',
    logging: console.log,
  }
  
}