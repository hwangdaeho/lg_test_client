<template>
  <b-container
    fluid
    class="layout-container"
    :class="[
      {'nav-close': isClosed},
    ]"
  >
    <b-row class="content flex-nowrap">
      <!--      <b-col cols="auto" tag="nav" class="lnb-wrap" :class="{'close': isClosed }">-->
      <!--        <LayoutSideNavigationBar :route-name="currentRouteName" />-->
      <!--      </b-col>-->
      <b-col tag="main" :class="{'nav-closed': isClosed, 'no-nav' : isClosed}" class=" position-relative">
        <b-row tag="header">
          <LayoutHeader />
        </b-row>
        <b-row>
          <LayoutTopNavigationBar :route-name="currentRouteName" />
        </b-row>
        <b-row class="nuxt-page mx-auto">
          <TransitionPage>
            <Nuxt />
          </TransitionPage>
        </b-row>
        <b-row tag="footer">
          <LayoutFooter />
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  data () {
    return {
      currentRouteName: '',
      isClosed: false
    }
  },
  computed: {
  },
  watch: {
    $route: {
      deep: true,
      handler (val) {
        this.currentRouteName = val.name
        this.isClosed = val.name === 'auth-login'
      }
    }
  },
  mounted () {
    this.currentRouteName = this.$route.name
    this.isClosed = this.currentRouteName === 'auth-login'
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>
