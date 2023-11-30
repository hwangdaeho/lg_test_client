<template>
  <b-navbar class="top-nav-bar">
    <b-navbar-nav class="mx-auto">
      <b-nav-item
        v-for="(menu, index) in menuList"
        :key="`lnb_${index}`"
      >
        <b-button
          :class="{'active':activeId === `menu-${menu.id}`}"
          variant="transparent"
          class="layout-lnb-menu-item"
          @click="movePage($event,menu.url, menu.id)"
        >
          <div class="d-flex flex-column align-items-center justify-content-center">
            <!--                <div class="nav-img" :class="menu.icon" />-->
            <span class="menu-title">
              {{ menu.name }}
            </span>
          </div>
        </b-button>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>

export default {
  name: 'LayoutTopNavigationBar',
  props: {
    routeName: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      confirmModalState: false,
      activeId: '',
      menuList: [
        {
          id: 0,
          icon: 'nav_home',
          name: 'Home',
          url: '/',
          isExpert: false
        },
        {
          id: 1,
          icon: 'nav_setup',
          name: '메뉴1',
          url: '/test',
          isExpert: false
        },
        {
          id: 2,
          icon: 'nav_setup',
          name: '메뉴2',
          url: '/test',
          isExpert: false
        },
        {
          id: 3,
          icon: 'nav_setup',
          name: '메뉴3',
          url: '/test',
          isExpert: false
        }
      ]
    }
  },
  computed: {
    // menuList () {
    //   return this.$store.getters.menuList
    // }
  },
  created () {},
  mounted () {
    const basePath = this.$route.path.split('/')[1]
    const currentPath = this.menuList.filter(menu => menu.url.includes(basePath))
    if (currentPath && currentPath.length > 0) {
      this.activeId = `menu-${currentPath[0].id}`
    }
  },
  methods: {
    async movePage (event, url, id) {
      this.activeId = `menu-${id}`
      await this.$router.push(url)
    }
  }
}
</script>
<style lang="scss">
.top-nav-bar{
  width: 100%;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: 1px solid rgba(190,190,190,0.4);
  margin-bottom: 1rem;
  .navbar-nav{
    width: 100%;
    max-width: 1280px;
    justify-content: center;
   .layout-lnb-menu-item{
     .menu-title{
       color: #333;
       font-weight: 600;
     }
      &.active{
        .menu-title{
          color: var(--primary);
        }
      }
   }
  }
}

</style>
