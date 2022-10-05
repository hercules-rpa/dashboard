<template>
  <div>
    <v-container
      id="form"
      fluid
      tag="section"
    >
      <base-material-card
        icon="mdi-cog"
        :title="this.$i18n.t('globalsettings')"
        class="px-5 py-3"
      >
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              cols="12"
              md="12"
            >
              <FormulateInput
                v-model="settingsType"
                type="select"
                :options="{global: 'Ajustes globales', amqp: 'Ajustes AMQP', dbpersistence: 'BBDD persistencia', dbprocess: 'BBDD Procesos ', dbbi: 'Ajustes BBDD BI', orch: 'Ajustes del Orquestador'}"
                label="Tipo de ajustes"
              />
              <div v-if="settingsType=='global'">
                <FormulateForm
                  v-model="globalSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editGlobalSettings"
                >
                  <FormulateInput
                    type="text"
                    name="edma_ip"
                    hint="Introduce IP or Domain"
                    label="EDMA IP"
                    :placeholder="globalSettings.edma_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="edma_port"
                    label="EDMA PORT"
                    :placeholder="globalSettings.edma_port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="sgi_ip"
                    label="SGI IP"
                    :placeholder="globalSettings.sgi_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="sgi_port"
                    label="SGI PORT"
                    default="8080"
                    :placeholder="globalSettings.sgi_port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="database_ip"
                    label="DATABASE IP"
                    :placeholder="globalSettings.database_ip"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="database_port"
                    label="DATABASE PORT"
                    :placeholder="globalSettings.database_port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    type="submit"
                    :disabled="isLoading"
                    :label="isLoading ? 'Loading...' : 'Save'"
                  />
                </FormulateForm>
              </div>
              <div v-if="settingsType=='amqp'">
                <FormulateForm
                  v-model="amqpSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editAMQPSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    AMQP Settings
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="username"
                    label="username"
                    :placeholder="amqpSettings.username"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="password"
                    :placeholder="amqpSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="host"
                    :placeholder="amqpSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="port"
                    :placeholder="amqpSettings.port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <h3>Subscriptions</h3>
                  <div class="ml-5">
                    <v-btn
                      class="mt-5 mb-5"
                      color="#41b883"
                      @click="amqpSettings.subscriptions.push('New subscription')"
                    >
                      Add Subscription
                    </v-btn>
                    <v-btn
                      class="mt-5 mb-5"
                      color="#41b883"
                      @click="amqpSettings.subscriptions.pop()"
                    >
                      Remove Subscription
                    </v-btn>
                    <FormulateInput
                      v-for="(model, index) in amqpSettings.subscriptions"
                      :key="index"
                      v-model="amqpSettings.subscriptions[index]"
                    />
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="exchange_name"
                    label="Exchange name"
                    :placeholder="amqpSettings.exchange_name"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="queue_name"
                    label="Queue name"
                    :placeholder="amqpSettings.queue_name"
                  />
                  <FormulateInput
                    type="submit"
                    label="Guardar"
                  />
                </FormulateForm>
              </div>
              <div v-if="settingsType=='dbpersistence'">
                <FormulateForm
                  v-model="dbpersistenceSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editDBPersistenceSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    DB Persistence Settings
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="username"
                    label="username"
                    :placeholder="dbpersistenceSettings.username"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="password"
                    :placeholder="dbpersistenceSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="host"
                    :placeholder="dbpersistenceSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="port"
                    :placeholder="dbpersistenceSettings.port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="database"
                    label="Database"
                    :placeholder="dbpersistenceSettings.database"
                  />
                  <FormulateInput
                    type="submit"
                    label="Guardar"
                  />
                </FormulateForm>
              </div>
              <div v-if="settingsType=='dbprocess'">
                <FormulateForm
                  v-model="dbprocessSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editDBProcessSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    DB Process Settings
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="username"
                    label="username"
                    :placeholder="dbprocessSettings.username"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="password"
                    :placeholder="dbprocessSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="host"
                    :placeholder="dbprocessSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="port"
                    :placeholder="dbprocessSettings.port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="database"
                    label="Database"
                    :placeholder="dbprocessSettings.database"
                  />
                  <FormulateInput
                    type="submit"
                    label="Guardar"
                  />
                </FormulateForm>
              </div>

              <div v-if="settingsType=='dbbi'">
                <FormulateForm
                  v-model="dbbiSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editDBBISettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    DB BI Settings
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="username"
                    label="username"
                    :placeholder="dbbiSettings.username"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="password"
                    :placeholder="dbbiSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="host"
                    :placeholder="dbbiSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|localhost/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="port"
                    :placeholder="dbbiSettings.port"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="keyspace"
                    label="Key Space"
                    :placeholder="dbbiSettings.keyspace"
                  />
                  <FormulateInput
                    type="submit"
                    label="Guardar"
                  />
                </FormulateForm>
              </div>

              <div v-if="settingsType=='orch'">
                <FormulateForm
                  v-model="orchestratorSettings"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editOrchestratorSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    Orchestrator Settings
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="id_orch"
                    label="ID ORCHESTRATOR"
                    :placeholder="orchestratorSettings.id_orch"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="name"
                    label="name"
                    :placeholder="orchestratorSettings.name"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="company"
                    label="company"
                    :placeholder="orchestratorSettings.company"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="pathlog_store"
                    label="pathlog_store"
                    :placeholder="orchestratorSettings.pathlog_store"
                  />
                  <FormulateInput
                    type="submit"
                    label="Guardar"
                  />
                </FormulateForm>
              </div>

              <div v-if="test">
                <h3 class="mt-5">
                  globalSettings
                  {{ globalSettings }}
                </h3>
                <h3 class="mt-5">
                  amqpSettings
                  {{ amqpSettings }}
                </h3>
                <h3 class="mt-5">
                  dbpersistenceSettings
                  {{ dbpersistenceSettings }}
                </h3>
                <h3 class="mt-5">
                  dbprocessSettings
                  {{ dbprocessSettings }}
                </h3>
                <h3 class="mt-5">
                  dbbiSettings
                  {{ dbbiSettings }}
                </h3>
                <h3 class="mt-5">
                  orchestratorSettings
                  {{ orchestratorSettings }}
                </h3>
                <h3 class="mt-5">
                  settingsType
                  {{ settingsType }}
                </h3>
                <v-btn
                  color="blue"
                  class="mb-5 ml-3"
                  dark
                  @click="formatTimeSchedule"
                >
                  Download Log<v-icon class="ml-3">
                    mdi-download
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-row />
          </v-row>
        </v-container>
      </base-material-card>
    </v-container>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card class="text-center">
        <v-card-title>
          <span v-if="code === 201">Job Created successful</span><span v-else>Error creating process</span>

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="closeDialog"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="code === 201">
          The process was created correctly, and schedule <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/executions/'+jobData.schedule_id }"
          >
            {{ jobData.schedule_id }}
          </router-link> was assigned, do you want to go to the execution window ?
        </v-card-text><v-card-text v-else>
          Ha ocurrido un error el proceso no se ha podido crear correctamente codigo de error {{ code }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="green"
            text
            @click="goToExecution"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogAlert"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          There are no capable robots to execute this process

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialogAlert = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            color="success"
            text
            @click="dialogAlert = false"
          >
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { SettingsService } from '@/common/api.service'
  export default {
    name: 'Form',
    data () {
      return {
        globalSettings: {},
        amqpSettings: {},
        dbprocessSettings: {},
        dbpersistenceSettings: {},
        dbbiSettings: {},
        orchestratorSettings: {},
        settingsType: {},
        timeSchedule: {},
        foreverValue: false,
        concreteValue: false,
        processParameters: {},
        capableRobots: {},
        processDesc: {},
        params: {},
        tscheduleFormatted: {},
        dialog: false,
        dialogAlert: false,
        test: false,
        testSchema: {},
        jobData: {},
        code: {},
        schema: [],
      }
    },
    mounted: function () {
      SettingsService.getGlobalSettings()
        .then(response => {
          this.globalSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getAMQPSettings()
        .then(response => {
          this.amqpSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getDBPersistenceSettings()
        .then(response => {
          this.dbpersistenceSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getDBProcessSettings()
        .then(response => {
          this.dbprocessSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getDBBISettings()
        .then(response => {
          this.dbbiSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getOrchestratorSettings()
        .then(response => {
          this.orchestratorSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
    },
    methods: {
      async editGlobalSettings () {
        SettingsService.editSettings(this.globalSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      async editAMQPSettings () {
        SettingsService.editAMQPSettings(this.amqpSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      async editDBPersistenceSettings () {
        SettingsService.editDBPersistenceSettings(this.dbpersistenceSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      async editDBProcessSettings () {
        SettingsService.editDBProcessSettings(this.dbprocessSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      async editDBBISettings () {
        SettingsService.editDBBISettings(this.dbbiSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      async editOrchestratorSettings () {
        SettingsService.editOrchestratorSettings(this.orchestratorSettings)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado settings correcto')
              alert('Thank you, settings modified correctly')
            }
          })
          .catch((error) => {
            alert('Error modifying settings')
            throw new Error(error)
          })
      },
      closeDialog () {
        // TODO 1:Revisar esto
        this.dialog = false
        this.$router.push('/pages/newprocess/')
      },
      downloadLog (lData) {
      },
      goToExecution () {
        console.log(this.jobData)
        this.$router.push('/pages/executions/' + this.jobData.schedule_id)
      },
      formatTimeSchedule () {
        this.tscheduleFormatted.every = [this.timeSchedule.every_number === undefined ? null : this.timeSchedule.every_number, this.timeSchedule.every_unit]
        // this.tscheduleFormatted.every[0] = this.timeSchedule.every_number
        // this.tscheduleFormatted.every[1] = this.timeSchedule.every_unit
        this.tscheduleFormatted.at = this.timeSchedule.at
        this.tscheduleFormatted.forever = this.timeSchedule.forever
        this.tscheduleFormatted.tag = this.timeSchedule.tag
        this.tscheduleFormatted.category = 'asdf'
        console.log(this.tscheduleFormatted)
        return this.tscheduleFormatted
      },
      execute () {

      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
