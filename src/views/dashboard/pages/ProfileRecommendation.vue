<template>
  
</template>
<script>
  import { ProfileRecommendationService } from '@/common/api.service'
  export default{
    mounted: function () {
      ProfileRecommendationService.query(this.$route.params.token)
        .then(response => {
          console.log(response.data)
          this.processes = response.data
        })
        .catch(error => {
          throw new Error(error)
        })
    }
  }
  
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
