const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api/**', {
        //target: "https://www.easy-mock.com/mock/5c6a7a8b5c189d024fa5ec57/eeasgu/",
        target: "http://localhost:8000/",
        changeOrigin: true,
    }))

}
