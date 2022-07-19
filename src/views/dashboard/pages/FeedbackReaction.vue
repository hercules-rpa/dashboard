<template>
  <div class="app">
    <div v-if="show">
      <div v-if="!error">
        <h1>
          Gracias por su participación
        </h1>
        <v-icon
          color="green"
          class="mt-10"
          size="70"
        >
          mdi-check-circle-outline
        </v-icon>
        <h4 class="mt-3">
          La información se envío correctamente
        </h4>
        <h2
          class="mt-10"
        >
          Su feedback es importante para alimentar al sistema de recomendación.
        </h2>
      </div>
      <div v-else>
        <h1>
          Ha ocurrido un error
        </h1>
        <v-icon
          color="red"
          class="mt-10"
          size="70"
        >
          mdi-alert-circle-outline
        </v-icon>
        <h2
          class="mt-10"
        >
          Su feedback no ha podido registrarse o ya se registró anteriormente.
        </h2>
      </div>
      <v-img
        class="mt-10"
        contain
        src="../../../assets/hercules.png"
        max-height="100"
      />
      <div v-if="conRating">
        <h2 class="mt-10">
          ¿ Qué le ha parecido la experiencia de usuario ?
        </h2>
        <vue-feedback-reaction
          v-model="feedback"
          class="feedback mt-10"
          :labels="['Muy mala', 'Mala', 'Normal', 'Buena', 'Excelente']"
          label-class="font-medium text-sm text-gray-800"
        />
        <v-btn
          color="red"
          class="mt-10"
        >
          Enviar
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
  import { FeedbackService } from '@/common/api.service'
  export default {
    name: 'FeedbackReaction',
    data () {
      return {
        feedback: '',
        colorFromScript: '#1194AA',
        reaction: 'hate',
        active: false,
        disabled: false,
        error: false,
        conRating: false,
        show: false,
      }
    },
    computed: {
      app () {
        return {
          background: this.feedback === '1' ? '#5B37B7'
            : this.feedback === '2' ? '#BE3099'
              : this.feedback === '3' ? '#E39A28'
                : this.feedback === '4' ? '#11aa50'
                  : '#1194AA',
          transition: 'all 500ms linear',
        }
      },
    },
    mounted: function () {
      FeedbackService.query(this.$route.params.token, this.$route.params.idconvocatoria + '/' + this.$route.params.util)
        .then(response => {
          if (response.status === 200) {
            console.log(response.data)

            this.message = response.data
            this.error = false
            this.show = true
          } else if (response.status === 400) {
            this.error = true
            this.show = true
          }
        })
        .catch(error => {
          this.error = true
          this.show = true
          throw new Error(error)
        })
    },

    methods: {

    },
  }

</script>
<style lang="sass">
body
  margin: 0
.app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  display: flex
  flex-direction: column
  height: 100vh
  align-items: center
  justify-content: center
  background: #fff
  .feedback
    padding: 20px
    text-align: center
    display: inline-flex
    background: white
    border-radius: 12px
.text-sm
  font-size: 0.875rem
.text-gray-800
  color: #6f6f6f
.font-medium
  font-weight: 500
h1,
h2
  color: #bd2a33
  font-weight: 600
</style>
