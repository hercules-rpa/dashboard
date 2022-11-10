<template>
  <div>
    <v-container
      id="schedules-actives"
      fluid
      tag="section"
    >
      <base-material-card
        icon="mdi-calendar-check"
        title="Planificaciones Activas"
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
          :items="schedules"
          single-select
          :search="search"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @dblclick:row="goToExecution"
        >
          <template v-slot:[`item.id_robot`]="{ item }">
            <router-link
              v-if="item.id_robot !== null"
              class="blue--text text--darken-3"
              :to="{ path: '/pages/robots/'+item.id_robot }"
            >
              {{ item.id_robot }}
            </router-link><span v-else>
              Ningún robot asignado
            </span>
          </template>
          <template v-slot:[`item.id`]="{ item }">
            <router-link
              class="blue--text text--darken-3"
              :to="{ path: '/pages/executions/'+item.id }"
            >
              {{ item.id }}
            </router-link>
          </template>
          <template v-slot:[`item.created`]="{ item }">
            {{ item.created | date }}
          </template>
          <template v-slot:[`item.next_run`]="{ item }">
            {{ item.next_run | date }}
          </template>
          <template v-slot:[`item.time_schedule`]="{ item }">
            {{ item.time_schedule != null ? item.time_schedule.tag : 'Instant' }}
          </template>
          <template v-slot:[`item.controls`]="{ item }">
            <v-btn
              class="ma-2"
              outlined
              x-small
              fab
              color="primary"
              @click="goToEditSchedule(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ma-2"
              outlined
              x-small
              fab
              color="red"
              @click="showModalDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </base-material-card>
      <div class="py-3" />
    </v-container>
    <v-dialog
      v-model="dialog3"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          Estás segur@?

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog3 = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            class="mr-3"
            text
            @click="dialog3 = false"
          >
            No
          </v-btn>

          <v-btn
            color="success"
            text
            @click="deleteSchedule(scheduleId)"
          >
            Sí
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { SchedulesService } from '@/common/api.service'
  export default {
    name: 'NewProcess',
    data () {
      return {
        sortBy: 'created',
        sortDesc: true,
        search: '',
        dialog3: false,
        dialogEdit: false,
        scheduleId: '',
        schedule: {},
        processDesc: {},
        generalOptions: {},
        timeSchedule: {},
        headers: [
          {
            sortable: true,
            text: 'ID Planificación',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Proceso',
            value: 'process_name',
          },
          {
            sortable: false,
            text: 'Descripción',
            value: 'description',
          },
          {
            sortable: false,
            text: 'Creado',
            value: 'created',
          },
          {
            sortable: false,
            text: 'Siguiente ejecución',
            value: 'next_run',
          },
          {
            sortable: false,
            text: 'Planificación',
            value: 'time_schedule',
          },
          {
            sortable: false,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            text: '',
            value: 'controls',
            sortable: false,
          },
        ],
        schedules: [],
        aschedules: [
          {
            process_id: 1,
            process_class_name: 'ProcessHolaMundo',
            process_name: 'Hola Mundo',
            schedule_description: 'Cada quince dias',
            robot: 'robotremote1',
            created: '1620821712',
            status: 'RUNNING',
          },
          {
            process_id: 2,
            process_class_name: 'ProcessComposeTest',
            process_name: 'Process Compose Test',
            schedule_description: 'cada 10 segundos',
            robot: 'robotremote1',
            created: '1620821712',
            status: 'FINISHED',
          },
          {
            process_id: 3,
            process_class_name: 'ProcessSendMail',
            process_name: 'Process Send Mail',
            schedule_description: 'sabados a las 20:00',
            robot: 'robotedu',
            created: '1620821712',
            status: 'FINISHED',
          },
          {
            process_id: 4,
            process_class_name: 'ProcessSeleniumTSLA',
            process_name: 'Process Selenium TSLA',
            schedule_description: null,
            robot: 'robotMacBook',
            created: '1620821712',
            status: 'ABORTED',
          },
        ],
      }
    },
    computed: {

    },
    mounted: function () {
      this.loadTable()
    },
    methods: {
      loadTable () {
        SchedulesService.query({ params: { active: true } })
          .then(response => {
            this.schedules = response.data
          })
          .catch(error => {
            throw new Error(error)
          })
      },
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
        this.$router.push('/pages/executions/' + data.item.id)
      },
      showModalDelete (schedule) {
        this.dialog3 = true
        this.scheduleId = schedule.id
      },
      goToEditSchedule (schedule) {
        this.$router.push('/pages/schedules/' + schedule.id + '/edit')
      },
      deleteSchedule (id) {
        SchedulesService.delete(id).then(
          response => {
            this.dialog3 = false
            this.loadTable()
          },
        )
      },
    },
  }
</script>
<style lang="sass">
.search-adjust
  width: 200px
</style>
