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
              md="6"
            >
              <v-list
                width="250"
              >
                <v-list-item-group
                  v-model="model"
                  mandatory
                  color="primary"
                >
                  <v-list-item

                    v-for="(item, i) in items"
                    :key="i"
                    active-class="highlighted"
                    :class="item.to === $route.path ? 'highlighted' : ''"
                    :to="item.to"
                    @click="clickItem(item)"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="item.icon" />
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="item.text" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div
                v-if="settingsType=='global'"
                id="gSettings"
              >
                <div class="text-heading-6 font-weight-black black--text">
                  Ajustes Globales de la aplicación
                </div>
                <FormulateForm
                  v-model="globalSettings"
                  class="mt-5"
                  error-behavior="live"
                  name="global"
                  @submit="editGlobalSettings"
                >
                  <FormulateInput
                    type="text"
                    name="edma_host_sparql"
                    hint="Introduce IP or Dominio"
                    label="EDMA HOST SPARQL"
                    :placeholder="globalSettings.edma_host_sparql"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="edma_port_sparql"
                    label="EDMA PUERTO SPARQL"
                    :placeholder="globalSettings.edma_port_sparql"
                    :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="edma_host_servicios"
                    hint="Introduce IP or Dominio"
                    label="EDMA HOST SERVICIOS"
                    :placeholder="globalSettings.edma_host_servicios"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />

                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="sgi_user"
                    label="SGI USER"
                    :placeholder="globalSettings.sgi_user"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="sgi_password"
                    label="SGI CONTRASEÑA"
                    :placeholder="globalSettings.sgi_password"
                  />
                  <FormulateInput
                    type="text"
                    name="sgi_ip"
                    label="SGI HOST"
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
                    type="submit"
                    :disabled="isLoading"
                    :label="isLoading ? 'Cargando...' : 'Guardar'"
                  />
                </FormulateForm>
              </div>
              <div
                v-if="settingsType=='process'"
                id="pSettings"
              >
                <div class="text-heading-6 font-weight-black black--text">
                  Ajustes de Proceso
                </div>
                <FormulateForm
                  v-model="pSettings"
                  name="process"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editPSettings"
                >
                  <FormulateInput
                    type="text"
                    name="salaprensa_url"
                    hint="Introduce IP or Dominio"
                    label="SALA PRENSA URL"
                    :placeholder="pSettings.salaprensa_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="ucc_url"
                    hint="Introduce IP or Dominio"
                    label="UCC URL"
                    :placeholder="pSettings.ucc_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="boe_url"
                    hint="Introduce IP or Dominio"
                    label="BOE URL"
                    :placeholder="pSettings.boe_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="bdns_url"
                    hint="Introduce IP or Dominio"
                    label="BDNS URL"
                    :placeholder="pSettings.bdns_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="bdns_search"
                    hint="Introduce IP or Dominio"
                    label="BDNS SEARCH"
                    :placeholder="pSettings.bdns_search"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="europe_url"
                    hint="Introduce IP or Dominio"
                    label="EUROPE URL"
                    :placeholder="pSettings.europe_url"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    type="text"
                    name="europe_link"
                    hint="Introduce IP or Dominio"
                    label="EUROPE LINK"
                    :placeholder="pSettings.europe_link"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />

                  <FormulateInput
                    type="submit"
                    :disabled="isLoading"
                    :label="isLoading ? 'Cargando...' : 'Guardar'"
                  />
                </FormulateForm>
              </div>
              <div v-if="settingsType=='amqp'">
                <FormulateForm
                  v-model="amqpSettings"
                  class="mt-5"
                  name="amqp"
                  error-behavior="live"
                  @submit="editAMQPSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    Ajustes AMQP
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="user"
                    label="User"
                    :placeholder="amqpSettings.user"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="Password"
                    :placeholder="amqpSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="Host"
                    :placeholder="amqpSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="Port"
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
              <div v-if="settingsType=='dbprocess'">
                <div class="text-heading-6 font-weight-black black--text">
                  Ajustes de la Base de datos de procesos
                </div>
                <FormulateForm
                  v-model="dbprocessSettings"
                  name="dbprocess"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editDBProcessSettings"
                >
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="user"
                    label="User"
                    :placeholder="dbprocessSettings.user"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="password"
                    label="Password"
                    :placeholder="dbprocessSettings.password"
                  />
                  <FormulateInput
                    type="text"
                    name="host"
                    hint="Introduce host"
                    label="Host"
                    :placeholder="dbprocessSettings.host"
                    :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/]]"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="port"
                    label="Port"
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

              <div v-if="settingsType=='orch'">
                <FormulateForm
                  v-model="orchestratorSettings"
                  name="orch"
                  class="mt-5"
                  error-behavior="live"
                  @submit="editOrchestratorSettings"
                >
                  <div class="text-heading-6 font-weight-black black--text">
                    Ajustes del Orquestador
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="id"
                    label="ID ORCHESTRATOR"
                    :placeholder="orchestratorSettings.id_orch"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="name"
                    label="NOMBRE"
                    :placeholder="orchestratorSettings.name"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="company"
                    label="COMPANY"
                    :placeholder="orchestratorSettings.company"
                  />
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="pathlog_store"
                    label="PATHLOG_STORE"
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
            Cerrar
          </v-btn>
          <v-btn
            color="green"
            text
            @click="goToExecution"
          >
            Si
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
        pSettings: {},
        amqpSettings: {},
        dbprocessSettings: {},
        dbbiSettings: {},
        orchestratorSettings: {},
        settingsType: {},
        settingsItems: { global: 'Ajustes globales', process: 'Ajustes de procesos', amqp: 'Ajustes AMQP', dbprocess: 'BBDD Procesos ', dbbi: 'Ajustes BBDD BI', orch: 'Ajustes del Orquestador' },
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
        items: [
          {
            icon: 'mdi-cog',
            text: 'Global Settings',
            to: '/pages/globalsettings/global',
          },
          {
            icon: 'mdi-cog-box',
            text: 'Process',
            to: '/pages/globalsettings/process',
            highlighted: true,
          },
          {
            icon: 'mdi-graph',
            text: 'Ajustes AMQP',
            to: '/pages/globalsettings/amqp',
          },
          {
            icon: 'mdi-database',
            text: 'Ajustes BBDD',
            to: '/pages/globalsettings/dbprocess',
          },
          {
            icon: 'mdi-brain',
            text: 'Ajustes del Orquestador',
            to: '/pages/globalsettings/orch',
          },
        ],
      }
    },
    computed: {
      computedItems () {
        return this.items.map(this.mapItem)
      },
    },
    mounted: function () {
      this.settingsType = this.$route.params.settingsType
      SettingsService.getGlobalSettings()
        .then(response => {
          this.globalSettings = response.data
        })
        .catch((error) => {
          throw new Error(error)
        })
      SettingsService.getPSettings()
        .then(response => {
          this.pSettings = response.data
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
      clickItem (item) {
        console.log(item.to)
        this.$router.push(item.to)
        this.$router.go()
      },
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
      async editGlobalSettings () {
        SettingsService.editGlobalSettings(this.globalSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      async editPSettings () {
        SettingsService.editPSettings(this.pSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      async editAMQPSettings () {
        SettingsService.editAMQPSettings(this.amqpSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      async editDBProcessSettings () {
        SettingsService.editDBProcessSettings(this.dbprocessSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      async editDBBISettings () {
        SettingsService.editDBBISettings(this.dbbiSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      async editOrchestratorSettings () {
        SettingsService.editOrchestratorSettings(this.orchestratorSettings)
          .then(response => {
            if (response.status === 200) {
              alert('Gracias, los ajustes se han modificado correctamente')
            }
          })
          .catch((error) => {
            alert('Error modificando ajustes')
            throw new Error(error)
          })
      },
      closeDialog () {
        this.dialog = false
        this.$router.push('/pages/newprocess/')
      },
      downloadLog (lData) {
      },
      goToExecution () {
        this.$router.push('/pages/executions/' + this.jobData.schedule_id)
      },
      execute () {

      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
