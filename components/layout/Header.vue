<template>
  <b-navbar class="header-navbar">
    <b-navbar-brand class="logo-title">
      LG LOGO
    </b-navbar-brand>
    <div class="user-info ">
      <span>로그인</span>
    </div>
  </b-navbar>
</template>

<script>

export default {
  name: 'LayoutHeader',
  data () {
    return {
      confirmModalState: false,
      activeId: ''
    }
  },
  computed: {
    menuList () {
      return this.$store.getters.menuList
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss">
.header-navbar{
  width: 100%;
  justify-content: space-between;
  padding-bottom: 0;
  .navbar-brand{
    &.logo-title{
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--primary);
      text-shadow: 1px 1px 1px 5px rgba(220,220,220,0.6);
      padding: 0.75rem;
    }
  }
  .user-info{
    display: flex;
    align-items: start;
    height: 100%;
    margin-right: 1rem;
    span{
      color: #5D5D5E;
      font-weight: 700;
      font-size: 0.875rem;
      padding: 0.375rem;
    }
  }
}

</style>
