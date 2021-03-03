const express = require('express');
const {spawn} = require('child_process');

const fetch = require('node-fetch');
const app = express(); // express setup
app.set('view engine', 'ejs');

const currentTopo = require('./currentTopology');
let currentTopology = new currentTopo.currentTopology();
const entity_host = currentTopo.entity_host;
const entity_switch = currentTopo.entity_switch;
const entity_router = currentTopo.entity_router;
const entity_link = currentTopo.entity_link;


app.listen(3000, () =>console.log('Server Listening at 3000')); // express listening for requests on port 3000
app.use(express.static('views'));
app.use(express.json({limit:'1mb'}));

//testing python coms

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

app.get('/login',function(req,res) {
    const currentTopology = new currentTopology();
});

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
    switch (data.request) {
        case 'addHost':
            let newHost = new entity_host(data.hostname);
            currentTopology.addHost(newHost);
            //response
            console.log(currentTopology);
            responce.json({
                status: '200',
                statusDescription: 'Host: "'+ data.hostname +'"'+ ' Added',
                deviceName: 'H-'+ data.hostname,
                runningTopo: currentTopology
            })
            break;
        case 'addSwitch':
            let newSwitch = new entity_switch(data.hostname);
            currentTopology.addSwitch(newSwitch);
            //response
            console.log(currentTopology);
            responce.json({
                status: '200',
                statusDescription: 'Switch: "'+ data.hostname +'"'+ ' Added',
                deviceName: 'S-'+ data.hostname,
                runningTopo: currentTopology
            })
            break;
        case 'addRouter':
            let newRouter = new entity_router(data.hostname);
            currentTopology.addRouter(newRouter);
            //response
            console.log(currentTopology);
            responce.json({
                status: '200',
                statusDescription: 'Router: "'+ data.hostname +'"'+ ' Added',
                deviceName: 'R-'+ data.hostname,
                runningTopo: currentTopology
            })
            break;
    }
});

app.get('/deploy', (req, res) => {
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


