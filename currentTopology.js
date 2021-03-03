
class entity_host {
    constructor(hostname) {
        this.hostname = hostname;
        //add additional attributes
    }
}
class entity_switch {
    constructor(hostname) {
        this.hostname = hostname;
        //add additional attributes
    }
}
class entity_router {
    constructor(hostname) {
        this.hostname = hostname;
        // add additional attributes
    }
}
class entity_link {
    constructor(source,destination) {
        this.source = source;
        this.destination = destination;
        // add additional attributes
    }
}

class currentTopology {
    constructor() {
        this.hosts = [];
        this.switches = [];
        this.routers = [];
        this.links = [];
    };

    //                   --  HOSTS  --
    getHosts(){
        return this.hosts;
    }
    setHosts(hosts){
        this.hosts = hosts;
    }
    // individual
    addHost(newHost){
        this.hosts.push(newHost);
    }
    removeHost(index){
        this.hosts.splice(index,1);
    }

     //                   --  SWITCHES  --
    getSwitches(){
        return this.switches;
    }
    setSwitches(switches){
        this.switches = switches;
    }
    // individual
    addSwitch(newSwitch){
        this.switches.push(newSwitch);
    }
    removeSwitch(index){
        this.switches.splice(index,1);
    }

     //                   --  ROUTERS  --
    getRouters(){
        return this.routers;
    }
    setRouters(routers){
        this.routers = routers;
    }
    // individual
    addRouter(newRouter){
        this.routers.push(newRouter);
    }
    removeRouter(index){
        this.routers.splice(index,1);
    }

     //                   --  Links  --
    getLinks(){
        return this.links;
    }
    setLinks(links){
        this.links = links;
    }
    // individual
    addlink(newLink){
        this.links.push(newLink);
    }
    removeLink(index){
        this.links.splice(index,1);
    }



}

module.exports = {
    currentTopology: currentTopology,
    entity_link: entity_link,
    entity_router: entity_router,
    entity_switch: entity_switch,
    entity_host: entity_host
};
