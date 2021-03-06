<template>
    <div class="content">
      <div class="row-between">
        <div class="input field">
          <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
          entrada
        </div>
      </div>
      <span v-if="!block.outputs.length" class='error-span'>Sem saída</span>
      <div v-else class="row-between" v-for="(output, index) in block.outputs" :key="index" :index="index">
        <div class="flex-filler"></div>
        <div class="output field">
          <div class="dot endpoint-source" ref="outputs" :data-index="index" @mousedown.stop></div>
          {{ output.name }}
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
      get_output_endpoints: () => this.$refs.outputs,
    });
  },
};
</script>
