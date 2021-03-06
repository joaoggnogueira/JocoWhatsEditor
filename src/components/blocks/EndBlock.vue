<template>
  <div class="content">
    <div class="row-between">
      <div class="input field">
        <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
        entrada
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    block: Object,
  },
  mounted() {
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("create_block_interface", this.block, {
      get_input_endpoints: () => this.$refs.input,
      get_output_endpoints: () => null,
    });
  },
};
</script>
