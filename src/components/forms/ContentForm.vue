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
          :is="c.form"
          :content="c"
          v-for="c in block.content"
          :key="c.fid"
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
import AudioForm from "./content/AudioForm.vue";
import DocForm from "./content/DocForm.vue";
import ImageForm from "./content/ImageForm.vue";
import TextForm from "./content/TextForm.vue";
import VideoForm from "./content/VideoForm.vue";
import EventAnalyticsForm from "./EventAnalyticsForm.vue";
import MultipleTextEditor from "@/components/MultipleTextEditor.vue";
import draggable from "vuedraggable";

export default {
  props: {
    block: Object,
  },
  components: {
    AudioForm,
    DocForm,
    ImageForm,
    TextForm,
    VideoForm,
    MultipleTextEditor,
    draggable,
    EventAnalyticsForm,
  },
  methods: {
    removeContent(content) {
      const index = this.block.content.indexOf(content);
      this.block.content.splice(index, 1);
    },
    removeBlock() {},
    addText() {
      this.block.content.push({
        type: "text",
        text: ["Variação A", "Variação B", "Variação C"],
      });
      this.processContent();
    },
    addImage() {
      this.block.content.push({
        type: "image",
        link:
          "http://s2.glbimg.com/98XbAqt_X-viIassY_-xvO6qX4k=/290x217/s2.glbimg.com/5leI8ibWeyODP8jDmPhyNQbadzM=/300x225/s.glbimg.com/jo/g1/f/original/2013/05/13/cafefruta.jpg",
        caption: "Loren Ipsum",
      });
      this.processContent();
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
      this.processContent();
    },
    addAudio() {
      this.block.content.push({
        // type: "audio",
        // text: ["Variação A", "Variação B", "Variação C"],
      });
      this.processContent();
    },
    addVideo() {
      this.block.content.push({
        // type: "video",
        // text: ["Variação A", "Variação B", "Variação C"],
      });
      this.processContent();
    },
    processContent() {
      this.block.content.forEach((content) => {
        content.form = {
          document: "DocForm",
          audio: "AudioForm",
          image: "ImageForm",
          text: "TextForm",
          video: "VideoForm",
        }[content.type];
        content.fid = this.$uuid.v1();
      });
    },
  },
  mounted() {
    this.processContent();
    this.$forceUpdate();
  },
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
