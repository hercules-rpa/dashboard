<template>
  <v-app v-if="$store.getters.isLogged">
    <notifications />
    <dashboard-core-app-bar />
    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-settings />
  </v-app>
  <v-app v-else>
    <dashboard-core-normal-view />
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
      DashboardCoreNormalView: () => import('./components/core/NormalView'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
