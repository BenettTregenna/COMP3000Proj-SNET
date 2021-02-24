from pythonInterface.topo import SingleSwitchTopo
from pythonInterface.net import Mininet
from pythonInterface.cli import CLI

net = Mininet(SingleSwitchTopo(2))
net.start()
CLI(net)
net.stop()