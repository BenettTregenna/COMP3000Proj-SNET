var mininet = require ('mininet')

var mn = mininet()

var s1 = mn.createSwitch()

var h1 = mn.createHost()
var h2 = mn.createHost()


h1.link(s1)
h2.link(s1)

mn.start()

var proc = h1.spawn('node server.js')

proc.on('message:listening', function () {
  // when h1 signals it is listening, run curl
  var proc2 = h2.spawn('curl --silent ' + h1.ip + ':10000')

  proc2.on('stdout', function (data) {
    process.stdout.write('h2 ' + data)
    mn.stop() // stop when h2 messages
  })
})

proc.on('stdout', function (data) {
  process.stdout.write('h1 ' + data)
})

//net = Mininet(controller=RemoteController, switch=OVSKernelSwitch)
 //   c1 = net.addController('c1', controller=RemoteController,
//ip="192.168.1.100", port=6653)

net = Mininet(controller = RemoteController, switch=OVSKernelSwitch)