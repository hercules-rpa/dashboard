<template>
  <v-card>
    <v-card-title>FeedBack Registrado</v-card-title>
    <v-card-subtitle>Gracias por su participación.</v-card-subtitle>
    <v-card-text>Su feedback es importante para alimentar al sistema de recomendación.</v-card-text>
  </v-card>
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
