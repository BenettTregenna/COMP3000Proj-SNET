const express = require('express');
const { spawn } = require('child_process');

const fetch = require('node-fetch');
const app = express(); // express setup
app.set('view engine', 'ejs');




//testing python coms
app.get('/', (req, res) => {

    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['mininet.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        console.log(dataToSend);
    });

})
app.listen(3000, () => console.log(`Example app listening on port 
3000!`))

//app.listen(3000, () =>console.log('Server Listening at 3000')); // express listening for requests on port 3000
app.use(express.static('views'));
app.use(express.json({limit:'1mb'}));




app.get('/index',function(req,res){
    res.render('pages/index');
});


app.get('/network',function(req,res){
    res.render('pages/network');
});

app.post('/testComs', (request, responce) =>{
    console.log('post request recieved: testcoms');
    console.log(request.body);
    const data = request.body;
    responce.json({
        status: 'success!',
        testresult: data.message
    });
})