const express = require('express');
const {spawn} = require('child_process');

const fetch = require('node-fetch');
const app = express(); // express setup
app.set('view engine', 'ejs');


app.listen(3000, () =>console.log('Server Listening at 3000')); // express listening for requests on port 3000
app.use(express.static('views'));
app.use(express.json({limit:'1mb'}));

//testing python coms
app.get('/pytest', (req, res) => {
    // vars
    var recievedData, deploymentData
    var confSuccess = false, deploySuccess = false



    //----creation of networkConf file --------------------

    const runPythonInt = spawn('python', ['pythonInterface.py']); // creates new python child process

     runPythonInt.stdout.on('data', function (data) { // event trigger for data out buffer of PythonInterface
        console.log('Data returned from python interface');
        recievedData = data.toString();
    });

     runPythonInt.on('close', (code) => { // event trigger for end of child process
        if(code == '0') {
          confSuccess = true
          console.log(`NetworkConf File Created, code: ${code}`)
        }
        else {
            confSuccess = false
            console.log(`NetworkConf creation failed, code: ${code}`);

        }
        console.log(recievedData) // use or delete!!
    });


    //----deploment of networkConf file ---

    const runNetworkConf = spawn('python', ['deployNetwork.py']); // creates new python child process

    runNetworkConf.stdout.on('data', function (data) { // event trigger for data out buffer of deployNetwork
       console.log('Data returned from python interface');
       deploymentData = data.toString();
    });

    runNetworkConf.on('close', (code) => { // event trigger for end of child process
        if(code == '0') {
            console.log(`Network deployed, code: ${code}`)
        }
        else {
            console.log(`Network deployment failed, code: ${code}`);
        }
        console.log(deploymentData) // use or delete!!
    });


    //-----status
    if(confSuccess && deploySuccess){
        console.log('finished')
    }



})
// //----------------DUMBLY DONE BIT ______ REDO-------------------------------------------------------
// app.get('/app.js',function(req,res) {
//     res.sendFile('C:/Users/Ben/PycharmProjects/COMP3000Proj-SNET/app.js');
// });
//
// app.get('/data.js',function(req,res) {
//     res.sendFile('C:/Users/Ben/PycharmProjects/COMP3000Proj-SNET/data.js');
// });
//
// app.get('/next.css',function(req,res) {
//     res.sendFile('C:/Users/Ben/PycharmProjects/COMP3000Proj-SNET/node_modules/next-ui/css/next.css');
// });
//
// app.get('/next.js',function(req,res) {
//     res.sendFile('C:/Users/Ben/PycharmProjects/COMP3000Proj-SNET/node_modules/next-ui/js/next.js');
// });


//---------------------------



app.get('/index',function(req,res){
    res.render('pages/index');
});
app.get('', function(req,res){
    res.render('pages/index');
});
app.get('/', function(req,res){
    res.render('pages/index');
});

app.get('/network',function(req,res){
    res.render('pages/network', {

    });
});

app.post('/changeNetConf', (request, responce) =>{
    const data = request.body;
    console.log('post request recieved "changeNetConf" ; request type: '+ data.request);

    // save changes made

    if(true){ // if changes saved successfully
        switch (data.request) {
            case 'addHost':
                responce.json({
                    status: '200',
                    statusDescription: 'Host: "'+ data.hostname +'"'+ ' Added'
                })
                break;
            case 'addSwitch':
                responce.json({
                    status: '200',
                    statusDescription: 'Switch: "'+ data.hostname +'"'+ ' Added'
                })
                break;
            case 'addRouter':
                responce.json({
                    status: '200',
                    statusDescription: 'Router: "'+ data.hostname +'"'+ ' Added'
                })
                break;
        }

    }



});


