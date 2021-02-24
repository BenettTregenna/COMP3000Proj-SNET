import sys

# creation of network config python script
confFile = open("networkConf.py", "w")

#header

confFile.write("from mininet.topo import Topo\n")
confFile.write("class MyTopo( Topo ):\n")
confFile.write("    def __init__( self ):\n") #custom topology creation
confFile.write("        Topo.__init__( self )\n")# initialise

#------------ Add hosts --------------------
confFile.write("        HostOne = self.addHost( 'h1' )\n")
confFile.write("        HostTwo = self.addHost( 'h2' )\n")


#------------ Add_Switches ----------------
confFile.write("        SwitchOne = self.addSwitch( 's3' )\n")

#------------ Add_routers -----------------


#------------ Add-Links -------------------
confFile.write("        self.addLink( HostOne, SwitchOne )\n")
confFile.write("        self.addLink( HostTwo, SwitchOne )\n")

#----------- RUN TOPO ---------------------

confFile.write("topos = { 'mytopo': ( lambda: MyTopo() ) }\n")

confFile.close()


#responce
print("pythonIF: Conf file created ...")



