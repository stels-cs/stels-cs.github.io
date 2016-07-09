var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get("/filter", function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get("/group", function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get("/static/bundle.js", function(req, res) {
    res.sendFile(__dirname + '/static/bundle.js')
})

app.get("/Semantic-UI/semantic.min.css", function(req, res) {
    res.sendFile(__dirname + '/Semantic-UI/semantic.min.css')
})

app.get("*", function(req, res) {
    res.sendFile(__dirname + req.url)
})




app.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
})
