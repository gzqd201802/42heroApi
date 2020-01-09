// 导入项目需要的第三方包
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
// 导入 nodeJS 内置模块
const path = require('path');
const fs = require('fs');

// 创建 express 服务器
const app = express();

// 利用 multer 第三方包 multer，初始化一个用于上传 form-data 图片的 函数，函数名叫 upload。
const upload = multer({ dest: path.join(__dirname, '/public/uploads/') }).single('avatar');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 使用第三方中间件 cors 实现跨域
app.use(cors());

// ------------------------- 数据增删改查封装 ------------------------

/**
 * 函数封装：根据路径，获取数据。
 * @param {*} file          文件路径
 * @param {*} defaultData   默认返回数据
 */
function getFileData(file = './json/hero.json', defaultData = []) {
    // 同步写法可能会出现读取失败的情况
    try {
        // 通过 path 拼接绝对路径
        const filePath = path.join(__dirname, file);
        // 把获取到的数据转换成 JS 对象
        return JSON.parse(fs.readFileSync(filePath));
    }
    // 如果读取失败
    catch (error) {
        // 读取失败返回一个空数组
        return defaultData;
    }
}

/**
 * 函数封装：传入数据，把数据保存到对应路径文件中
 * @param {*} defaultData 数据
 * @param {*} file 文件路径
 */
function saveFileData(defaultData = [], file = './json/hero.json') {
    try {
        // 通过 path 拼接绝对路径
        const filePath = path.join(__dirname, file);
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

const bl = saveFileData([{
    id: 1,
    name: '鸠摩智',
    skill: '报错',
    icon: 'xxx'
}]);
if (bl) {
    console.log('保存成功');
} else {
    console.log('保存失败');
}



// ----------------------- 下面是接口 ------------------------------


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






