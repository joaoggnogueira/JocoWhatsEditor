<template>
  <div class="flowchart-form">
    <component :is="'c_' + block.type" :block="block" @onClose="onClose" />
  </div>
</template>
<script>
import ContentForm from "./forms/ContentForm.vue";
import UserInputForm from "./forms/UserInputForm.vue";
import RedirectForm from "./forms/RedirectForm.vue";

export default {
  props: {
    block: Object,
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
  },
  components: {
    c_message: ContentForm,
    c_user_input: UserInputForm,
    c_redirect: RedirectForm,
  },
};
</script>
<style lang="scss">
.flowchart-form {
  width: 400px;
  min-height: 400px;
  right: 50px;
  top: 50px;
  background: white;
  position: absolute;
  border-radius: 16px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  > .form-control {
    display: flex;
    flex-direction: column;
    align-content: stretch;
    > .header {
      height: 30px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      > .title {
        line-height: 30px;
      }
      > .fa-times {
        line-height: 30px;
        margin: 5px;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    > .content {
      max-height: calc(100vh - 200px);
      overflow-y: scroll;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-content: stretch;
      .label {
        font-weight: bold;
        text-align: left;
        margin-left: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>
