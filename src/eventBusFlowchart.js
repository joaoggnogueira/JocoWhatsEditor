export default class EventBus {
    constructor() {
        this.fns = {};
    }
    on(id, fn) {
        this.fns[id] = fn;
    }
    emit(id, ...params) {
        if(!this.fns[id]){
            throw new Error("EventBus: Função "+id+" não existe amigo");
        }
        this.fns[id](...params);
    }
}