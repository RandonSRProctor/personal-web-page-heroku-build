const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendGrid = require('@sendgrid/mail');
const path = require('path');

require('dotenv').config()

const app = express();


//tells app to look for build folder that contains build of react app
app.use(express.static(path.join(__dirname, 'build')))


//points to index.html
app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/api', (req, res, next) => {
    res.send('API Status: Running')
});

app.post('/api/email', (req, res, next) => {
debugger
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to:'randyproctor@gmail.com',
        from: 'contact@randyproctor.net', 
        subject: `Website Contact from ${req.body.email}`,
        text: req.body.message
    }

    sendGrid.send(msg)
        .then(result => {
            res.status(200).json({
                success: true
            });
        })
        .catch(err => {

            console.log('error: ', err);
            res.status(401).json({
                success: false
            });

        });

});

//Tries heroku.  If null then goes to 3000
const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})
