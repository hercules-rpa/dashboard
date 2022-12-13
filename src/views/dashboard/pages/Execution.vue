<template>
  <div>
    <v-container
      id="execution"
      fluid
      tag="section"
    >
      <v-card
        class="px-5 py-3"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-update
          </v-icon>Información de Ejecución - {{ schedule.id }}
        </v-card-title>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Información de planificación:
              </div>
              <div v-if="schedule.time_schedule != null">
                <div>
                  <span class="text-subtitle-1 font-weight-light">Cada: </span>
                  <span class="text-subtitle-1 font-weight-thin">{{ schedule.time_schedule.every[0] }} {{ schedule.time_schedule.every[1] }}</span>
                </div>
                <div>
                  <span class="text-subtitle-1 font-weight-light">a: </span>
                  <span class="text-subtitle-1 font-weight-thin">{{ schedule.time_schedule.at }}</span>
                </div>
                <div>
                  <span class="text-subtitle-1 font-weight-light">Repetir: </span>
                  <span class="text-subtitle-1 font-weight-thin">{{ schedule.time_schedule.forever }}</span>
                </div>
                <div>
                  <span class="text-subtitle-1 font-weight-light">Descripción: </span>
                  <span class="text-subtitle-1 font-weight-thin">{{ schedule.time_schedule.tag }}</span>
                </div>
              </div><div v-else>
                <div>
                  <span class="text-subtitle-1 font-weight-light">Descripción: </span>
                  <span class="text-subtitle-1 font-weight-thin">Instantaneo</span>
                </div>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">ID de Planificación: </span>
                <router-link
                  class="blue--text text--darken-3"
                  :to="{ path: '/pages/executions/'+schedule.id }"
                >
                  {{ schedule.id }}
                </router-link>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Información de Log de Proceso:
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">ID de Log: </span>
                <router-link
                  class="blue--text text--darken-3"
                  :to="{ path: '/pages/logs/'+log.id }"
                >
                  {{ log.id }}
                </router-link>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Robot: </span>
                <router-link
                  class="blue--text text--darken-3"
                  :to="{ path: '/pages/robots/'+log.id_robot }"
                >
                  {{ log.id_robot }}
                </router-link>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Inicio: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ log.start_time | date }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Fin: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ !log.finished ? '------' : formatDate(log.end_time) }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Estado: </span>
                <span
                  class="text-subtitle-1 font-weight-normal"
                  :class="[log.finished ? 'green--text text--darken-3' : 'yellow--text text--darken-3']"
                >{{ log.finished ? 'FINALIZADO' : 'EN PROGRESO' }}</span>
              </div>
              <div>
                <v-progress-linear
                  v-model="log.completed"
                  height="20"
                  width="10"
                  :color="log.finished ? 'green' : 'yellow'"
                  readonly
                  class="mt-2 v-progress-linear"
                >
                  <strong>{{ Math.ceil(log.finished ? 100 : log.completed) }}%</strong>
                </v-progress-linear>
              </div>
              <div class="mt-2">
                <div>
                  <span class="text-subtitle-1 font-weight-light">Resultado: </span>
                  <span
                    class="text-subtitle-1 font-weight-normal"
                    :class="[log.state == 'ERROR' ? 'red--text text--darken-2' : 'green--text text--darken-3']"
                  >{{ log.state }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-card-text>
                <div>
                  <v-textarea
                    autofocus
                    rows="20"
                    row-height="30"
                    outlined
                    readonly
                    name="input-7-4"
                    :label="'Process : ' + log.process_name"
                    :value="log.data.replace(/(\\r)*\\n/g, '\n')"
                  />
                </div>
              </v-card-text>
              <v-card-actions left>
                <v-spacer />
                <v-btn
                  color="blue"
                  class="mb-5 ml-3"
                  dark
                  @click="downloadLog(log)"
                >
                  Download Log<v-icon class="ml-3">
                    mdi-download
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-card-text>
                <div>
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
                    :items="schedule.logs"
                    single-select
                    :search="search"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :loading="loading"
                    loading-text="Cargando datos...por favor espere"
                    @click:row="getLog"
                    @dblclick:row="goToLog"
                  >
                    <template v-slot:[`item.state`]="{ item }">
                      <div :class="[item.state == 'OK' ? 'green--text text--darken-3' : 'red--text text--darken-2']">
                        {{ item.state }}
                      </div>
                    </template>
                    <template v-slot:[`item.start_time`]="{ item }">
                      {{ item.start_time | date }}
                    </template>
                    <template v-slot:[`item.id_robot`]="{ item }">
                      <router-link
                        class="blue--text text--darken-3"
                        :to="{ path: '/pages/robots/'+log.id_robot }"
                      >
                        {{ item.id_robot }}
                      </router-link>
                    </template>
                    <template v-slot:[`item.end_time`]="{ item }">
                      {{ item.end_time | date }}
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>
<script>
  import { LogsService, SchedulesService } from '@/common/api.service'
  import moment from 'moment'
  export default {
    name: 'Robot',
    data () {
      return {
        search: '',
        finStatus: false,
        timerid: undefined,
        sortBy: 'end_time',
        sortDesc: true,
        loading: true,
        log: {
          data: '',
        },
        schedule: {},
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
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
            sortable: false,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            sortable: false,
            text: 'Resultado',
            value: 'state',
          },
        ],
      }
    },
    mounted: function () {
      SchedulesService.get(this.$route.params.idSchedule)
        .then(response => {
          this.schedule = response.data
          this.getLogSimple(this.schedule.logs[0])
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    created () {
      this.pollData()
    },
    beforeDestroy () {
      clearInterval(this.polling)
    },
    methods: {
      pollData () {
        this.polling = setInterval(() => {
          SchedulesService.get(this.$route.params.idSchedule)
            .then(response => {
              this.schedule = response.data
              if (this.schedule.logs.length <= 1) {
                this.getLogSimple(this.schedule.logs[0])
              }
              this.loading = false
            })
            .catch(error => {
              throw new Error(error)
            })
        }, 1000)
      },
      getLog (value, event) {
        event.select(true)
        LogsService.get(value.id).then((response) => {
          this.log = response.data
        })
          .catch((error) => {
            throw new Error(error)
          })
      },
      getLogSimple (value) {
        LogsService.get(value.id).then((response) => {
          this.log = response.data
        })
          .catch((error) => {
            throw new Error(error)
          })
      },
      goToLog (value, data) {
        this.$router.push('/pages/logs/' + data.item.id)
      },
      formatDate (time) {
        return moment(time * 1000).format('DD/MM/YYYY HH:mm:ss')
      },
      downloadLog (log) {
        const link = document.createElement('a')
        const blob = new Blob([this.log.data.replace(/(\\r)*\\n/g, '\n')], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = this.log.process_name + '_' + this.log.id_robot + '_' + this.log.id + '.log'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },
  }
</script>
<style lang="sass" scoped>
.pattern-ray
  background-color: #e5e5f7
  opacity: 0.5
.v-progress-linear
  width: 200px
::v-deep tr
  cursor: pointer
.search-adjust
  width: 200px
</style>
