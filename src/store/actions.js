
export default {
    loadAndReadyToFlowchart(context) {
        return new Promise((res) => {
            context.commit("load");
            context.commit("readyToFlowchart");
            res(true);
        });
    },
}