<template>
  <div class="content">
    <div class="row-between">
      <div class="input field">
        <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
        entrada
      </div>
      <div class="output field">
        <div
          class="dot endpoint-source"
          ref="outputA"
          data-index="0"
          @mousedown.stop
        ></div>
        Sucesso
      </div>
    </div>
    <div class="row-between">
      <div class="flex-filler"></div>
      <div class="output field">
        <div
          class="dot endpoint-source"
          ref="outputB"
          data-index="1"
          @mousedown.stop
        ></div>
        Falha
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
      get_output_endpoints: () => [this.$refs.outputA, this.$refs.outputB],
    });
  },
};
</script>
