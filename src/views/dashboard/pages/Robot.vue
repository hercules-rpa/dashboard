<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="80%"
    >
      <v-card class="text-center">
        <v-card-title>
          {{ lData.robot }} Ejecutando proceso

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <v-textarea
              autofocus
              rows="20"
              row-height="30"
              outlined
              readonly
              name="input-7-4"
              :label="'Proceso : ' + lData.processName"
              :value="lData.logText"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            text
            @click="downloadLog(lData)"
          >
            Descargar
          </v-btn>
          <v-btn
            color="green"
            text
            @click="goToLog(lData)"
          >
            Ir al Log
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container
      id="new-process"
      fluid
      tag="section"
    >
      <v-card
        :class="[!robot.online ? 'pattern-ray' : '']"
        class="px-5 py-3"
      >
        <v-card-title>
          <v-icon
            class="mr-3"
            :color="robot.online ? 'green' : 'red'"
          >
            mdi-robot
          </v-icon>{{ robot.name }}
          <v-chip
            class="ma-2"
            :color="robot.online ? 'green' : 'red'"
            text-color="white"
          >
            {{ robot.online ? 'Online' : 'Offline' }}
            <v-icon right>
              {{ robot.online ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </v-chip>
          <v-btn
            color="blue"
            class="ma-2"
            small
            disabled
            rounded
            @click="updateRobot()"
          >
            Actualizar Robot
            <v-icon
              class="ml-1"
            >
              mdi-update
            </v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="ma-2"
            disabled
            small
            rounded
            @click="resetRobot()"
          >
            Reset
            <v-icon
              class="ml-1"
            >
              mdi-power
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle class="mt-1">
          <div>id:{{ robot.id }}</div>
          <div
            v-if="!robot.online"
            class="red--text pt-3"
          >
            Reconectando... <v-progress-circular
              v-if="!robot.online"
              indeterminate
              class="ml-2 mb-1"
              color="red"
              size="15"
              width="1"
            />
          </div>
        </v-card-subtitle>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              cols="12"
              md="3"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Datos técnicos:
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">IP Address: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ robot.ip_address }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Os: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ robot.os }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">MAC: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ robot.mac }}</span>
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">Python ver: </span>
                <span class="text-subtitle-1 font-weight-thin">{{ robot.python_version }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Localizaciones:
              </div>
              <div>
                <span class="text-subtitle-1 font-weight-light">{{ robot.registrations }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Estado:
              </div>
              <div>
                <v-icon
                  :color="robot.online ? 'green' : 'red'"
                >
                  {{ robot.online ? 'mdi-thumb-up' : 'mdi-thumb-down' }}
                </v-icon>
                <v-progress-circular
                  v-if="!robot.online"
                  indeterminate
                  class="ml-2 mb-1"
                  color="red"
                  size="15"
                  width="1"
                />
              </div>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <div class="text-subtitle-1 font-weight-medium mb-2">
                Problemas:
              </div>
              <div
                v-for="problem in robot.problems"
                :key="problem"
              >
                <router-link
                  :to="{ path: '/pages/logs/'+problem.log }"
                  class="text-subtitle-1 font-weight-light red--text"
                >
                  <span class="text-subtitle-1 font-weight-light red--text">{{ getErrorLine(problem.msg) }} {{ problem.ts | date }}</span>
                </router-link>
                <v-btn
                  color="blue"
                  class="ma-2"
                  dark
                  x-small
                  rounded
                  outlined
                  @click="getLog(problem.log)"
                >
                  log
                  <v-icon
                    class="ml-1"
                  >
                    mdi-eye
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card
        class="px-5 py-3"
        :class="[!robot.online ? 'pattern-ray' : '']"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-monitor
          </v-icon>Estado actual
        </v-card-title>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              cols="12"
              md="4"
            >
              <router-link
                v-if="process_running != null"
                :to="{ path: '/pages/robot/'+robot.id+'/executions' }"
                class="text-subtitle-1 font-weight-medium black--text"
              >
                Ejecutando proceso:
              </router-link><span
                v-else
                class="text-subtitle-1 font-weight-medium black--text"
              >
                Ejecutando proceso:
              </span>
              <div class="mt-5">
                <div v-if="robot.process_running !== null">
                  <div>
                    <span class="text-subtitle-1 font-weight-light">Proceso: </span>
                    <span class="text-subtitle-1 font-weight-thin">{{ robot.process_running !== null ? robot.process_running.name : '' }}</span>
                  </div>
                  <div v-if="robot.process_running !== null">
                    <v-progress-linear
                      v-if="robot.process_running !== null"
                      v-model="robot.process_running.completed"
                      height="25"
                      readonly
                      class="mt-2 v-progress-linear"
                    >
                      <strong>{{ Math.ceil(robot.process_running !== null ? robot.process_running.completed : 0) }}%</strong>
                    </v-progress-linear>
                  </div>
                  <div>
                    <v-btn
                      color="blue"
                      class="mt-4"
                      dark
                      small
                      rounded
                      @click="getLog(robot.process_running.id_log)"
                    >
                      mostrar log
                      <v-icon
                        class="ml-1"
                      >
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
                <div v-else>
                  <span class="text-subtitle-1 font-weight-light">Ningún proceso en cola</span>
                  <div v-if="robot.online">
                    <span class="green--text text-subtitle-1 font-weight-light">esperando nuevos procesos...</span>
                  </div><div v-else>
                    <span class="red--text text-subtitle-1 font-weight-light">robot offline</span>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <router-link
                :to="{ path: '/pages/robot/'+robot.id+'/executions' }"
                class="text-subtitle-1 font-weight-medium black--text"
              >
                Procesos en cola:
              </router-link>
              <div class="mt-5">
                <div
                  v-for="exec in robot.process_queue"
                  :key="exec"
                >
                  <router-link
                    :to="{ path: '/pages/logs/'+exec.log }"
                    class="blue--text text-subtitle-1 font-weight-light"
                  >
                    {{ exec.process }} {{ exec.ts | date }}
                  </router-link>
                  <span>
                    <v-btn
                      class="ma-2"
                      x-small
                      outlined
                      color="red"
                      @click="showModalDelete(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </span>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <router-link
                :to="{ path: '/pages/robot/'+robot.id+'/executions' }"
                class="text-subtitle-1 font-weight-medium black--text"
              >
                Últimas ejecuciones:
              </router-link>
              <div class="mt-5">
                <div
                  v-for="exec in robot.last_executions"
                  :key="exec"
                >
                  <router-link
                    :to="{ path: '/pages/logs/'+exec.log }"
                    :class="[ exec.success ? 'green--text':'red--text' ]"
                    class="text-subtitle-1 font-weight-light"
                  >
                    {{ exec.process }} - {{ exec.ts | date }}
                  </router-link>
                  <span>
                    <v-btn
                      color="blue"
                      class="ma-2"
                      dark
                      x-small
                      outlined
                      rounded
                      @click="getLog(exec.log)"
                    >
                      log
                      <v-icon
                        class="ml-1"
                      >
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card
        class="px-5 py-3"
        :class="[!robot.online ? 'pattern-ray' : '']"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-chart-bar
          </v-icon>Historial del robot
        </v-card-title>
        <v-container
          class="px-5 py-3"
        >
          <v-data-table
            :headers="headers"
            :items="robotLogs"
            single-select
            :search="search"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items-per-page="5"
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
              <div :class="[item.finished ? 'green--text' : 'yellow--text']">
                {{ item.finished ? 'FINALIZADO' : 'EJECUTANDO' }}
              </div>
            </template>
            <template v-slot:[`item.state`]="{ item }">
              <div :class="[item.state == 'OK' ? 'green--text' : 'red--text']">
                {{ item.state }}
              </div>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
      <v-row>
        <v-col
          cols="12"
          lg="4"
        >
          <v-card
            class="px-5 py-3"
            :class="[!robot.online ? 'pattern-ray' : '']"
          >
            <v-card-title>
              <v-icon class="mr-3">
                mdi-chip
              </v-icon>Uso de CPU
            </v-card-title>
            <v-container
              class="py-0"
            >
              <v-row class="mt-5 mb-5">
                <v-col
                  cols="12"
                  md="12"
                >
                  <apexchart
                    height="300"
                    type="line"
                    :options="cpuChartApex.options"
                    :series="cpuChartApex.series"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          lg="4"
        >
          <v-card
            class="px-5 py-3"
            :class="[!robot.online ? 'pattern-ray' : '']"
          >
            <v-card-title>
              <v-icon class="mr-3">
                mdi-memory
              </v-icon>Uso de memoria(RAM)
            </v-card-title>
            <v-container
              class="py-0"
            >
              <v-row class="mt-5 mb-5">
                <v-col
                  cols="12"
                  md="12"
                >
                  <apexchart
                    height="300"
                    type="line"
                    :options="ramChartApex.options"
                    :series="ramChartApex.series"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          lg="4"
        >
          <v-card
            class="px-5 py-3"
            :class="[!robot.online ? 'pattern-ray' : '']"
          >
            <v-card-title>
              <v-icon class="mr-3">
                mdi-disc
              </v-icon>Uso de disco
            </v-card-title>
            <v-container
              class="py-0"
            >
              <v-row class="mt-5 mb-5">
                <v-col
                  cols="12"
                  md="12"
                >
                  <apexchart
                    height="300"
                    type="line"
                    :options="diskChartApex.options"
                    :series="diskChartApex.series"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import { RobotsService, LogsService } from '@/common/api.service'
  export default {
    name: 'Robot',
    data () {
      return {
        finStatus: false,
        polling: null,
        timerid: undefined,
        loading: true,
        dialog: false,
        lData: {
          logText: '',
          robot: '',
          processId: '',
          processName: '',
          idLog: 0,
        },
        cpuChartApex: {
          options: {
            title: {
            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              tickAmount: 20,
              categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            },
            colors: ['#7d3c52'],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: true,
                    position: 'bottom',
                  },
                },
              },
            ],
          },
          series: [{
            name: 'uso-cpu',
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          }],
        },
        ramChartApex: {
          options: {
            title: {
            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              tickAmount: 20,
              categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            },
            colors: ['#528254'],
          },
          series: [{
            name: 'uso-ram',
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          }],
        },
        diskChartApex: {
          options: {
            title: {

            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              tickAmount: 20,
              categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            },
            colors: ['#0e8c9c'],
          },
          series: [{
            name: 'uso-disco',
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          }],
        },
        cpuChart: {
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 50,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        ramChart: {
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        diskChart: {
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 50,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        robot: {},
        robotLogs: [],
        processQueue: [],
        sortBy: 'end_time',
        sortDesc: true,
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
          },
          {
            sortable: false,
            text: 'Planificación',
            value: 'id_schedule',
          },
          {
            sortable: false,
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
            sortable: false,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            sortable: false,
            text: 'Estado',
            value: 'finished',
          },
          {
            sortable: true,
            text: 'Resultado',
            value: 'state',
          },
        ],
        queueHeaders: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
          },
        ],
      }
    },
    mounted: function () {
      RobotsService.get(this.$route.params.idRobot)
        .then(response => {
          this.robot = response.data
          this.cpuChart.data.series[0] = this.robot.stats.cpu
          this.cpuChartApex.series[0].data = this.robot.stats.cpu.map(el => el.toFixed(1))
          this.ramChartApex.series[0].data = this.robot.stats.ram.map(el => el.toFixed(1))
          this.diskChartApex.series[0].data = this.robot.stats.disk.map(el => el.toFixed(1))

          this.cpuChart.options.high = Math.max.apply(null, this.robot.stats.cpu)
          this.ramChart.data.series[0] = this.robot.stats.ram
          this.ramChart.options.high = Math.max.apply(null, this.robot.stats.ram)
          this.diskChart.data.series[0] = this.robot.stats.disk
          this.diskChart.options.high = Math.max.apply(null, this.robot.stats.disk)
          this.loading = false
        })
        .catch(error => {
          throw new Error(error)
        })
      RobotsService.getRobotLogs(this.$route.params.idRobot)
        .then(response => {
          this.robotLogs = response.data
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
      resetRobot () {
        RobotsService.resetRobot(this.robot.id)
          .then(response => {
            console.log(response.data)
          }).catch(error => {
            alert('Ha ocurrido un error reseteando el robot', error)
          })
      },
      updateRobot () {
        RobotsService.updateRobot(this.robot.id)
          .then(response => {
            console.log(response.data)
          }).catch(error => {
            alert('Ha ocurrido un error actualizando el robot', error)
          })
      },
      pollData () {
        this.polling = setInterval(() => {
          RobotsService.get(this.$route.params.idRobot)
            .then(response => {
              this.robot = response.data
            })
            .catch(error => {
              throw new Error(error)
            })
        }, 1000)
      },
      getLog (idLog) {
        this.dialog = true
        this.finStatus = false
        this.timerid = setInterval(() => {
          if (this.finStatus === false && this.dialog === true) {
            LogsService
              .get(idLog)
              .then((response) => {
                this.finStatus = response.data.finished
                this.lData.logText = response.data.data.replace(/(\\r)*\\n/g, '\n')
                this.lData.robot = response.data.id_robot
                this.lData.processName = response.data.process_name
                this.lData.processId = response.data.id_process
                this.lData.idLog = idLog
              })
              .catch((error) => {
                this.dialog = false
                this.finStatus = true
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
        const blob = new Blob([lData.logText], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = lData.processName + '_' + lData.robot + '_' + lData.idLog + '.log'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      goToExecution (value, data) {
        this.$router.push('/pages/logs/' + data.item.id)
      },
      getErrorLine (msg) {
        const trimmedString = msg.substring(0, 10).replace(/(\\r)*\\n/g, '\n') + '......'
        return trimmedString
      },
      goToLog (logData) {
        this.$router.push('/pages/logs/' + logData.idLog)
      },
    },
  }
</script>
<style lang="sass">
.pattern-ray
  background-color: #e5e5f7
  opacity: 0.6
.v-progress-linear
  width: 200px
</style>
