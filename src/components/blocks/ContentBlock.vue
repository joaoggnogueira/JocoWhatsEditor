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
          ref="output"
          data-index="0"
          @mousedown.stop
        ></div>
        saída
      </div>
    </div>
    <component
      :is="'c_' + c.type"
      v-for="(c, index) in block.content"
      :key="index"
      :content="c"
    />
  </div>
</template>
<script>
import ImageBlockPrewie from "./blocks_prewie/ImageBlockPrewie.vue";
import TextBlockPrewie from "./blocks_prewie/TextBlockPrewie.vue";
import DocBlockPrewie from "./blocks_prewie/DocBlockPrewie.vue";
import VideoBlockPrewie from "./blocks_prewie/VideoBlockPrewie.vue";
import AudioBlockPrewie from "./blocks_prewie/AudioBlockPrewie.vue";

export default {
  components: {
    c_image: ImageBlockPrewie,
    c_text: TextBlockPrewie,
    c_document: DocBlockPrewie,
    c_video: VideoBlockPrewie,
    c_audio: AudioBlockPrewie,
  },
  props: {
    block: Object,
  },
  mounted() {
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("create_block_interface", this.block, {
      get_input_endpoints: () => this.$refs.input,
      get_output_endpoints: () => [this.$refs.output],
    });
  },
};
</script>
