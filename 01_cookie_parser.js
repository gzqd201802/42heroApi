// 导入项目需要的第三方包
const express = require('express');
// 导入 解析 cookie 的中间件
const cookieParser = require('cookie-parser');

// 创建 express 服务器
const app = express();

// 使用中间件
app.use(cookieParser());

// 服务器在 3000 端口启动
app.listen(3000, () => {
    console.log('服务器开启： http://127.0.0.1:3000/search');
});

// get 姿势打开的首页
app.get('/search', (req, res) => {
    console.log(req);

    const { id, callback } = req.query;

    // 
    // res.send('<h1>后端返回的数据</h1>'+ JSON.stringify(req.query));
    // 字符里面如果是 js 代码，浏览器会自动执行
    // res.send('alert(666)');
    if (callback) {
        res.cookie('token', 'tokentokentokentoken', { expires: new Date(Date.now() + 1000 * 60), httpOnly: true });
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




