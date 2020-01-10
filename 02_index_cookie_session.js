// 导入项目需要的第三方包
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
// 创建 express 服务器
const app = express();

app.use('/', express.static(path.join(__dirname, './www')));

app.use('/public', express.static(path.join(__dirname, './public')));
// 第一次访问需要设置代理
app.set('trust proxy', 1) // trust first proxy

// 启用 cookieSession 的中间件，用户访问服务器的时候，自动生成一个标识，并发到浏览器。
// 浏览器自动用 cookie 技术保存到浏览器本地。
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));


// 服务器在 3000 端口启动
app.listen(3000, () => {
    // console.log('服务器开启： http://127.0.0.1:3000/index.html');
    console.log('服务器开启： http://127.0.0.1:3000/public/uploads/6ab9d27f3bd4fabbdb31b1f50dfc19c1.png');
});

app.get('/', (req, res) => {
    console.log(req);
    // Update views
    req.session.aaa = 111111111;
    req.session.abc = (req.session.abc || 0) + 1;
    // Write response
    res.send(req.session.abc + ' views')
})

app.get('/hero', (req, res) => {
    console.log(req);
    res.send('英雄页面');
});


app.get('/edit', (req, res) => {
    console.log(req);
    res.send('编辑页面');
});

// get 姿势打开的首页
app.get('/search', (req, res) => {
    console.log(req);
    const { id, callback } = req.query;
    // res.send('alert(666)');
    if (callback) {
        // 发送到前台💁
        res.send(`${callback}({
            code:200,
            msg:'获取成功',
            data: {
                id: ${id},
                name:'大番薯🍠',
                age:19
            }
        })`);
    } else {
        res.send({
            code: 400,
            msg: '查询失败'
        });
    }
});

// const fs = require('fs');
// const path = require('path');
// app.get('/www/index.html',(req, res) => {
//     const data =  fs.readFileSync(path.join(__dirname,'/www/index.html'));
//     res.type('html');
//     res.send(data);
// });





