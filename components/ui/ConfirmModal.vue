<template>
  <b-modal
    id="ui-confirm-modal"
    v-model="isShow"
    centered
    hide-header
    hide-footer
    content-class="confirm-modal w-auto mx-auto"
    @close="$emit('close')"
    @cancel="$emit('close')"
    @hide="$emit('close')"
  >
    <template #default>
      <h5 v-if="title" class="confirm-modal-title" :class="titleClass">
        {{ title }}
      </h5>
      <p class="confirm-modal-message">
        {{ message }}
      </p>
      <div class="d-flex justify-content-center align-items-center">
        <b-button
          variant="default-light"
          class="mr-2"
          @click="$emit('close')"
        >
          {{ cancelTitle || '취소' }}
        </b-button>
        <b-button
          :class="okClass"
          variant="primary"
          @click="$emit('confirm')"
        >
          {{ okTitle || '확인' }}
        </b-button>
      </div>
    </template>
  </b-modal>
</template>
<script>
export default {
  name: 'UiConfirmModal',
  props: {
    modalState: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    titleClass: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: true,
      default: ''
    },
    okTitle: {
      type: String,
      required: false,
      default: ''
    },
    cancelTitle: {
      type: String,
      required: false,
      default: ''
    },
    okClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  watch: {
    modalState (val) {
      this.isShow = val
    }
  }
}
</script>
<style lang="scss">
.confirm-modal{
  border-radius: 1rem;
  .confirm-modal-title{
    color: #222;
    font-size: 1.25rem;
    font-weight: 700;
    padding: 1.5rem 0 1rem 0;
  }
  .confirm-modal-message{
    color: #222;
    text-align: center;
    font-weight: 600;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  .btn{
    font-size: 1rem;
    font-weight: 600;
    border-radius: 10px;
    width: 12.5rem;
    padding: 1.5rem 1.125rem;
  }
}
</style>
