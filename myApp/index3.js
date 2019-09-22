var express = require('express')
var app = express()
const port = 8080
//const bodyParser = require('body-parser')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/tahap1', (req, res) => {

    // res.send()
    console.log(req.body)
    res.json(req.body)

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))