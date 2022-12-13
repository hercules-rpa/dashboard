<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Historial de Ejecuciones"
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
        :items="executions"
        single-select
        :search="search"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :loading="loading"
        loading-text="Cargando datos...por favor espere"
        @dblclick:row="goToExecution"
      >
        <template v-slot:[`item.start_time`]="{ item }">
          {{ item.start_time | date }}
        </template>
        <template v-slot:[`item.end_time`]="{ item }">
          {{ item.end_time | date }}
        </template>
        <template v-slot:[`item.id_robot`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/robots/'+item.id_robot }"
          >
            {{ item.id_robot }}
          </router-link>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/logs/'+item.id }"
          >
            {{ item.id }}
          </router-link>
        </template>
        <template v-slot:[`item.id_schedule`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/executions/'+item.id_schedule }"
          >
            {{ item.id_schedule }}
          </router-link>
        </template>
        <template v-slot:[`item.finished`]="{ item }">
          <div :class="[item.finished ? 'green--text text--darken-3' : 'yellow--text text--darken-3']">
            {{ item.finished ? 'FINALIZADO' : 'EJECUTANDO' }}
          </div>
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <div :class="[item.state == 'OK' ? 'green--text text--darken-3' : 'red--text text--darken-2']">
            {{ item.state }}
          </div>
        </template>
      </v-data-table>
    </base-material-card>
    <div class="py-3" />
  </v-container>
</template>

<script>
  import { LogsService, SchedulesService } from '@/common/api.service'
  export default {
    name: 'NewProcess',
    data () {
      return {
        sortBy: 'end_time',
        sortDesc: true,
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
            text: 'Planificación',
            value: 'id_schedule',
          },
          {
            sortable: true,
            text: 'Log',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Inicio',
            value: 'start_time',
          },
          {
            sortable: true,
            text: 'Fin',
            value: 'end_time',
          },
          {
            sortable: true,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            sortable: true,
            text: 'Estado',
            value: 'finished',
          },
          {
            sortable: true,
            text: 'Resultado',
            value: 'state',
          },
        ],
        executions: [],
      }
    },
    computed: {

    },
    mounted: function () {
      LogsService.query()
        .then(response => {
          this.executions = response.data
          this.loading = false
        })
        .catch(error => {
          alert('Ha ocurrido un error', error)
        })
    },
    methods: {
      complete (index) {

      },
      getExecution (idExecution) {
        SchedulesService.getForm(idExecution)
          .then(response => {
            alert('Nos vamos a la ventana de formulario')
          })
          .catch(error => {
            alert('Ha ocurrido un error', error)
          })
      },
      goToExecution (value, data) {
        this.$router.push('/pages/logs/' + data.item.id)
      },
    },
  }
</script>
<style lang="sass">
.search-adjust
  width: 200px
</style>
