const fs = require('fs');
const qs = require('qs');
const topicService = require('../../service/topicService')
const userService = require('../../service/userService')
const guestController = require('./guestController')

class UserController {
    getGeneralPostHtml = (generalPosts, userHtml) => {
        let postHtml = '';
        let words = '';
        generalPosts.map((item) => {
            words = item.content.split('.')
            postHtml += `
             <div class="card bg-transparent border-0">
            <div class="row g-3">
              <div class="col-4">
                <!-- Blog image -->
                <img class="rounded" src="${item.img}" alt="">
              </div>
              <div class="col-8">
                <!-- Blog caption -->
                <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">${item.topic_name}</a>
                <h5><a href="/post/${item.id_post}" class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
                </div>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        userHtml = userHtml.replace('{generalPosts}', postHtml)
        return userHtml
    }

    getPrivatePostHtml = (privatePosts, userHtml) => {
        let postHtml = '';
        let words = '';
        privatePosts.map((item) => {
            words = item.content.split('.')
            postHtml += `
             <div class="card bg-transparent border-0">
            <div class="row g-3">
              <div class="col-4">
                <!-- Blog image -->
                <img class="rounded" src="${item.img}" alt="">
              </div>
              <div class="col-8">
                <!-- Blog caption -->
                <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">${item.topic_name}</a>
                <h5><a class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
                </div>
                <form method="POST" onSubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                <input name="idDelete" type="hidden" value='${item.id_post}'>
                <button type="submit" class="btn btn-outline-warning">Delete</button>
                </form>
                <a type="button" class="btn btn-outline-success" href="/editPost/${item.id_post}">Update</a>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        userHtml = userHtml.replace('{privatePosts}', postHtml)
        return userHtml
    }

    blogUser = async (req, res, id) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                let generalPosts = await userService.getGeneralPost(id)
                userHtml = this.getGeneralPostHtml(generalPosts, userHtml)
                let privatePosts = await userService.getPrivatePost(id)
                userHtml = this.getPrivatePostHtml(privatePosts, userHtml)
                res.write(userHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', async () => {
                let deletePost = qs.parse(data);
                console.log(deletePost.idDelete)
                if (deletePost.idDelete) {
                    let id_post = deletePost.idDelete
                    await userService.deleteAPost(id_post)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();
                }
            })
        }
    }


    editPost = async (req, res, id) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/editPost.html', 'utf-8', async (err, editHtml) => {
                let post = await userService.findAPost(id)
                let topics = await topicService.findAllTopic()
                editHtml = editHtml.replace('{title}', post[0].title)
                editHtml = editHtml.replace('{content}', post[0].content)
                let htmlTopic = '';
                topics.map(item => {
                    htmlTopic += `<option value="${item.id_topic}">${item.topic_name}</option>`
                })
                editHtml = editHtml.replace('{topics}', htmlTopic)
                res.write(editHtml);
                res.end()
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })

            req.on('end', async () => {
                console.log(data)
                let editPost = qs.parse(data);
                console.log(editPost)
                await userService.updateAPost(id, editPost)
                res.writeHead(301, {location: `/blogUser/${guestController.currentUserId}`})
                res.end();
            })
        }
    }

    addPost = async (req, res, id_user) => {
        if (req.method === 'GET') {
            fs.readFile('./view/addProduct.html', 'utf-8', async (err, addHtml) => {
                let topics = await topicService.findAllTopic()
                let htmlTopics = ''
                topics.map(item => {
                    htmlTopics += `
                  <option value="${item.id_topic}">${item.topic_name}</option>
                  `
                })
                addHtml = addHtml.replace('{topic}', htmlTopics);
                res.write(addHtml);
                res.end()
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', () => {
                let addPost = qs.parse(data);
                userService.createUser(addPost)
                res.writeHead(301, {location: `/blogUser/${id_user}`})
                res.end();
            })
        }
    }
}
<<<<<<< HEAD
module.exports = new UserController()
=======

module.exports = new UserController
>>>>>>> f229521d13587858a728228fd9f4b49ef1f51954
