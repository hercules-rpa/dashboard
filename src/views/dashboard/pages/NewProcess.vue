<template>
  <v-container
    id="nuevo-proceso"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      :title="this.$i18n.t('avaiableprocess')"
      class="px-5 py-3"
    >
      <v-text-field
        v-model="search"
        class="mb-5 search-adjust"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      />
      <v-data-table
        :headers="headers"
        :items="processes"
        :search="search"
        :loading="loading"
        loading-text="Cargando datos...por favor espere"
        @dblclick:row="goToForm"
      >
        <template v-slot:[`item.capable_robots`]="{ item }">
          <div
            v-for="robot in item.capable_robots"
            :key="robot"
          >
            <router-link
              class="blue--text text--darken-3"
              :to="{ path: '/pages/robots/'+robot }"
            >
              {{ robot }}
            </router-link>
          </div>
        </template>
        <template v-slot:[`item.controls`]="{ item }">
          <v-btn
            v-if="item.setting"
            class="ma-2"
            outlined
            x-small
            title="settings"
            fab
            color="primary"
            @click="goToProcessSettings(item)"
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </base-material-card>
    <div class="py-3" />
  </v-container>
</template>

<script>
  import { ProcessService } from '@/common/api.service'
  export default {
    name: 'NuevoProcess',

    data () {
      return {
        search: '',
        loading: true,
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
          },
          {
            sortable: true,
            text: 'ID Proceso',
            value: 'process_id',
          },
          {
            sortable: false,
            text: 'Descripción',
            value: 'process_description',
          },
          {
            sortable: false,
            text: 'Robot Disponible',
            value: 'capable_robots',
          },
          {
            text: '',
            value: 'controls',
            sortable: false,
          },
        ],
        processes: [],
      }
    },
    computed: {

    },
    mounted: function () {
      ProcessService.getProcessVisible()
        .then(response => {
          this.processes = response.data
          this.loading = false
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    methods: {
      complete (index) {

      },
      getProcessForm (idProcess) {
        ProcessService.getForm(idProcess)
          .then(response => {
            this.processes = response.data
            alert('Nos vamos al formulario de correo')
          })
          .catch(error => {
            alert('Ha ocurrido un error', error)
          })
      },
      goToProcessSettings (p) {
        this.$router.push('/pages/settings')
      },
      goToForm (value, data) {
        this.$router.push('/pages/newprocess/' + data.item.process_id + '/form')
      },
    },
  }
</script>
<style lang="sass">
.search-adjust
  width: 200px
</style>
