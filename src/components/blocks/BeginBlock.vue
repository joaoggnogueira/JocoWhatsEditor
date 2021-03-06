<template>
  <div class="content">
    <div class="row-between">
      <div class="flex-filler"></div>
      <div class="output field">
        <div class="dot endpoint-source" ref="output" data-index="0" @mousedown.stop></div>
        saída
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
      get_input_endpoints: () => null,
      get_output_endpoints: () => [this.$refs.output],
    });
  },
};
</script>
