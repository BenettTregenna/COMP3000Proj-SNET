
class entity_host {
    constructor(id, hostname) {
        this.id = id;
        this.hostname = hostname;
        //add additional attributes
    }
    getId(){
        return this.id
    }
}
class entity_switch {
    constructor(id, hostname) {
        this.id = id;
        this.hostname = hostname;
        //add additional attributes
    }
    getId(){
        return this.id
    }
}
class entity_router {
    constructor(id, hostname) {
        this.id = id;
        this.hostname = hostname;
        // add additional attributes
    }
    getId(){
        return this.id
    }
}
class entity_link {
    constructor(id, linkType, source, sourceId, destination, destinationId) {
        this.id = id;
        this.linkType = linkType;
        this.source = source;
        this.sourceId = sourceId
        this.destination = destination;
        this.destinationId = destinationId;
        // add additional attributes
    }
}
class linkProperties {
    constructor(cableType, speed, bandwidth) {
        this.cableType = cableType;
        this.speed = speed;
        this.bandwidth = bandwidth;
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
    editHost(id, newHost){
        for( let i = 0; i < this.hosts.length; i++){
            if ( this.hosts[i].id == id ) {
                this.hosts[i] = newHost
            }
        }
    }
    removeHost(id){
        for( let i = 0; i < this.hosts.length; i++){
            if ( this.hosts[i].id == id ) {
                this.hosts.splice(i, 1);
            }
        }
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
    editSwitch(id, newSwitch){
        for( let i = 0; i < this.switches.length; i++){
            if ( this.switches[i].id == id ) {
                this.switches[i] = newSwitch
            }
        }
    }
    removeSwitch(id){
        for( let i = 0; i < this.switches.length; i++){
            if ( this.switches[i].id == id ) {
                this.switches.splice(i, 1);
            }
        }
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
    editRouter(id, newRouter){
        for( let i = 0; i < this.routers.length; i++){
            if ( this.routers[i].id == id ) {
                this.routers[i] = newRouter
            }
        }
    }
    removeRouter(id){
        for( let i = 0; i < this.routers.length; i++){
            if ( this.routers[i].id == id ) {
                this.routers.splice(i, 1);
            }
        }
    }

     //                   --  Links  --
    getLinks(){
        return this.links;
    }
    setLinks(links){
        this.links = links;
    }
    // individual
    addLink(newLink){
        this.links.push(newLink);
    }
    editLink(id, newLink){
        for( let i = 0; i < this.links.length; i++){
            if ( this.links[i].id == id ) {
                this.links[i] = newLink
            }
        }
    }
    removeLink(id){
        for( let i = 0; i < this.links.length; i++){
            if ( this.links[i].id == id ) {
                this.links.splice(i, 1);
            }
        }
    }
}

module.exports = {
    currentTopology: currentTopology,
    entity_link: entity_link,
    linkProperties: linkProperties,
    entity_router: entity_router,
    entity_switch: entity_switch,
    entity_host: entity_host
};
