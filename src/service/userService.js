const connection = require('../entity/connection');

class UserService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }

    getUser = (user) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from users where user_name = '${user.user_name}'and password = '${user.password}';`, (err, users) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
        })
    }
    updateAccount = (user) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`update account set user_name = '${user.user_name}', password = '${user.password}', avatar = '${user.img}'`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }

    // Hien thi bai viet pucbic va status friend cua friend
    getUserPost(id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time, id_post, id_user from posts where id_user = '${id}' or status = 'public' or ((select check_friend from friend_manager where id_user_01 = id_user and id_user_02 = '${id}') = 1 and status = 'friend');
            `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    // Tim cac bai viet theo tu khoa
    findPostByKeyword(id_user, keyword){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time, id_post from posts where content like '%${keyword}%' and (id_user = '${id_user}' or status = 'public' or ((select check_friend from friend_manager where id_user_01 = id_user and id_user_02 = '${id_user}') = 1 and status = 'friend'))`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    // Tim cac bai viet cua minh
    findMyPost(id_user){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time from posts where id_user = ${id_user}`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    // Gui loi moi ket ban
    sendAddFriendRequest(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into friend_manager values(${id_user},${id_partner},0)`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('sent successfully')
                }
            })
        })
    }
    // Chap nhan loi moi ket ban
    acceptAddFriendRequets(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into friend_manager values(${id_user},${id_partner},1)
            update friend_manager set check_friend = 1 where id_user_01 = ${id_partner} and id_user_02 = ${id_user}
            `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('accepted add friend request')
                }
            })
        })
    }
    // Check xem da la friend chua neu 1: friend;  0: da gui; null: chua gui
    checkRelationship(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`select check_friend from friend_manager where id_user_01 = '${id_user}' and id_user_02 = ${id_partner}`, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    // Tu choi loi moi ket ban



    //Xoa mot bai viet cua minh
    deleteAPost(id_user, id_post){
        return new Promise((resolve, reject) => {
            this.connect.query(`delete from posts where id_post=${id_post} and id_user = ${id_user}`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('accepted add friend request')
                }
            })
        })
    }

    // Sua bai viet
    updateAPost(post){
        return new Promise((resolve, reject) => {
            this.connect.query(`update posts set content = '${post.content}', img = '${post.img}', title = '${post.title}', id_topic= '${post.id_topic}', status= '${post.status}' where id_post = '${post.id_post}'`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(post)
                }
            })
        })
    }

    // Tao bai viet
    createAPost(id_user, post){
        return new Promise((resolve, reject) => {
            this.connect.query(`Insert into posts (id_user, content, img, title, time, id_topic, status)
 VALUES ('${id_user}', '${post.content}', '${post.img}', '${post.title}', now(), '${post.id_topic}' ,'${post.status}');
`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(post)
                }
            })
        })
    }

    createUser= (user) =>{
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into account(user_name, password, power, avatar) values('${user.user_name}','${user.password}', 0, '${user.image}')`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}
module.exports = new UserService();