<template>
  <div :style="{minHeight:minHeight}" class="w-100 d-flex align-items-center justify-content-center">
    <b-spinner variant="primary" />
  </div>
</template>
<script>
export default {
  name: 'UiPageLoading',
  props: {
    minHeight: {
      type: String,
      required: false,
      default: 'auto'
    }
  }
}
</script>
