<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Execution Problems"
      class="px-5 py-3"
    >
      <v-text-field
        v-model="search"
        class="mb-5 search-adjust"
        append-icon="mdi-magnify"
        label="Search"
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
        headers: [
          {
            sortable: true,
            text: 'Process',
            value: 'process_name',
          },
          {
            sortable: false,
            text: 'Schedule',
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
            text: 'time',
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
          console.log(response.data)
          this.problems = response.data
        })
        .catch(error => {
          alert('Ha ocurrido un error', error)
        })
    },
    methods: {
      complete (index) {
        console.log('ventana nuevo proceso')
      },
      goToProblem (value, data) {
        console.log(value)
        console.log(data)
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
</style>
