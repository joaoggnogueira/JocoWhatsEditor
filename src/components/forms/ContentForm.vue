<template>
  <div class="form-control">
    <div class="header">
      <font-awesome-icon icon="times" @click="$emit('onClose')" />
      <div class="title">Edição de Mensagem</div>
      <div class="flex-filler"></div>
      <div class="btn" @click="removeBlock">Excluir bloco</div>
    </div>
    <div class="content">
      <div class="row-center">
        <div class="btn-add-content" v-tooltip="'Novo Texto'" @click="addText">
          <font-awesome-icon icon="comment-alt" />
        </div>
        <div class="btn-add-content" v-tooltip="'Novo Imagem'" @click="addImage">
          <font-awesome-icon icon="image" />
        </div>
        <div class="btn-add-content" v-tooltip="'Novo Documento'" @click="addDoc">
          <font-awesome-icon icon="file-alt" />
        </div>
        <div class="btn-add-content" v-tooltip="'Novo Áudio'" @click="addAudio">
          <font-awesome-icon icon="volume-up" />
        </div>
        <div class="btn-add-content" v-tooltip="'Novo Vídeo'" @click="addVideo">
          <font-awesome-icon icon="video" />
        </div>
      </div>
      <draggable
        v-model="block.content"
        group="contents"
        @start="drag = true"
        @end="drag = false"
      >
        <component
          :is="'c_' + c.type"
          :content="c"
          v-for="(c,index) in block.content"
          :key="index"
          @remove="removeContent"
        ></component>
      </draggable>
      <div class="label">Fallbacks</div>
      <div class="form-fallback">
        <MultipleTextEditor :texts="block.fallback" />
      </div>
      <div class="form-fallback">
        <EventAnalyticsForm :analytics="block.analytics" />
      </div>
    </div>
  </div>
</template>
<script>
import AudioForm from "./forms_fields/AudioForm.vue";
import DocForm from "./forms_fields/DocForm.vue";
import ImageForm from "./forms_fields/ImageForm.vue";
import TextForm from "./forms_fields/TextForm.vue";
import VideoForm from "./forms_fields/VideoForm.vue";
import EventAnalyticsForm from "./EventAnalyticsForm.vue";
import MultipleTextEditor from "@/components/MultipleTextEditor.vue";
import draggable from "vuedraggable";

export default {
  props: {
    block: Object,
  },
  components: {
    c_audio: AudioForm,
    c_document: DocForm,
    c_image: ImageForm,
    c_text: TextForm,
    c_video: VideoForm,
    MultipleTextEditor,
    draggable,
    EventAnalyticsForm,
  },
  methods: {
    removeContent(content) {
      const index = this.block.content.indexOf(content);
      this.block.content.splice(index, 1);
    },
    removeBlock() {
      this.$eventBus.emit("remove_block", this.block);
      this.$emit("onClose");
    },
    addText() {
      this.block.content.push({
        type: "text",
        text: ["Variação A", "Variação B", "Variação C"],
      });
    },
    addImage() {
      this.block.content.push({
        type: "image",
        link:
          "http://s2.glbimg.com/98XbAqt_X-viIassY_-xvO6qX4k=/290x217/s2.glbimg.com/5leI8ibWeyODP8jDmPhyNQbadzM=/300x225/s.glbimg.com/jo/g1/f/original/2013/05/13/cafefruta.jpg",
        caption: "Loren Ipsum",
      });
    },
    addDoc() {
      this.block.content.push({
        type: "document",
        text: ["Variação A", "Variação B", "Variação C"],
        link:
          "http://www.purifarma.com.br/Arquivos/Produto/Guaraná_NOVA%20LITERATURA.pdf",
        caption: "consectetur adipiscing elit",
        filename: "Guaraná_NOVA LITERATURA.pdf",
      });
    },
    addAudio() {
      this.block.content.push({
        // type: "audio",
        // text: ["Variação A", "Variação B", "Variação C"],
      });
    },
    addVideo() {
      this.block.content.push({
        // type: "video",
        // text: ["Variação A", "Variação B", "Variação C"],
      });
    },
  }
};
</script>
<style lang="scss">
.form-fallback {
  margin: 16px;
  padding: 8px;
  margin-top: 14px;
  background: #efefef;
  border-radius: 16px;
}
.form {
  margin: 4px;
  margin-top: 14px;
  background: #efefef;
  border-radius: 16px;
  > .header {
    height: 30px;
    line-height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    > .title {
      font-size: 14px;
      font-weight: bold;
    }
    > .header-btn {
      color: #555555;
      margin-left: 16px;
      margin-right: 16px;
      &:hover {
        color: #242424;
      }
    }
  }
  > .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    border-top: 1px solid #dddddd;
    &.show {
      display: none;
    }
    > .label {
      font-size: 11px;
      font-weight: bold;
      margin-top: 16px;
      color: black;
      margin: 16px;
      margin-bottom: 4px;
    }
    > input {
      border: none;
      padding: 8px;
      margin: 4px;
    }
  }
}
</style>
