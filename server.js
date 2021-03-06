const express = require('express');
const {spawn} = require('child_process');
const {DataSet} = require("vis-data");



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


//functions-----

function getNodeId(hostname) {
    let foundId = 0;
    let nodes = currentTopology.getHosts();
    let switches = currentTopology.getSwitches();
    let routers = currentTopology.getRouters();
    console.log('GETNODEID ------------------------------');
    console.log(nodes);
    nodes.forEach(function (item) {
        if (item.hostname == hostname) {
            foundId = item.id
        }
    });
    switches.forEach(function (item) {
        if (item.hostname == hostname) {
            foundId = item.id
        }
    });
    routers.forEach(function (item) {
        if (item.hostname == hostname) {
            foundId = item.id
        }
    });

    console.log(foundId);
    return foundId;

}

function generateVisTables(type){
        if(type == 'nodes'){
            let nodeArray = [];
            let hosts = currentTopology.getHosts();
            console.log(hosts);
            hosts.forEach(function(item){
                nodeArray.push({ id: item.id, label: item.hostname, color: 'grey' , shape: 'square'});
            });
            // add switches
            let switches = currentTopology.getSwitches();
            switches.forEach(function(item){
                nodeArray.push({ id: item.id, label: item.hostname, color: 'green' , shape: 'square'});
            });
            // add routers
            let routers = currentTopology.getRouters();
            routers.forEach(function(item){
               nodeArray.push({ id: item.id, label: item.hostname, color: 'blue' , shape: 'square'});
            });
            console.log(nodeArray);
            return nodeArray;

        }else {
            let edgeArray = [];

            let links = currentTopology.getLinks();
            links.forEach(function(item) {
                edgeArray.push({from: item.sourceId, to: item.destinationId, color : 'black'});
            });
            console.log(edgeArray);
            return edgeArray;
        }
}

function addHost(data){
    let hostCount = 0;
    let currentHosts = currentTopology.getHosts();
    currentHosts.forEach(function(){
        hostCount++
    })
    let newHost = new entity_host(data.hostname, (101 + hostCount));
    currentTopology.addHost(newHost);
    let statusDescription = 'Host: "'+ data.hostname +'"'+ ' Added';
    return statusDescription
}

function addSwitch(data){
    let switchCount = 0;
    let currentSwitches = currentTopology.getSwitches();
    currentSwitches.forEach(function(){
        switchCount++
    })
    let newSwitch = new entity_switch(data.hostname, (201 + switchCount));
    currentTopology.addSwitch(newSwitch);
}

function addRouter(data){
    let routerCount = 0;
    let currentRouters = currentTopology.getRouters();
    currentRouters.forEach(function(){
        routerCount++
    })
    let newRouter = new entity_router(data.hostname, (301 + routerCount));
    currentTopology.addRouter(newRouter);

}

function addLink(data){
    let newLink = new entity_link(data.source, getNodeId(data.source), data.destination, getNodeId(data.destination));
    currentTopology.addLink(newLink);
}

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
    res.render('pages/network');
});

app.get('/getNetConf',function(req,res){
    res.json({
                status: '200',
                runningNodes: generateVisTables('nodes'),
                runningEdges: generateVisTables('edges')
    })
});


// ----------------  POST   -----------

app.post('/getItemInfo', (request, response) => {
    const data = request.body;
    console.log('recieved request getItemInfo, request: ' + data.id);
    let stringId = data.id.toString();
    let itemArray = [];
    switch(stringId.charAt(0)){
        case '1':
            itemArray = currentTopology.getHosts();
            break;
        case '2':
            itemArray = currentTopology.getSwitches();
            break;
        case '3':
            itemArray = currentTopology.getRouters();
            break;
        case '4':
            itemArray = currentTopology.getLinks();
            break;
    }
    itemArray.forEach(function (item) {
        if (item.id == data.id) {
            response.json({
                itemDetails: item
            });
        }
        console.log('checked host:'+ item.id);
    })
});



app.post('/changeNetConf', (request, response) =>{
    const data = request.body;
    console.log('post request recieved "changeNetConf" ; request type: '+ data.request);

    // save changes made
    let statusDescription = '';
    switch (data.request) {
        case 'addHost':
            statusDescription = addHost(data);
            break;
        case 'addSwitch':
            statusDescription = addSwitch(data);
            break;
        case 'addRouter':
            statusDescription = addRouter(data);
            break;
        case 'addLink':
            statusDescription = addLink(data);
            break;
    }

    response.json({
                status: '200',
                statusDescription: statusDescription,
                runningNodes: generateVisTables('nodes'),
                runningEdges: generateVisTables('edges')
    })
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


