const fs = require('fs')
const qs = require('qs')
const guestService = require('../../service/guestService')
const topicService = require('../../service/topicService')
const adminService = require('../../service/adminService')
const cookie = require('cookie')

class GuestController {
    static currentUserId;
//! Hien trang
    static getHomeHtml = (posts, homeHtml) =>{
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
                <h5><a href="/blog-details/${item.id_post}" class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
                </div>
              </div>
            </div>
          </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        homeHtml = homeHtml.replace('{posts}', postHtml)
        return homeHtml
    }

   static getLastPost = (posts, homeHtml) =>{
        let oldPosts = '';
        posts.map((item)=>{
            oldPosts += `
                  <div class="mb-3">
                  <h6 class="mb-0"><a href="/post/${item.id_post}">${item.title}</a></h6>
                  <small>6hr</small>
                  </div>
            `
        })
        homeHtml = homeHtml.replace('{oldPost}', oldPosts)
        return homeHtml
    }

   static getTopic = (topics, homeHtml) =>{
        let topicHtml = '';
        topics.map((item)=>{
            topicHtml += `
                <li className="list-inline-item m-0">
                <a className="btn btn-outline-light btn-sm">${item.topic_name}</a>
                </li>
            `
        })
        homeHtml = homeHtml.replace('{topic}', topicHtml)
        return homeHtml
    }

    static getFounder = (admins, homeHtml) =>{
        let adminHtml = '';
        admins.map((item)=>{
            adminHtml += `
               <div class="hstack gap-2">
                                    <!-- Avatar -->
               <div class="avatar">
                   <a href="#"> <img class="avatar-img rounded-circle" src="${item.avatar}" alt=""> </a>
               </div>
                                    <!-- Title -->
               <div class="overflow-hidden">
                   <a class="h6 mb-0" href="#!">${item.user_name}</a>
                   <p class="mb-0 small text-truncate">Founder</p>
               </div>
                                    <!-- Button -->
               </div>
            `
        })
        homeHtml = homeHtml.replace('{admin}', adminHtml)
        return homeHtml
    }


   static home = async (req, res) => {
        if(req.method === 'GET'){
            fs.readFile('./src/views/blog.html', 'utf-8', async (err, homeHtml) => {
                let posts = await guestService.getPublicPost()
                homeHtml = this.getHomeHtml(posts,homeHtml)
                let oldPosts = await guestService.getOldPublicPost();
                homeHtml = this.getLastPost(oldPosts,homeHtml)
                let topics = await topicService.findAllTopic();
                homeHtml = this.getTopic(topics,homeHtml)
                let admins = await adminService.getFounder();
                homeHtml = this.getFounder(admins,homeHtml)
                res.write(homeHtml);
                res.end();
            })
        }
    }


   static blogDetails =  (req, res) => {
        fs.readFile('./src/views/blog-details.html', 'utf-8', (err, loginHtml) => {
            res.write(loginHtml);
            res.end();

        })
    }
   static profileConnection = (req, res) => {
        fs.readFile('./src/views/my-profile-connections.html', 'utf-8', (err, loginHtml) => {
            res.write(loginHtml);
            res.end();

        })
    }
   static myProfile = (req, res) => {
        fs.readFile('./src/views/editPost.html', 'utf-8', (err, loginHtml) => {
            res.write(loginHtml);
            res.end();

        })
    }
   static offline = (req, res) => {
        fs.readFile('./src/views/offline.html', 'utf-8', (err, loginHtml) => {
            res.write(loginHtml);
            res.end();

        })
    }
   static signUp = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/sign-up-advance.html', 'utf-8', (err, signupHtml) => {
                res.write(signupHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let user = qs.parse(data);
                let account = await userService.createUser(user);
                res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(account[0]), {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7
                }));
                res.writeHead(301, { 'location': `./signin` });
                res.end()

            })
        }
    }


   static signIn = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/sign-in-advance.html', 'utf-8', (err, loginHtml) => {
                res.write(loginHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let user = qs.parse(data);
                let account = await guestService.getGuest(user);
                console.log(account)
                GuestController.currentUserId = account[0].id_user
                if (account.length === 0) {
                    res.writeHead(301, { 'location': '/' });
                    res.end()
                } else {
                    if (account[0].user_name === 'Cuong' && account[0].password === '123') {
                        res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(account[0]), {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7
                        }));
                        res.writeHead(301, { 'location': '/blogAdmin' });
                        res.end()
                    } else {
                        res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(account[0]), {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7
                        }));
                        res.writeHead(301, { 'location': `/blogUser/${account[0].id_user}` });

                        res.end()

                    }
                }
            })
        }
    }
    static blogUser = (req, res, id) => {
        fs.readFile('./src/views/blog_user.html', 'utf-8', (err, homeUserHtml) => {

            res.write(homeUserHtml);
            res.end();
        })
    }

}

module.exports = GuestController