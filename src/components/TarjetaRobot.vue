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
            @click="dialog = false"
          >
            Descargar
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

    <base-material-card
      min-width="320"
      :icon="icon"
      class="v-card--material-robot"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:after-heading>
        <div class="ml-auto text-right">
          <h5 class="text-h4 grey--text text--darken-1">
            {{ robotName }}
          </h5>
          <h5 class="text-h4 grey--text text--darken-1">
            id:{{ robotId }}
          </h5>
          <h3 class="text-h4 font-weight-light text--primary">
            IP : {{ ipAddress }} <v-progress-circular
              v-if="!online"
              indeterminate
              class="ml-2 mb-1"
              color="red"
              size="15"
              width="1"
            />
          </h3>
        </div>
      </template>
      <v-col
        cols="12"
        class="mt-5"
      >
        <span
          v-if="process !== null && online"
          style="color: green"
          class="text-h5 font-weight-light"
        >
          Ejecutando proceso...
        </span><span
          v-else-if="!online"
          class="text-h5 font-weight-light red--text text--darken-2"
        >
          INTENTANDO RECONECTAR...
        </span><span
          v-else
          style="color: #9d6500"
          class="text-h5 font-weight-light"
        >
          LIBRE
        </span>
      </v-col>
      <v-col
        cols="12"
        class="pb-5"
      >
        <span v-if="process !== null && online">
          Proceso {{ process.id }}: {{ process.name }}
          <v-btn
            color="blue"
            class="ml-5"
            dark
            x-small
            @click.prevent="$emit('clickButton',$event,process.id_log)"
          >
            mostrar log
            <v-icon
              class="ml-1"
            >
              mdi-eye
            </v-icon>
          </v-btn>
        </span><span v-else-if="process === null && online">
          Esperando nuevos procesos
        </span><span v-else>
          Última vez online : {{ lastSeen | date }}
        </span>
      </v-col>
      <v-col
        cols="12"
        class="px-0"
      >
        <v-divider />
      </v-col>
      <div
        v-if="online"
        class="text-subtitle1 grey-text font-weight-light"
      >
        <v-icon
          color="green"
          size="30"
          class="mr-2"
        >
          mdi-check-circle
        </v-icon>
        online
      </div>
      <div
        v-else
        class="text-subtitle1 grey--text text--darken-1"
      >
        <v-icon
          color="red"
          size="30"
          class="mr-2"
        >
          mdi-alert-circle
        </v-icon>
        offline
      </div>
    </base-material-card>
  </div>
</template>
<script>
  import Card from '../components/base/Card'
  import { LogsService } from '@/common/api.service'
  export default {
    name: 'TarjetaRobot',
    inheritAttrs: false,
    props: {
      ...Card.props,
      icon: {
        type: String,
        required: true,
      },
      robotName: {
        type: String,
        default: undefined,
      },
      robotId: {
        type: String,
        default: undefined,
      },
      ipAddress: {
        type: String,
        default: undefined,
      },
      process: {
        type: String,
        default: undefined,
      },
      online: {
        type: Boolean,
        default: undefined,
        required: true,
      },
      lastSeen: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        finStatus: false,
        logData: '',
        timerid: undefined,
        dialog: false,
        lData: {
          logText: '',
          robot: '',
          processId: '',
          processName: '',
        },
      }
    },
    methods: {
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
    },
  }
</script>

<style lang="sass">
.v-card--material-robot
  display: flex
  flex-wrap: wrap
  position: relative

  > div:first-child
    justify-content: space-between

  .v-card
    border-radius: 4px
    flex: 0 1 auto

  .v-card__text
    display: inline-block
    flex: 1 0 calc(100% - 120px)
    position: absolute
    top: 0
    right: 0
    width: 100%

  .v-card__actions
    flex: 1 0 100%
  .clase-div
    width: 100%
</style>
