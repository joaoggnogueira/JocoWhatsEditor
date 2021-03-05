<template>
  <div class="form-control">
    <div class="header">
      <font-awesome-icon icon="times" @click="$emit('onClose')" />
      <div class="title">Redirecionar</div>
      <div class="flex-filler"></div>
      <div class="btn" @click="removeBlock">Excluir bloco</div>
    </div>
    <div class="content">
      <div class="label">Rótulo</div>
      <input v-model="block.name"/>
      <div class="label">Analytics</div>
      <div class="form-fallback">
        <EventAnalyticsForm :analytics="block.analytics" />
      </div>
    </div>
  </div>
</template>
<script>
import EventAnalyticsForm from "./EventAnalyticsForm.vue";

export default {
  props: {
    block: Object,
  },
  components: {
    EventAnalyticsForm,
  },
  methods: {
    removeBlock() {
      this.$eventBus.emit("remove_block", this.block);
      this.$emit("onClose");
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
