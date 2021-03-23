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

const linkTypes = [];
linkTypes.push( new currentTopo.linkProperties("cat5", "100Mbps", "100Mhz"));
linkTypes.push( new currentTopo.linkProperties("cat5e", "1Gbps", "100Mhz"));
linkTypes.push( new currentTopo.linkProperties("cat6", "1Gbps", "250Mhz"));
linkTypes.push( new currentTopo.linkProperties("cat6a", "10Gbps", "500Mhz"));


app.listen(3000, () =>console.log('Server Listening at 3000')); // express listening for requests on port 3000
app.use(express.static('views'));
app.use(express.json({limit:'1mb'}));
app.use('/resources', express.static('resources'));





// ------------------------------    functions -----------------------

function getNodeId(hostname) {
    let foundId = 0;
    let nodes = currentTopology.getHosts();
    let switches = currentTopology.getSwitches();
    let routers = currentTopology.getRouters();
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
    return foundId;

}

function getLinkId(source, destination){
    let foundId = 0
    let links = currentTopology.getLinks();
    links.forEach(function(link){
        if((link.source === source) && (link.destination === destination)){
            foundId = link.id
        }
    });
    return foundId;
}

function generateVisTables(type){
        if(type == 'nodes'){
            let nodeArray = [];
            let hosts = currentTopology.getHosts();
            let dir = '../resources/'
            hosts.forEach(function(item){
                nodeArray.push({ id: item.id, label: item.hostname, color: 'grey' , image: dir+ 'Host.png', shape: 'image', size: 30 });
            });
            // add switches
            let switches = currentTopology.getSwitches();
            switches.forEach(function(item){
                nodeArray.push({ id: item.id, label: item.hostname, color: 'green' ,image: dir+ 'Switch.png', shape: 'image', size: 30});
            });
            // add routers
            let routers = currentTopology.getRouters();
            routers.forEach(function(item){
               nodeArray.push({ id: item.id, label: item.hostname, color: 'blue' , image: dir+ 'Router.png', shape: 'image', size: 30});
            });
            console.log('NodeArray(client):');
            console.log(nodeArray);
            return nodeArray;

        }else {
            let edgeArray = [];

            let links = currentTopology.getLinks();
            links.forEach(function(item) {
                edgeArray.push({id: item.id, from: item.sourceId, to: item.destinationId, color : 'black'});
            });
            console.log(edgeArray);
            return edgeArray;
        }
}

function assignId(type){
    let idArray = []
    let gapId = 0;
    let newId
    let itemCount

    switch(type){
        case 'host':
            itemCount = 101;
            let currentHosts = currentTopology.getHosts();
            currentHosts.forEach(function(host){
                idArray.push(host.id)
            });
            break;
        case 'switch':
            itemCount = 201;
            let currentSwitches = currentTopology.getSwitches();
            currentSwitches.forEach(function(sw){
                idArray.push(sw.id)
            });
            break;
        case 'router':
            itemCount = 301;
            let currentRouters = currentTopology.getRouters();
            currentRouters.forEach(function(router){
                idArray.push(router.id)
            });
            break;
        case 'link':
            itemCount = 401;
            let currentLinks = currentTopology.getLinks();
            currentLinks.forEach(function(link){
                idArray.push(link.id)
            });
            break;
    }
    //sort array ascending
    idArray.sort(function(a, b){return a - b});

    // main algorithm to detect next id factoring in gaps
    idArray.forEach(function(i){
        if(i != itemCount) {
            if(gapId == 0){
                gapId = itemCount
            }
        }else{
            while(itemCount < i){
                itemCount++
            }
        }
        itemCount++
    })
    if(gapId != 0){
        newId = gapId; // if gap was found
    }else {
        newId = itemCount; // if no gap was found
    }
    return newId
}

function removeRedundantLinks(id){
    console.log('Remove Redundant Links --');
    for( let i = 0; i < (currentTopology.links.length);){
            console.log('----------------')
            console.log(currentTopology.links[i].sourceId +' > '+ currentTopology.links[i].destinationId)
            if ((currentTopology.links[i].sourceId === id )||(currentTopology.links[i].destinationId === id )) {
                console.log('--spliced');
                currentTopology.links.splice(i, 1);
            }else{
                i++
            }
    }
}

function updateLinks(id, newHostname){
    console.log('Update Links --');
    for( let i = 0; i < (currentTopology.links.length);i++){
            console.log('----------------')
            console.log(currentTopology.links[i].sourceId +' > '+ currentTopology.links[i].destinationId)
            if ((currentTopology.links[i].sourceId === id )&&(currentTopology.links[i].source !== newHostname)){
                currentTopology.links[i].source = newHostname;
                console.log('Source Edited');
            }else if ((currentTopology.links[i].destinationId === id )&&(currentTopology.links[i].destination !== newHostname)){
                currentTopology.links[i].destination = newHostname;
                console.log('Destination Edited');
            }
    }
}




