<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <div
              align="center"
            >
              <v-card
                class="elevation-12"
                max-width="500"
              >
                <v-toolbar
                  dark
                  color="#A22C2E"
                >
                  <v-toolbar-title>Hercules RPA Dashboard - Login</v-toolbar-title>
                </v-toolbar>
                <v-img
                  src="https://www.um.es/image/journal/article?img_id=27599116&t=1656572736918"
                />
                <v-card-text>
                  <v-form
                    v-model="valid"
                  >
                    <v-text-field
                      v-model="user"
                      prepend-icon="mdi-account"
                      name="user"
                      :rules="userRules"
                      label="Usuario"
                      type="string"
                      required
                    />
                    <v-text-field
                      id="password"
                      v-model="password"
                      prepend-icon="mdi-lock"
                      name="password"
                      label="Contraseña"
                      type="password"
                    />
                  </v-form>
                  <div
                    v-if="loginError"
                    class="red--text"
                  >
                    *Usuario o contraseña incorrectos
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="!valid"
                    color="#A22C2E"
                    @click="login"
                  >
                    Login
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import { LoginService } from '@/common/api.service'
  export default {
    name: 'Login',
    data () {
      return {
        valid: null,
        log: 'true',
        email: '',
        password: '',
        params: null,
        token: '',
        user: '',
        loginError: false,
        emailRules: [
          v => !!v || 'E-mail es requerido',
          v => /.+@.+\..+/.test(v) || 'El E-mail tiene que ser válido',
        ],
        userRules: [
        ],
      }
    },
    mounted: function () {
      // if (this.$store.getters.isLogged) {
      //   this.$router.push('pages/dashboard')
      // }
      // console.log('mounted')
    },
    methods: {
      loginMock () {
        this.token = 'mocktoken'
        const parameters = {}
        parameters.token = this.token
        this.$store.dispatch('loginAction', parameters)
        // EventBus.$emit('logged')
        this.$router.push({ name: 'Dashboard' })

        console.log('Authorized')
        this.loginError = false
      },
      login () {
        console.log(this.user + this.password)
        LoginService.login(this.user, this.password)
          .then(response => {
            console.log(response.data)
            if (response.status === 200) {
              this.token = response.data.Auth
              // saveToken(this.token)
              const parameters = {}
              parameters.token = this.token
              this.$store.dispatch('loginAction', parameters)
              // EventBus.$emit('logged')
              this.$router.push({ name: 'Dashboard' })
              // this.$router.go()

              console.log('Authorized')
              this.loginError = false
            } else {
              console.log('Authorization ERROR')
              Vue.prototype.$logged = false
              this.loginError = true
            }
          })
          .catch(error => {
            console.log(this.user + this.password)
            this.loginError = true
            throw new Error(error)
          })
        // this.dialog = false
        // this.$router.push('/pages/newprocess/')
      },
      downloadLog (lData) {
      },
    },
  }
</script>

<style></style>
