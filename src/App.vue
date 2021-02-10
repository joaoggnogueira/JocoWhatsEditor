<template>
  <div id="app">
    <div class="flowchartParent">
      <Flowchart :blocks="blocks" @open_edit_form_block="open_edit_form_block" />
    </div>
    <FlowchartForm v-if="editBlock" :block="editBlock" @onClose="close" />
  </div>
</template>

<script>
import Flowchart from "./components/Flowchart.vue";
import FlowchartForm from "./components/FlowchartForm.vue";

export default {
  name: "App",
  components: {
    Flowchart,
    FlowchartForm,
  },
  data: () => ({
    editBlock: null,
    blocks: null,
  }),
  methods: {
    open_edit_form_block(block) {
      this.editBlock = block;
    },
    close() {
      this.editBlock = null;
    },
  },
  mounted() {
    this.blocks = [
      {
        id: "01",
        component: "Begin",
        x: 512,
        y: 64,
      },
      {
        id: "02",
        component: "End",
        x: 512,
        y: 264,
      },
      {
        id: "03",
        component: "Redirect",
        x: 64,
        y: 64,
      },
      {
        id: "04",
        type: "message",
        component: "Content",
        content: [
          {
            type: "text",
            text: [
              "Variation A: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
              "Variation B: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
              "Variation C: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
            ],
          },
          {
            type: "image",
            link:
              "http://s2.glbimg.com/98XbAqt_X-viIassY_-xvO6qX4k=/290x217/s2.glbimg.com/5leI8ibWeyODP8jDmPhyNQbadzM=/300x225/s.glbimg.com/jo/g1/f/original/2013/05/13/cafefruta.jpg",
            id: "01",
            caption: "Loren Ipsum",
          },
          {
            type: "document",
            id: "02",
            link:
              "http://www.purifarma.com.br/Arquivos/Produto/Guaraná_NOVA%20LITERATURA.pdf",
            caption: "consectetur adipiscing elit",
            filename: "Guaraná_NOVA LITERATURA.pdf",
          },
        ],
        fallback: ["Fallback A", "Fallback B"],
        analytics: {
          enabled: true,
          category: "",
          action: "",
          label: "",
        },
        x: 64,
        y: 288,
        redirect: ["05"],
      },
      {
        id: "05",
        type: "message",
        component: "Content",
        content: [
          {
            type: "audio",
            id: "03",
            link:
              "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
          },
          {
            type: "video",
            id: "04",
            link: "https://www.w3schools.com/html/mov_bbb.mp4",
            caption: "texto",
          },
        ],
        fallback: ["Fallback A", "Fallback B"],
        analytics: {
          enabled: true,
          category: "",
          action: "",
          label: "",
        },
        x: 512,
        y: 512,
        redirect: [],
      },
      {
        id: "06",
        type: "user_input",
        component: "UserInput",
        options: [
          {
            name: "Opção 1",
            synonyms: ["opcao 1", "opcao um", "um", "1"],
            redirect: null,
          },
          {
            name: "Opção 2",
            synonyms: ["opcao 2", "opcao dois", "dois", "2"],
            redirect: "02",
          },
          {
            name: "Opção 3",
            synonyms: ["opcao 3", "opcao tres", "tres", "3"],
            redirect: "03",
          },
        ],
        x: 864,
        y: 388,
      },
    ];
  },
};
</script>

<style lang="scss">
@mixin noselected() {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.flowchartParent {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
}
.v-popper__inner {
  color: #444444 !important;
  font-family: sans-serif;
}
.v-popper--theme-tooltip .v-popper__inner {
  background: #f0f0f0 !important;
  border: 1px solid #dadada !important;
}
.v-popper--theme-tooltip .v-popper__arrow {
  border-color: #cccccc !important;
}

.rotateA90 {
  transform: rotate(-90deg);
}

.row {
  display: flex;
  align-items: center;
  margin: 6px;
  padding: 6px;
}

input {
  padding: 8px;
  margin: 4px;
  border: 1px solid #bbb;
  background: #fff;
  border-radius: 8px;
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-center {
  justify-content: space-around;
  display: flex;
  align-items: center;
}

.flex-filler {
  flex-grow: 2;
}

.btn-add-content {
  flex-grow: 2;
  background: #eeeeee;
  color: black;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  margin: 4px;
  padding: 4px;
  cursor: pointer;
  &:hover {
    background: #4bb147;
  }
}

.btn-bullet {
  margin: 0px 4px;
  flex-grow: 1;
  max-width: 50px;
  height: 20px;
  line-height: 22px;
  background: #dddddd;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
.btn-left-icon {
  margin: 0px 4px;
  margin-right: 0px;
  flex-grow: 1;
  max-width: 50px;
  height: 30px;
  line-height: 30px;
  background: #dddddd;
  border-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
.input-right {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  margin-left: 0px;
}
.btn {
  margin: 0px 4px;
  flex-grow: 1;
  height: 20px;
  line-height: 22px;
  background: #dddddd;
  font-size: 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
</style>
