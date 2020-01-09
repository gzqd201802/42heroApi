// 引入 mysql 包
const mysql = require('mysql');

// 创建 mysql 数据库连接对象
const connection = mysql.createConnection({
    // 数据库地址
    host: 'localhost',
    // 用户名
    user: 'root',
    // 密码
    password: 'root',
    // 数据库名称
    database: 'gzqd42'
});

// 连接数据库
connection.connect();

// db 数据库操作封装
module.exports = {
    // 增 - 注意给回调函数设置默认值，防止没有传入的实参为 undefined
    add({ name, skill, icon, success = () => { }, fail = () => { } }) {
        // 编辑数据  sql 查询语句，注意键名称还是需要加引号
        connection.query(
            // mysql 数据库语句
            `insert into hero (name,skill,icon) values ("${name}","${skill}","${icon}");`,
            // 回调函数
            (error, results) => {
                // 如更有错误抛出异常错误
                if (error) throw error;
                // 打印返回值
                // console.log('操作后返回值', results);
                const { affectedRows } = results;
                if (affectedRows === 1) {
                    // console.log('增加成功');
                    success(results);
                } else {
                    // console.log('增加失败');
                    fail(results);
                }
            });
    },
    // 删
    delete({ id, success = () => { }, fail = () => { } }) {
        // 编辑数据  sql 查询语句，注意键名称还是需要加引号
        connection.query(
            // mysql 数据库语句
            `delete from hero where id=${id};`,
            // 回调函数
            (error, results) => {
                // 如更有错误抛出异常错误
                if (error) throw error;
                // 打印返回值
                // console.log('操作后返回值', results);
                const { affectedRows } = results;
                // 如果一行受影响
                if (affectedRows === 1) {
                    // console.log('删除成功');
                    success(results);
                }
                // 否则失败  
                else {
                    // console.log('增加失败');
                    fail(results);
                }
            });
    },
    // 改
    edit({ id, name, skill, icon, success = () => { }, fail = () => { } }) {
        // 编辑数据  sql 查询语句，注意键名称还是需要加引号
        connection.query(
            // mysql 数据库语句
            `update hero set name="${name}",skill="${skill}",icon="${icon}" where id=${id};`,
            // 回调函数
            (error, results) => {
                // 如更有错误抛出异常错误
                if (error) throw error;
                // 打印返回值
                // console.log('操作后返回值', results);
                // 解构返回值的影响条数
                const { affectedRows } = results;
                // 如果一行受影响
                if (affectedRows === 1) {
                    // console.log('修改成功');
                    success(results);
                }
                // 否则失败 
                else {
                    // console.log('修改失败');
                    fail(results);
                }
            });
    },
    // 查全部
    get({ success = () => { }, fail = () => { } }) {
        // 查询数据库数据
        connection.query(
            // mysql 数据库语句
            `select * from hero;`,
            // 回调函数
            (error, results) => {
                // 如更有错误抛出异常错误
                if (error) return fail(error);
                // 回去调用函数，并且把 results 作为实参传过去
                success(results);
            });
    },
    // 查一条，success 和 fail 设置一个默认值，防止没有传函数报错
    search({ id, success = () => { }, fail = () => { } }) {
        // 查询数据库数据
        connection.query(
            // mysql 数据库语句
            `select * from hero where id=${id};`,
            // 回调函数
            (error, results) => {
                // 如更有错误抛出异常错误
                if (error) return error;
                // 打印返回值
                // console.log('操作后返回值', results);
                // 把获取的数组解构出对象
                const [data] = results;
                // 如果有对象
                if (data) {
                    // 回去调用函数，并且把 results 作为实参传过去
                    success(data);
                }else{
                    // 回去调用函数失败的函数
                    fail(error);
                }
            });
    }
}