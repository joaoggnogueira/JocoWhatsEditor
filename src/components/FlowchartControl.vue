<template>
  <div class="flowchart-control">
    <div class="btn-control" @click="salvar">Salvar</div>
    <div class="btn-control" @click="$emit('resetJsPlumb')">Resetar JsPlumb</div>
    <div class="label">Adicionar</div>
    <div class="btn-control" @click="$emit('addBlock', 'message')">
      <font-awesome-icon icon="comment-dots" size="lg" />
      <div class="label">Interação</div>
    </div>
    <div class="btn-control" @click="$emit('addBlock', 'user_input')">
      <font-awesome-icon icon="directions" size="lg" />
      <div class="label">User Input</div>
    </div>
    <div class="btn-control" @click="$emit('addBlock', 'redirect')">
      <font-awesome-icon icon="external-link-square-alt" size="lg" />
      <div class="label">Redirect</div>
    </div>
    <div class="btn-control" @click="$emit('addBlock', 'request')">
      <font-awesome-icon icon="server" size="lg" />
      <div class="label">Call a Webhook</div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations(["backup"]),
    salvar() {
      this.backup();
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes opening {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.flowchart-control {
  position: absolute;
  left: 0px;
  top: 0px;
  margin: 12px;
  padding: 8px;
  background: white;
  border-radius: 15px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: opening 0.5s ease-out 0s 1 normal forwards;
  > .btn-control {
    padding: 8px;
    margin: 4px;
    background: #eee;
    color: #111;
    min-height: 20px;
    white-space: pre-wrap;
    border-radius: 4px;
    line-height: 20px;
    max-width: none;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:hover {
      background: #ddd;
    }
  }
  > .label {
    margin-top: 14px;
    font-size: 12px;
  }
}
</style>
