export default class EventBus {
    constructor() {
        this.fns = {};
    }
    on(id, fn) {
        if (!fn) {
            throw new Error("EventBus: Fn de " + id + " não pode ser falso");
        }
        this.fns[id] = fn;
    }
    emit(id, ...params) {
        if (!this.fns[id]) {
            console.log(this.fns);
            throw new Error("EventBus: Função " + id + " não existe amigo");
        }
        this.fns[id](...params);
    }
}