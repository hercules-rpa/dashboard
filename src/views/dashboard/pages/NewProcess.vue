<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Avaiable Processes"
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
        :items="processes"
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
            v-if="item.setting"
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
  import { ProcessService } from '@/common/api.service'
  export default {
    name: 'NewProcess',

    data () {
      return {
        search: '',
        headers: [
          {
            sortable: true,
            text: 'Process',
            value: 'process_name',
          },
          {
            sortable: true,
            text: 'Process ID',
            value: 'process_id',
          },
          {
            sortable: false,
            text: 'Description',
            value: 'process_description',
          },
          {
            sortable: false,
            text: 'Capable Robots',
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
      ProcessService.query()
        .then(response => {
          console.log(response.data)
          this.processes = response.data
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
        this.$router.push('/pages/settings')
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
