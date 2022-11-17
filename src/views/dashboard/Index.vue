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
        console.log('refreshtoken')
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
        console.log('logout')
        this.dialog = false
      },
      checkToken () {
        this.polling = setInterval(() => {
          console.log('tOKEN')
          const decodedToken = VueJwtDecode.decode(JwtService.getToken())
          const expiration = decodedToken.exp * 1000
          console.log(expiration)
          console.log(Date.now())
          console.log(expiration - Date.now())
          if (expiration < Date.now()) {
            this.$router.push('/')
          } else {
            if (expiration - Date.now() < this.refreshLimitTimeInMillis && !this.adv) {
              this.adv = true
              if (confirm('La sesión caducará en 5 minutos, pulse aceptar para seguir conectado o cancelar para salir')) {
                this.refreshToken()
                this.adv = false
                console.log('Seguir conectado')
              } else {
                this.$store.dispatch('logoutAction')
                this.$router.push('/')
                console.log('Salir')
              }
            }
          }
        }, 5000)
      },
    },
  }
</script>
