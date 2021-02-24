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
    var confSuccess, deploySuccess



    //----creation of networkConf file --------------------

    const python = spawn('python', ['pythonInterface.py']); // creates new python child process

     python.stdout.on('data', function (data) { // event trigger for data out buffer of PythonInterface
        console.log('Data returned from python interface');
        recievedData = data.toString();
    });

     python.on('close', (code) => { // event trigger for end of child process
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
    if(confSuccess){
        const python = spawn('python', ['deployNetwork.py']); // creates new python child process

         python.stdout.on('data', function (data) { // event trigger for data out buffer of deployNetwork
            console.log('Data returned from python interface');
            deploymentData = data.toString();
        });

         python.on('close', (code) => { // event trigger for end of child process
            if(code == '0') {
              console.log(`Network deployed, code: ${code}`)
            }
            else {
                console.log(`Network deployment failed, code: ${code}`);
            }
            console.log(recievedData) // use or delete!!
        });
    }


    //-----status
    if(confSuccess && deploySuccess){
        console.log('finished')
    }




})





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