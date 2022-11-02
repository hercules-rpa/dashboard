<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-cog"
      title="Preferencias de proceso"
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
        :items="configs"
        :search="search"
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
            class="ma-2"
            outlined
            x-small
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
  import { ProcessService, ProcessSettingsService } from '@/common/api.service'
  export default {
    name: 'NewProcess',

    data () {
      return {
        search: '',
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'proceso',
          },
          {
            sortable: false,
            text: 'Configurador',
            value: 'configurador',
          },
          {
            sortable: false,
            text: 'Ruta',
            value: 'path',
          },
          {
            text: 'Ajustes',
            value: 'controls',
            sortable: false,
          },
        ],
        processes: [],
        configs: [],
      }
    },
    computed: {

    },
    mounted: function () {
      ProcessSettingsService.query()
        .then(response => {
          console.log(response.data)
          this.configs = response.data
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    methods: {
      complete (index) {
        console.log('ventana nuevo proceso')
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
        console.log(p)
        this.$router.push('/pages/settings/' + p.path.replaceAll('/', '+'))
      },
      goToForm (value, data) {
        console.log(value)
        console.log(data)
        this.$router.push('/pages/newprocess/' + data.item.process_id + '/form')
      },
    },
  }
</script>
<style lang="sass">
.search-adjust
  width: 200px
</style>
