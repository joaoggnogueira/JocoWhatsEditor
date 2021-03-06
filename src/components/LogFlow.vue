<template>
  <div class="logflow">
    <div
      class="log"
      :class="{ show: message.show }"
      v-for="message in messages"
      :key="message.id"
    >
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
      const obj = { text: message, id: this.$uuid.v1(), show: false };
      this.messages.push(obj);
      setTimeout(() => {
        obj.show = true;
      }, 200);
      setTimeout(() => {
        obj.show = false;
      }, 9800);
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
    transition: max-height 0.2s ease-out, min-height 0.2s ease-out;
    overflow: hidden;
    border-radius: 8px;
    &.show {
      min-height: 50px;
      max-height: 50px;
    }
    background: white;
    margin: 16px;
    margin-top: 0px;
    min-width: 300px;
    min-height: 0px;
    max-height: 0px;
    line-height: 50px;
  }
}
</style>
