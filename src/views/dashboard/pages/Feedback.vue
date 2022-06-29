<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-check"
      title="Feedback registrado"
      class="px-5 py-3"
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-card-subtitle class="mt-5">
            Gracias por su participación.
          </v-card-subtitle>
          <v-card-text class="mt-5">
            Su feedback es importante para alimentar al sistema de recomendación.
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
      }
    },
    computed: {
    },
    mounted: function () {
      FeedbackService.query(this.$route.params.token, this.$route.params.idconvocatoria + '/' + this.$route.params.util)
        .then(response => {
          console.log(response.data)
          this.message = response.data
        })
        .catch(error => {
          throw new Error(error)
        })
    },

    methods: {
    },
  }

</script>
