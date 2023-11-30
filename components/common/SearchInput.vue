<template>
  <div class="search-input">
    <b-icon-search />
    <b-form-input v-model="text"></b-form-input>
  </div>
</template>
<script>
export default {
  props: ['value'],
  emits: ['update:value'],
  data () {
    return {
    }
  },
  computed: {
    text: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.search-input::v-deep {
  position: relative;
  display: flex;
  align-items: center;
  > .b-icon {
    position: absolute;
    left: 8px;
  }
  > .form-control {
    padding-left: calc(0.75rem + 20px);
  }
}
</style>
