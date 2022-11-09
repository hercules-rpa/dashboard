<template>
  <v-app>
    <notifications />
    <dashboard-core-app-bar />
    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-settings />
  </v-app>
</template>
<script>
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),
    created: function () {
      // this.$router.beforeEach((to, from, next) => {
      //   if (!this.$store.getters.isLogged && to.name !== 'Login') {
      //     console.log(this.$store.getters.isLogged)
      //     console.log(to.name)
      //     // return { name: 'Login' }
      //     return '/'
      //   } else {
      //     console.log(this.$store.getters.isLogged)
      //     console.log(to.name)
      //     return to.name
      //   }
      //   // console.log(this.$store.getters.isLogged)
      //   // console.log(to.name)
      // })
    },
    mounted: function () {

    },
  }
</script>
