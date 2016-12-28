'use strict';

// 引用
var crypto = require('crypto');
var request = require('request');
var querystring = require('querystring');

// 提取字段
_.getFields = function(data, fields, notSetNull) {
    var obj = {};
    for (var i = 0; i < fields.length; i++) {
        if (data[fields[i]] !== undefined) {
            obj[fields[i]] = data[fields[i]];
        } else {
            obj[fields[i]] = notSetNull ? undefined : '';
        }
    }

    return obj;
};

// 随机生成字符串
_.randString = function(len) {
    len = len || 32;
    var dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var res = '';
    for (var i = 0; i < len; i++) {
        res += dict[parseInt(Math.random() * dict.length)];
    }
    return res;
};

// 生成MD5
_.md5 = function(s) {
    return crypto.createHash('md5').update(s, 'utf8').digest('hex');
};

// 将下划线命名转换为驼峰命名
_.toCamel = function(name) {
    var newName = '';
    var underline = false;
    for (var i = 0; i < name.length; i++) {
        if (name[i] === '_' || name[i] === '-') {
            underline = true;
        } else {
            newName += underline ? name[i].toUpperCase() : name[i];
            underline = false;
        }
    };
    return newName;
};

// 获取IP地址
_.getIp = function(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

    if (ip.match(/\d+\.\d+\.\d+\.\d+/)) {
        ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    } else {
        ip = '0.0.0.0';
    }

    return ip;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
_.dateFormat = function(fmt, d) {
    var date = new Date(d);
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

_.obj2Camel = function(obj) {
    for (var prop in obj) {
        if (prop.indexOf('_') !== -1) {
            obj[_.toCamel(prop)] = obj[prop];
            delete obj[prop];
        }
    }
    return obj;
}

_.array2Camel = function(arr) {
    return _.map(arr, function(i) {
        return _.obj2Camel(i);
    })
}

_.getArrayObjFields = function(arr, field) {
    return _.map(arr, function(i) {
        return i[field];
    });
}

_.getDateString = function() {
    var date = new Date();
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
};

// 获取服务
_.services = function*(method, url, data, includeCode) {

    method = (method || 'GET').toUpperCase();
    if (method === 'GET') {
        url += (url.indexOf('?') === -1 ? '?' : '') + querystring.stringify(data);
        data = null;
    }

    let res = yield thunkify(request)({
        uri: url,
        method: method,
        form: data,
        timeout: config.timeout * 1000,
        json: true
    });

    try {
        res = res[1];
    }
    catch(e) {
        throw new Exception(6, '调取服务JSON解析失败!');
    }

    if(includeCode){
        return res;
    }

    if (res.code !== 0) {
        throw new Exception(res.code,res.msg);
    }

    return res.data;
};

// 验证邮箱
_.isEmail = function (str) {
    let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
};

// 验证手机号
_.isPhone = function (str) {
    let reg = /^1\d{10}$/;
    return reg.test(str);
};