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
              :label="'Process : ' + lData.processName"
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
            @click="goToLog()"
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
      id="robots"
      fluid
      tag="section"
    >
      <v-checkbox
        v-model="showOffline"
        :label="`Mostrar robots Offline`"
      />
      <v-row>
        <v-col
          v-for="robot in robotsOnline"
          :key="robot"
          cols="12"
          sm="3"
          md="4"
        >
          <v-hover>
            <tarjeta-robot
              hover
              :color="robot.online ? 'green':'red'"
              d-flex
              icon="mdi-robot"
              :robot-name="`${robot.robot_name}`"
              :robot-id="`${robot.robot_id}`"
              :ip-address="`${robot.robot_address}`"
              :process="robot.process_running"
              :online="robot.online"
              :last-seen="robot.last_seen"
              :to="`/pages/robots/${robot.robot_id}`"
              @clickButton="prueba"
            />
          </v-hover>
        </v-col>
      </v-row>
      <v-row v-if="showOffline">
        <v-divider />
      </v-row>
      <v-row v-if="showOffline">
        <v-col
          v-for="robot in robotsOffline"
          :key="robot"
          cols="12"
          sm="3"
          md="4"
        >
          <v-hover>
            <tarjeta-robot
              hover
              :color="robot.online ? 'green':'red'"
              d-flex
              icon="mdi-robot"
              :robot-name="`${robot.robot_name}`"
              :robot-id="`${robot.robot_id}`"
              :ip-address="`${robot.robot_address}`"
              :process="robot.process_running"
              :online="robot.online"
              :last-seen="robot.last_seen"
              :to="`/pages/robots/${robot.robot_id}`"
              @click="prueba"
            />
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import TarjetaRobot from '../../../components/TarjetaRobot'
  import { RobotsService, LogsService } from '@/common/api.service'
  export default {
    name: 'Robots',
    components: { TarjetaRobot },

    data () {
      return {
        polling: null,
        finStatus: false,
        robots: [],
        robotsOffline: [],
        robotsOnline: [],
        showOffline: true,
        timerid: undefined,
        dialog: false,
        idLog: 0,
        lData: {
          logText: '',
          robot: '',
          processId: '',
          processName: '',
        },
      }
    },
    mounted: function () {
      RobotsService.query().then(response => {
        this.robots = response.data
        this.robots.forEach(robot => {
          robot.online ? this.robotsOnline.push(robot) : this.robotsOffline.push(robot)
        })
      }).catch(error => {
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
      goToLog () {
        this.$router.push('/pages/logs/' + this.idLog)
      },
      downloadLog (lData) {
        const link = document.createElement('a')
        const blob = new Blob([lData.logText], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = lData.processName + '_' + lData.robot + '_' + this.idLog + '.log'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      prueba (evt, idLog) {
        console.log(idLog)
        this.getLog(idLog)
        this.idLog = idLog
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
              })
              .catch((error) => {
                throw new Error(error)
              })
          } else {
            clearInterval(this.timerid)
          }
        }, 1000)
      },
      pollData () {
        this.polling = setInterval(() => {
          RobotsService.query().then(response => {
            this.robots = response.data

            for (var i = 0; i < this.robotsOnline.length; i++) {
              for (var j = 0; j < this.robots.length; j++) {
                if (this.robotsOnline[i].robot_id === this.robots[j].robot_id) {
                  this.$set(this.robotsOnline, i, this.robots[j])
                }
              }
            }

            for (var k = 0; k < this.robotsOffline.length; k++) {
              for (var l = 0; l < this.robots.length; l++) {
                if (this.robotsOffline[k].robot_id === this.robots[l].robot_id) {
                  this.$set(this.robotsOffline, k, this.robots[l])
                }
              }
            }

            // this.robotsOnline = []
            // this.robotsOffline = []
          }).catch(error => {
            throw new Error(error)
          })
        }, 2000)
      },
    },
  }
</script>
