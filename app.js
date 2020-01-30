var express = require('express')()
var app = express
var bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
var compression = require('compression')
var mysql = require('mysql')
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root@1234',
    database: 'adonis'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(morgan('common'))
app.use(compression())

//default route
app.get('/', (req,res) =>{
    return res.send({
        error: false,
        message: 'Hello World!'
    })
})

//retrieve all comments @ sembang
app.get('/sembang', (req, res) => {
    dbConn.query('SELECT * FROM sembang', 
        (error, results, fields) => {
            if (error) throw error;
            return res.send({ 
                error: false, 
                data: results,
                message: 'sembang * lists'
            })
        }
    )
})

//retrieve comments by slug
app.get('/sembang/:slug', (req,res) => {
    let slug = req.params.slug
    if(!slug){
        return res.status(400).send({
            error: true,
            message: 'Please provide post slug'
        })
    }
    dbConn.query('SELECT * FROM sembang where slug=?', 
        slug, 
        (error, results, fields) => {
            if (error) throw error
            return res.send({
                error: false,
                data: results,
                message: `sembang list for ${slug} post`
            })
        }
    )
})

//post comments to a post
app.post('/sembang', (req, res) => {
    let comment = req.body
    if(!comment){
        return res.status(400).send({
            error: true,
            message: 'Please provide comment body'
        })
    }
    dbConn.query('INSERT INTO sembang SET ?',
        comment,
        (error, results, fields) => {
            if (error) throw error
            return res.send({
                error: false,
                data: results,
                message: `new comment added to ${comment.slug}`
            })
        }
    )
})

//set port
app.listen(8585, () => {
    console.log('sembang app is running in on port 8585')
})

module.exports = app