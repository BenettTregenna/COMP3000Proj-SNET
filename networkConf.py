from mininet.topo import Topo
class MyTopo( Topo ):
    def __init__( self ):
        Topo.__init__( self )
        HostOne = self.addHost( 'h1' )
        HostTwo = self.addHost( 'h2' )
        SwitchOne = self.addSwitch( 's3' )
        self.addLink( HostOne, SwitchOne )
        self.addLink( HostTwo, SwitchOne )
topos = { 'mytopo': ( lambda: MyTopo() ) }
