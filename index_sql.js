// 导入项目需要的第三方包
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
// 导入 nodeJS 内置模块
const path = require('path');
const fs = require('fs');

const db = require('./db');

console.log(db);


// 创建 express 服务器
const app = express();

// 利用 multer 第三方包 multer，初始化一个用于上传 form-data 图片的 函数，函数名叫 upload。
// !!!! 上传插件需要修改成  .single('icon');
const upload = multer({ dest: path.join(__dirname, '/public/uploads/') }).single('icon');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 使用第三方中间件 cors 实现跨域
app.use(cors());

// ----------------------- 下面是接口代码 - 业务代码 ------------------------------


// 服务器在 3000 端口启动
app.listen(3000, () => {
    console.log('服务器开启： http://127.0.0.1:3000/login');
});

// get 姿势打开的首页
app.get('/', (req, res) => {
    res.send('<h1>英雄联盟接口</h1>');
});

// post 姿势打开的首页
app.post('/', (req, res) => {
    res.send('<h1>POST姿势打开的首页</h1>');
});

// ### 用户登录
// 请求地址：/login
// 请求方式：post
// 请求参数：
// | 名称     | 类型   | 说明            |
// | -------- | ------ | --------------- |
// | username | string | 用户名（admin） |
// | password | string | 密码(123456)    |
app.post('/login', (req, res) => {

    // 从 req.body 对象中解构出 username 和 password
    const { username, password } = req.body;

    // 调用封装好的函数，获取文件信息，内部返回<数组>格式数据，保存到 data 常量中
    // 登录读取的是 user.json，英雄数据是 hero.json
    const data = getFileData('./json/user.json');

    // 调用数组 find 方法，获取数组中某个用户名的信息
    const user = data.find(item => item.username === username);

    // 如果能获取到信息，验证用户名和密码
    if (user) {
        // 判断用户输入的用户名密码是否都和本地的用户名密码相同
        if (username === user.username && password === user.password) {
            // 如果完全相同，返回登录成功
            res.send({
                code: 200,
                msg: '登录成功'
            });
        }
        // 如果不相同，提示错误
        else {
            res.send({
                code: 400,
                msg: '用户名或密码错误'
            });
        }
    }
    // 如果通过 find 方法找不到用户就执行 else 逻辑
    else {
        // 没有用户提示用户名不存在
        res.send({
            code: 400,
            msg: '用户不存在'
        });
    }
});

// 所有英雄查询
app.get('/list', (req, res) => {
    db.get({
        success: resust => {
            res.send({
                code: 200,
                msg: '获取成功',
                data: resust
            });
        },
        fail: err => {
            res.send({
                code: 400,
                msg: '获取失败',
            });
        }
    })
});

// 单个英雄查询
app.get('/search', (req, res) => {
    // 获取 get 方式的参数
    const { id } = req.query;
    // 调用 db.search 查找单个数据，并接受返回值，用于判断
    db.search({
        id,
        success: result => {
            res.send({
                code: 200,
                msg: '获取成功',
                data: result
            });
        },
        fail: err => {
            res.send({
                code: 400,
                msg: '获取失败',
            });
        }
    });
});

// 英雄增加
//      1. 需要使用 multer 插件事项图片上传，注意图片属性为 icon
//      2. 如何获取到上传图片后再服务器的图片名称
//      3. 还要把图片名称和路径自己拼成相对路径
app.post('/add', upload, (req, res) => {  // 注意第二个参数 upload
    // 获取 form-data 文本参数
    const { name, skill } = req.body;
    // 获取 form-data 图片文件名
    const { filename } = req.file;
    // 调用 db.add 添加数据，并接受返回值，用于判断
    db.add({
        name,
        skill,
        // icon: path.join('public/uploads', filename),
        // 直接拼接路径, path.join() 拼接无法正确入数据库
        icon:`/public/uploads/${filename}`,
        success: result => {
            res.send({ code: 200, msg: '新增成功' });
        },
        fail: err => {
            res.send({ code: 400, msg: '参数错误' });
        }
    });
});

// 英雄删除
app.get('/delete', upload, (req, res) => {
    // 获取 get 方式的参数
    const { id } = req.query;
    // 调用 db.delete 删除数据，并接受返回值，用于判断
    db.delete({
        id: id,
        success: result => {
            res.send({ code: 200, msg: '删除成功' });
        },
        fail: err => {
            res.send({ code: 400, msg: '参数错误' });
        }
    });
});

// 英雄编辑
app.post('/edit', upload, (req, res) => {
    // 获取 form-data 文本参数
    const { id, name, skill } = req.body;
    // 获取 form-data 图片文件名
    const { filename } = req.file;
    // 调用 db.edit 编辑数据，并接受返回值，用于判断
    db.edit({
        id,
        name,
        skill,
        // icon: path.join('public/uploads', filename),
        // 直接拼接路径, path.join() 拼接无法正确入数据库
        icon:`/public/uploads/${filename}`,
        success: result => {
            res.send({ code: 200, msg: '修改成功' });
        },
        fail: err => {
            res.send({ code: 400, msg: '参数错误' });
        }
    });
});




