const connection = require('../entity/connection');

class AdminService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }
    getAllPost(){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, id_post, id_topic, time from posts;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }

    deleteAPost(post_id){
        return new Promise((resolve, reject) => {
            this.connect.query(`delete from posts where id_post=${post_id}`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('xoa thanh cong')
                }
            })
        })
    }

    findPostByKeyword(content){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time from posts where content like '%${content}%'`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    findPostByTopic(topic_id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from posts where id_topic = ${topic_id} `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    findUserByUserName(user_name){
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from account where user_name like '%${user_name}%'`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}
module.exports = new AdminService();