// add functions
function addHost(data){
    let newHost = new entity_host(assignId('host'), data.hostname );
    currentTopology.addHost(newHost);
    return ('Host: "'+ data.hostname +'"'+ ' Added')
}

function addSwitch(data){
    let newSwitch = new entity_switch(assignId('switch'), data.hostname);
    currentTopology.addSwitch(newSwitch);
    return ('Switch: "'+ data.hostname +'"'+ ' Added')
}

function addRouter(data){
    let newRouter = new entity_router(assignId('router'), data.hostname);
    currentTopology.addRouter(newRouter);
    return ('Router: "'+ data.hostname +'"'+ ' Added')
}

function addLink(data){
    let newLink = new entity_link(assignId('link'), data.linkType, data.source, getNodeId(data.source), data.destination, getNodeId(data.destination));
    currentTopology.addLink(newLink);
    return ('Link: "'+ data.source +' > '+ data.destination+ '"' + ' Added')
}


// delete functions
function delNode(data, type){
    let nodeId = getNodeId(data.hostname);// if return 0 no node found
    console.log('redundant links issue');
    console.log('search :'+ nodeId);
    removeRedundantLinks(nodeId);
    console.log('');
    console.log('/redundant links');
    switch(type){
        case 'host':
            currentTopology.removeHost(nodeId)
            return ('Host: "'+ data.hostname +'"'+ ' Removed')
        case 'switch':
            currentTopology.removeSwitch(nodeId)
            return ('Switch: "'+ data.hostname +'"'+ ' Removed')
        case 'router':
            currentTopology.removeRouter(nodeId)
            return ('Router: "'+ data.hostname +'"'+ ' Removed')
    }
}

function delLink(data){
    let linkId = getLinkId(data.source, data.destination);
    console.log('search :  '+ linkId);
    currentTopology.removeLink(linkId);
    return ('Link: "'+ data.source +' > '+ data.destination+ '"' + ' Removed')
}


//edit functions
function editNode(newData, type){
    let nodeId = parseInt(newData.id, 10);
    switch(type){
        case 'host':
            let newHost = new entity_host(nodeId, newData.hostname);
            console.log(newHost);
            currentTopology.editHost(nodeId, newHost);
            updateLinks(nodeId, newData.hostname);
            return ('Host: "'+ newData.hostname +'"'+ ' Successfully Edited')
        case 'switch':
            let newSwitch = new entity_switch(nodeId, newData.hostname);
            currentTopology.editSwitch(nodeId, newSwitch);
            updateLinks(nodeId, newData.hostname);
            return ('Switch: "'+ newData.hostname +'"'+ ' Successfully Edited')
        case 'router':
            let newRouter = new entity_router(nodeId, newData.hostname);
            currentTopology.editRouter(nodeId, newRouter);
            updateLinks(nodeId, newData.hostname);
            return ('Router: "'+ newData.hostname +'"'+ ' Successfully Edited')
    }
}

function editLink(newData){
    let linkId = parseInt(newData.id, 10);
    let newLink = new entity_link(linkId,newData.linkType,newData.source,getNodeId(newData.source),newData.destination,getNodeId(newData.destination));
    currentTopology.editLink(linkId, newLink);
    return ('Link: " '+ newData.source +' > '+ newData.destination +' "'+ ' Successfully Edited')

}



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

app.get('/getLinkTypes',function(req,res){
    console.log('request recieved getLinkTypes');
    res.json({
                status: '200',
                linkTypes: linkTypes
    })
});

// ----------------  POST   -----------

app.post('/getItemInfo', (request, response) => {
    const data = request.body;
    console.log('-received request getItemInfo, request: ' + data.id);
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
        if (item.id === data.id) {
            response.json({
                itemDetails: item
            });
        }
        console.log('---- checked host:'+ item.id);
    })
});

app.post('/changeNetConf', (request, response) =>{
    const data = request.body;
    console.log('post request received "changeNetConf" ; request type: '+ data.request);

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
        case 'delHost':
            statusDescription = delNode(data, 'host');
            break;
        case 'delSwitch':
            statusDescription = delNode(data, 'switch');
            break;
        case 'delRouter':
            statusDescription = delNode(data, 'router');
            break;
        case 'delLink':
            statusDescription = delLink(data);
            break;
        case 'editHost':
            statusDescription = editNode(data,'host');
            break;
        case 'editSwitch':
            statusDescription = editNode(data,'switch');
            break;
        case 'editRouter':
            statusDescription = editNode(data,'router');
            break;
        case 'editLink':
            statusDescription = editLink(data);
            break;
    }
    console.log('currentTopology:')
    console.log(currentTopology)
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


