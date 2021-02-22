<template>
  <div class="logflow">
    <div class="log" v-for="message in messages" :key="message.id">
      {{ message.text }}
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    messages: [],
  }),
  mounted() {
    this.$eventBus.on("log", this.log);
  },
  methods: {
    log(message) {
      this.messages.push({ text: message, id: this.$uuid.v1() });
      setTimeout(() => {
        this.messages.pop();
      }, 10000);
    },
  },
};
</script>
<style lang="scss" scoped>
.logflow {
  position: absolute;
  bottom: 0px;
  right: 0px;
  .log {
    background: white;
    padding: 8px;
    margin: 8px;
    min-width: 300px;
    min-height: 30px;
    line-height: 30px;
  }
}
</style>
