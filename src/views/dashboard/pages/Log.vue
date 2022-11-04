<template>
  <div>
    <v-container
      id="log"
      fluid
      tag="section"
    >
      <v-card
        class="px-5 py-3"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-information
          </v-icon>Información de Log
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
                Información de ejecución:
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Proceso: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ log.process_name }}</span>
              </div>
              <div>
                <v-progress-linear
                  v-model="log.completed"
                  height="25"
                  readonly
                  :color="log.finished ? 'green' : 'yellow'"
                  class="mt-2 v-progress-linear"
                >
                  <strong>{{ Math.ceil(log.finished ? 100 : log.completed) }}%</strong>
                </v-progress-linear>
              </div>
              <div class="mt-2">
                <span class="text-subtitle-1 font-weight-light">Estado: </span>
                <span
                  class="text-subtitle-1 font-weight-normal"
                  :class="[log.finished ? 'green--text' : 'yellow--text']"
                >{{ log.finished ? 'FINALIZADO' : 'EN PROGRESO' }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Resultado: </span>
                <span
                  class="text-subtitle-1 font-weight-normal"
                  :class="[log.state == 'ERROR' ? 'red--text' : 'green--text']"
                >{{ log.state }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">ID de Planificación: </span>
                <router-link
                  class="blue--text text--darken-3"
                  :to="{ path: '/pages/executions/'+log.id_schedule }"
                >
                  {{ log.id_schedule }}
                </router-link>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Información de proceso:
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Log ID: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ log.id }}</span>
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
            </v-col>
          </v-row>
          <v-row>
            <v-card-text>
              <div>
                <v-textarea
                  autofocus
                  rows="20"
                  row-height="30"
                  outlined
                  readonly
                  name="input-7-4"
                  :label="'Proceso : ' + log.process_name"
                  :value="log.data.replace(/(\\r)*\\n/g, '\n')"
                />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue"
                class="mb-5 ml-3"
                dark
                @click="downloadLog(lData)"
              >
                Descargar Log<v-icon class="ml-3">
                  mdi-download
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>
<script>
  import { LogsService } from '@/common/api.service'
  import moment from 'moment'
  export default {
    name: 'Robot',
    data () {
      return {
        finStatus: false,
        timerid: undefined,
        dialog: false,
        lData: {
          logText: '',
          robot: '',
          processId: '',
          processName: '',
          idLog: 0,
        },
        log: {
        },
      }
    },
    mounted: function () {
      LogsService.get(this.$route.params.idLog)
        .then(response => {
          console.log(response.data)
          this.log = response.data
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
          LogsService.get(this.$route.params.idLog)
            .then(response => {
              console.log(response.data)
              this.log = response.data
            })
            .catch(error => {
              throw new Error(error)
            })
        }, 1000)
      },
      formatDate (time) {
        return moment(time * 1000).format('DD/MM/YYYY HH:mm:ss')
      },
      getLog (idLog) {
        this.dialog = true
        this.timerid = setInterval(() => {
          if (this.finStatus === false) {
            LogsService
              .get(idLog)
              .then((response) => {
                this.finStatus = response.data.finished
                this.lData.logText = response.data.data.replace(/(\\r)*\\n/g, '\n')
                this.lData.robot = response.data.id_robot
                this.lData.processName = response.data.process_name
                this.lData.processId = response.data.id_process
                this.lData.idLog = idLog
                console.log(response.data)
              })
              .catch((error) => {
                throw new Error(error)
              })
          } else {
            clearInterval(this.timerid)
            // this.modFiles();
          }
        }, 1000)
      },
      downloadLog (lData) {
        const link = document.createElement('a')
        const blob = new Blob([this.log.data.replace(/(\\r)*\\n/g, '\n')], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = this.log.process_name + '_' + this.log.id_robot + this.log.id + '.log'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },
  }
</script>
<style lang="sass">
.pattern-ray
  background-color: #e5e5f7
  opacity: 0.5
.v-progress-linear
  width: 200px
</style>
