<template>
  <v-app>
    <dashboard-core-normal-view />
  </v-app>
</template>
<script>
  export default {
    name: 'DashboardNormalIndex',

    components: {
      DashboardCoreNormalView: () => import('./components/core/NormalView'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
