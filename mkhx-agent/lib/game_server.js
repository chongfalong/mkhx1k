var http = require('http');
var querystring = require('querystring');
var URL = require('url');
var commons = require('./commons');
var services = require('./game_server_services');

/**
 * 登录游戏服务器
 * @param {JSON} passport
 * @param {function} callback function(err,userData),userData包含passport、pptRtnData、host、sid
 */
exports.passportLogin = function (passport,callback){
    var server={
        host:URL.parse(passport.GS_IP).host,
        path:services.passportLogin.path,
        method:services.passportLogin.method,
        headers:commons.headers()
    };
    var reqContent = services.passportLogin.params;
    reqContent.Udid=commons.deviceInfo.udid;
    reqContent.time = passport.timestamp;
    reqContent.UserName = passport.userName;
    reqContent.key = passport.key;
    reqContent.Password = passport.U_ID;
    reqContent  = querystring.stringify(reqContent);
    server.headers['Content-Length'] = reqContent.length;
    var req = http.request(server,function(res){
        res.setEncoding('utf8');
        res.on('data',function(data){
            if(data){
                data = JSON.parse(data);
                if(data.status){
                    //登录成功
                    var userData = {
                        passport: passport,
                        pptRtnData: data.data,
                        host: server.host,
                        sid: res.headers['set-cookie'][0].split(/\W+/)[1]//获取cookie中的sid
                    };
                    callback(null,userData);
                }
                else {
                    //登录失败
                    callback(data,null);
                }
            }
            else{
                callback('服务器无响应',null);
            }
        });
    });
    req.write(reqContent);
    req.end();
};

/**
 * 迷宫相关操作
 * 
 */
exports.maze = {
    /**
     * 获取迷宫状态信息
     * @param {String} host 游戏服务器地址
     * @param {String} sid 游戏服务器用户_sid
     * @param {String|Number} mapStageId 迷宫所在的地图号
     * @param {Function} callback Function(err,mazeInfo)
     */
    show: function (host, sid, mapStageId, callback){
        var server={
            host: host,
            path: services.maze.show.path,
            method: services.maze.show.method,
            headers: commons.headers()
        };
        var reqContent = services.maze.show.params;
        reqContent.MapStageId = mapStageId;
        reqContent = querystring.stringify(reqContent);
        server.headers['Cookie'] = '_sid=' + sid;
        server.headers['Content-Length'] = reqContent.length;

        var req = http.request(server,function(res){
            res.setEncoding('utf8');
            res.on('data',function(data){
                if (data) {
                    data = JSON.parse(data);
                    if(data.status=='1'){
                        //获取成功
                        callback(null,data.data);
                    }
                    else {
                        //获取失败
                        callback(data,null);
                    }
                }
                else {
                    callback('服务器无响应',null);
                }
            });
        });
        req.write(reqContent);
        req.end();
    },
    /**
     * 获取某层信息
     * @param {String} host 游戏服务器地址
     * @param {String} sid 游戏服务器用户_sid
     * @param {String|Number} mapStageId 迷宫所在的地图号
     * @param {String|Number} layer 层号
     * @param {Function} callback Function(err,mazeInfo)
     */
    info: function (host, sid, mapStageId, layer,callback){
        var server={
            host: host,
            path: services.maze.info.path,
            method: services.maze.info.method,
            headers: commons.headers()
        };
        var reqContent = services.maze.info.params;
        reqContent.MapStageId = mapStageId;
        reqContent.Layer = layer;
        reqContent = querystring.stringify(reqContent);
        server.headers['Cookie'] = '_sid=' + sid;
        server.headers['Content-Length'] = reqContent.length;

        var req = http.request(server,function(res){
                res.setEncoding('utf8');
                res.on('data',function(data) {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.status == '1') {
                            //获取成功
                            callback(null, data.data);
                        }
                        else {
                            //获取失败
                            callback(data, null);
                        }
                    }
                    else {
                        callback('服务器无响应', null);
                    }
                });
        });
        req.write(reqContent);
        req.end();
    },
    battle: function (host,sid,callback){}//TODO
};