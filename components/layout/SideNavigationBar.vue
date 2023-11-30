<template>
  <b-row class="layout-lnb m-0">
    <b-col class="p-0 layout-lnb-menu-wrap">
      <div v-if="isLoading" class="text-center text-danger my-4">
        <b-spinner variant="primary" class="align-middle" />
      </div>
      <div v-else class="layout-lnb-menu">
        <div
          v-for="(menu, index) in menuList"
          :key="`lnb_${index}`"
        >
          <div class="layout-lnb-menu-item">
            <b-button
              :variant="collapseId === `menu-${menu.id}`?'primary':'transparent'"
              class="menu-toggle-btn"
              :class="{'active':collapseId === `menu-${menu.id}`}"
              @click="movePage($event,menu.url, menu.id)"
            >
              <div class="d-flex flex-column align-items-center justify-content-center">
                <!--                <div class="nav-img" :class="menu.icon" />-->
                <span class="menu-title">
                  {{ menu.name }}
                </span>
              </div>
            </b-button>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'LayoutSideNavigationBar',
  props: {
    routeName: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      collapseId: 'menu-0'
    }
  },
  computed: {
    menuList () {
      return this.$store.getters.menuList
    }
  },
  watch: {
    routeName (val) {
      this.setMenuList()
    }
  },
  mounted () {
    this.setMenuList()
    this.updateSize()
    window.addEventListener('resize', this.updateSize)
  },
  methods: {
    setMenuList () {
      const basePath = this.$route.path.split('/')[1]
      const currentPath = this.menuList.filter(menu => menu.url.includes(basePath))
      if (currentPath && currentPath.length > 0) {
        this.collapseId = `menu-${currentPath[0].id}`
      }
    },
    async movePage (event, url, id) {
      this.collapseId = `menu-${id}`
      await this.$router.push(url)
    },
    updateSize () {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
  }
}
</script>
