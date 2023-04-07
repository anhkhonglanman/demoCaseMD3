//! import modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const router = require('./src/controller/router');
const PORT = process.env.PORT || 3700;
let serveFile = require('./serveFile');

//! tạo 1 service
const server = http.createServer((req, res) => {

    let url = req.url;
    const extension = path.extname(url); //! ext của file trên url
    let contentType;
    //! xét extname của url request để set contentType
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default: //! default: just / or .html
            contentType = 'text/html';
    }
    //! định nghĩa đường dẫn từ các điều kiện ở trên khi đã có contentType
    let filePath;
    if(contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'src', 'views', 'blog.html');
    } else if(contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath =path.join(__dirname, 'src', 'views', req.url, 'blog.html')
    } else if(contentType === 'text/html') {
        filePath =path.join(__dirname, 'src', 'views', req.url)
        // console.log(filePath)
    } else if (contentType !== 'text/html'){ // dinh nghia neu duoi duong dan khong phai html
        let urlFake  = req.url.slice(req.url.indexOf('assets'),req.url.length)
        filePath = path.join(__dirname, 'src', 'views',urlFake);
    }

    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';
    //! Làm function đọc các file HTML và để xử lý với router

    if (contentType === 'text/html' && contentType !== 'application/octet-stream') {
        let arrPath = url.split('/');
        let stress = '';
        let chosenHandle =router[stress] || undefined;
        let id = -1; //! xu ly truong hop nhap id vao url
        if (arrPath.length > 2) {
            stress = arrPath[1];
            id = arrPath[2]
        }
        if (arrPath.length <= 2) {
            stress = arrPath[1]
        }
        if(stress.includes('.html')) {
            stress= stress.slice(0, -5);
        }
        if (router[stress] !== undefined) {
            chosenHandle = router[stress];
        }
        console.log(arrPath)
        console.log(id)
        chosenHandle(req, res, id);
    } else {//! XỬ LÝ CSS VÀ ẢNH CÁC THỨ
        // ! makes .html extension not required in the browser( nếu không có extname và last char # '/' => làm .html kp yêu cầu trong browser)
        //! có được filePath và contentType
        //! kiểm tra xem đường dẫn đã cho có tồn tại hay không


        const fileExists = fs.existsSync(filePath);
        if (fileExists) { //! nếu tồn tại, xu li cac file khac ngoai html
            //! serve the file
            serveFile(filePath, contentType, res);
        } else { //! nếu không
            switch (path.parse(filePath).base) {
                case 'old-page.html':
                    res.writeHead(301, { 'Location': '/' });
                    res.end();
                    break;
                case 'www-page.html':
                    res.writeHead(301, { 'Location': '/' });//! home page
                    res.end();
                    break;
                default:
                    serveFile(path.join(__dirname, 'src', 'views', 'error-404.html'), 'text/html', res);
            }
        }
    }
});

//! service listening on port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
