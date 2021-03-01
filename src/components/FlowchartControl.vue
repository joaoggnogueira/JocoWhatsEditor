<template>
  <div class="flowchart-control">
    <div class="flowchart-control-btn" @click="$emit('addBlock', 'message')">
      <font-awesome-icon icon="comment-dots" size="lg" />
      <div class="label">Interação</div>
    </div>
    <div class="flowchart-control-btn" @click="$emit('addBlock', 'request')">
      <font-awesome-icon icon="server" size="lg" />
      <div class="label">Call a Webhook</div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.flowchart-control {
  position: absolute;
  left: 0px;
  top: 0px;
  margin: 12px;
  padding: 8px;
  background: white;
  border-radius: 15px;
  z-index: 999;
  .flowchart-control-btn {
    background: white;
    width: 50px;
    height: 50px;
    padding: 8px;
    margin: 4px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:hover {
      background: rgb(102, 194, 102);
    }
    .label {
      margin-top: 10px;
      font-size: 12px;
    }
  }
}
</style>
