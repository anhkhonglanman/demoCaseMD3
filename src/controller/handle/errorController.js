let serveFile = require('./../../../serveFile');



class ErrorController {
    showNotFound = () => {
        serveFile('./view/error-404.html','text/html',res)
        // fs.readFile('./view/error/notFound.html', 'utf-8', (err, notFoundHtml) => {
        //     res.write(notFoundHtml);
        //     res.end();
        // })
    }
}

module.exports = new ErrorController();