var login = require('./login');
var maze = require('./maze');

module.exports = function(app){
    //登录首页
    app.all('/', function(req, res){
        res.redirect('index');
    });
    app.all('/index', function(req, res){
        res.render('index');
    });
    app.get('/login',function(req, res){
        res.redirect('index');
    });

    //登录，成功后重定向至main
    app.post('/login', login);
    //主界面
    app.get('/main', function(req, res){
        res.render('main');
    });

    //服务，获取迷宫信息json串
    app.get('/maze/show/:mapStageId',maze.show);
    //服务，获取迷宫所有层信息json串
    app.get('/maze/infos/:mapStageId',maze.infos);

    //服务，战斗迷宫中某一层的某一个index
    app.get('/maze/battle/:mapStageId/:layer/:itemIndex/:manual',maze.battle);

};
