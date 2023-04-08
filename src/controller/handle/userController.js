const fs = require('fs');
const qs = require('qs');
const topicService = require('../../service/topicService')
const userService = require('../../service/userService')
class UserController{
    currentIdUser;
    getBlogUserHtml = (posts, userHtml) =>{
        let postHtml = '';
        let words = '';
        posts.map((item)=>{
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
                <form method="POST" onsubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                <input name="idDelete" type="hidden" value='${item.id_post}'>
                <button type="submit" id="delete" class="btn btn-outline-warning" >Delete</button>
                </form>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
            // console.log(item.id_user + "alo alo alo alo alo alo");
            if (item.id_user === this.currentIdUser) {
                let k = postHtml.indexOf(`id="delete"`);
                let postHtml_01 = postHtml.slice(0,k) + `type="hidden" `;
                let postHtml_02 = postHtml.slice(k);
                postHtml = postHtml_01 + postHtml_02;
            }
        })
        userHtml = userHtml.replace('{posts}', postHtml)
        return userHtml
    }


    blogUser = async (req, res,id) => {
        this.currentIdUser = id;
        console.log(this.currentIdUser + "aaaaaaaaaaaaaaaaaaaaaaaaa");
        if(req.method === 'GET'){
            fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                let posts = await userService.getUserPost(id)
                userHtml = this.getBlogUserHtml(posts,userHtml)
                res.write(userHtml);
                res.end();
            })
        }else{
            // let data = ''
            // req.on('data', (chunk) => {
            //     data = data + chunk;
            // })
            // console.log(data)
            // req.on('end', async () => {
            //     let deletePost = qs.parse(data);
            //     if(deletePost.idDelete){
            //         let id = deletePost.idDelete
            //         await userService.deleteAPost(id,id_post)
            //         res.writeHead(301, {location: '/home'})
            //         res.end();
            //     }
            // })
        }
    }

    addPost = async (req,res,id_user)=>{
        if (req.method === 'GET') {
            fs.readFile('./view/addProduct.html', 'utf-8', async(err,addHtml)=>{
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
        }else{
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
module.exports = new UserController()