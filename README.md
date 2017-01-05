## 空间爬虫

`爬取qq空间的说说`

### usage

```sh
$ cd path/to/scorpio
$ cp src/common/config.example.js src/common/config.js
> set the config file
$ npm install
$ npm run sync
$ npm start

```

### 说明

>定向访问qq空间的说说。
1. 自动登录配置的qq空间
2. 从配置的qq空间开始访问说说列表
3. 记录访问到的说说内容和回复
4. 将回复中的qq记录下来，作为待访问目标
5. 跳过没有访问权限的空间
6. 每个qq只访问一次

### 参考
https://github.com/LiuXingMing/QQSpider


##### 备注
npm 安装nightmare有失败的情况，建议使用 [cnpm](https://www.npmjs.com/package/cnpm)


