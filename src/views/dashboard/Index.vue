<template>
  <v-app>
    <dashboard-core-app-bar />
    <dashboard-core-drawer />

    <dashboard-core-view />
  </v-app>
</template>
<script>
  import VueJwtDecode from 'vue-jwt-decode'
  import JwtService from '@/common/jwt.service'
  import { AuthService } from '../../common/api.service'
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
      refreshLimitTimeInMillis: 300000,
      dialog: false,
      token: '',
      adv: false,
    }),
    created: function () {
      this.checkToken()
      // this.$router.beforeEach((to, from, next) => {
      //   if (!this.$store.getters.isLogged && to.name !== 'Login') {
      //
      //
      //     // return { name: 'Login' }
      //     return '/'
      //   } else {
      //
      //
      //     return to.name
      //   }
      //   //
      //   //
      // })
    },
    mounted: function () {

    },
    beforeDestroy () {
      clearInterval(this.polling)
    },
    methods: {
      refreshToken () {
        // this.dialog = false
        AuthService.refreshToken()
          .then(response => {
            this.token = response.data.Auth
            const parameters = {}
            parameters.token = this.token
            this.$store.dispatch('loginAction', parameters)
          })
          .catch(error => {
            throw new Error(error)
          })
      },
      logout () {
        this.dialog = false
      },
      checkToken () {
        this.polling = setInterval(() => {
          const decodedToken = VueJwtDecode.decode(JwtService.getToken())
          const expiration = decodedToken.exp * 1000
          if (expiration < Date.now()) {
            this.$router.push('/')
          } else {
            if (expiration - Date.now() < this.refreshLimitTimeInMillis && !this.adv) {
              this.adv = true
              if (confirm('La sesión caducará en 5 minutos, pulse aceptar para seguir conectado o cancelar para salir')) {
                this.refreshToken()
                this.adv = false
              } else {
                this.$store.dispatch('logoutAction')
                this.$router.push('/')
              }
            }
          }
        }, 5000)
      },
    },
  }
</script>
