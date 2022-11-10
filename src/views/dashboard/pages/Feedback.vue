<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      :icon="error ?'mdi-close-thick' : 'mdi-check'"
      title="Registro de Feedback"
      class="px-5 py-3"
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-card-subtitle
            v-if="!error"
            class="mt-5"
          >
            Gracias por su participación.
          </v-card-subtitle><v-card-subtitle
            v-else
            class="mt-5"
          >
            Ha ocurrido un error
          </v-card-subtitle>
          <v-card-text
            v-if="!error"
            class="mt-5"
          >
            Su feedback es importante para alimentar al sistema de recomendación.
          </v-card-text><v-card-text
            v-else
            class="mt-5"
          >
            Su feedback no ha podido registrarse o ya se registró anteriormente con este token.
          </v-card-text>
        </v-col>
      </v-row>
    </base-material-card>
  </v-container>
</template>
<script>
  import { FeedbackService } from '@/common/api.service'
  export default {
    name: 'Feedback',
    data () {
      return {
        message: '',
        error: false,
      }
    },
    computed: {
    },
    mounted: function () {
      FeedbackService.query(this.$route.params.token, this.$route.params.idconvocatoria + '/' + this.$route.params.util)
        .then(response => {
          if (response.status === 200) {
            this.message = response.data
            this.error = false
          } else if (response.status === 400) {
            this.error = true
          }
        })
        .catch(error => {
          this.error = true
          throw new Error(error)
        })
    },

    methods: {
    },
  }

</script>
