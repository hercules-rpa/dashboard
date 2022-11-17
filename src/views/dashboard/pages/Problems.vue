<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Problemas de ejecución"
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
        :items="problems"
        single-select
        :search="search"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :loading="loading"
        loading-text="Cargando datos...por favor espere"
        @dblclick:row="goToProblem"
      >
        <template v-slot:[`item.ts`]="{ item }">
          {{ item.ts | date }}
        </template>
        <template v-slot:[`item.msg`]="{ item }">
          <span class="red--text">
            {{ getErrorLine(item.msg) }}
          </span>
        </template>
        <template v-slot:[`item.robot_id`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/robots/'+item.robot_id }"
          >
            {{ item.robot_id }}
          </router-link>
        </template>
        <template v-slot:[`item.process_name`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/newprocess/'+item.process_id + '/form' }"
          >
            {{ item.process_name }}
          </router-link>
        </template>
        <template v-slot:[`item.log`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/logs/'+item.log }"
          >
            {{ item.log }}
          </router-link>
        </template>
        <template v-slot:[`item.execution_id`]="{ item }">
          <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/executions/'+item.execution_id }"
          >
            {{ item.execution_id }}
          </router-link>
        </template>
      </v-data-table>
    </base-material-card>
    <div class="py-3" />
  </v-container>
</template>

<script>
  import { ProblemsService } from '@/common/api.service'
  export default {
    name: 'NewProcess',

    data () {
      return {
        loading: true,
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
          },
          {
            sortable: false,
            text: 'Planificación',
            value: 'execution_id',
          },
          {
            sortable: false,
            text: 'Log',
            value: 'log',
          },
          {
            sortable: false,
            text: 'Robot',
            value: 'robot_id',
          },
          {
            sortable: false,
            text: 'Error',
            value: 'msg',
          },
          {
            sortable: false,
            text: 'tiempo',
            value: 'ts',
          },
        ],
        problems: [],
        sortBy: 'ts',
        sortDesc: true,
        search: '',
      }
    },
    computed: {

    },
    mounted: function () {
      ProblemsService.query()
        .then(response => {
          this.problems = response.data
          this.loading = false
        })
        .catch(error => {
          alert('Ha ocurrido un error', error)
        })
    },
    methods: {
      complete (index) {

      },
      goToProblem (value, data) {
        this.$router.push('/pages/logs/' + data.item.log)
      },
      getErrorLine (msg) {
        const trimmedString = msg.substring(0, 100).replace(/(\\r)*\\n/g, '\n') + '......'
        return trimmedString
      },
    },
  }
</script>
<style lang="sass">
.search-adjust
  width: 200px
</style>s
