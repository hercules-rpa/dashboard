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
              <FormulateForm
                v-model="generalOptions"
                class="mt-5"
                error-behavior="live"
                @submit="execute"
              >
                <FormulateInput
                  type="text"
                  name="EDMA_URL"
                  label="EDMA URL"
                  default="edma.gnoss.com"
                  :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/],['required']]"
                />
                <FormulateInput
                  type="text"
                  name="EDMA_PORT"
                  label="EDMA PORT"
                  default="8080"
                  :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/],['required']]"
                />
                <FormulateInput
                  type="text"
                  name="SGI_URL"
                  label="SGI URL"
                  default="sgi.um.es"
                  :validation="[['matches', /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/],['required']]"
                />
                <FormulateInput
                  type="text"
                  name="SGI_PORT"
                  label="SGI PORT"
                  default="8080"
                  :validation="[['matches', /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/],['required']]"
                />
                <FormulateInput
                  type="submit"
                  label="Ejecutar"
                />
              </FormulateForm>

              <div v-if="test">
                <h3 class="mt-5">
                  generalOptions
                  {{ generalOptions }}
                </h3>
                <h3 class="mt-5">
                  timeSchedule
                  {{ timeSchedule }}
                </h3>
                <h3 class="mt-5">
                  timeScheduleFormatted
                  {{ tscheduleFormatted }}
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
  import { ProcessService } from '@/common/api.service'
  export default {
    name: 'Form',
    data () {
      return {
        generalOptions: { priority: 1 },
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
        test: true,
        testSchema: {},
        jobData: {},
        code: {},
        days: {
          monday: 'monday',
          tuesday: 'tuesday',
          wednesday: 'wednesday',
          thurdsday: 'thurdsday',
          friday: 'friday',
          saturday: 'saturday',
          sunday: 'sunday',
          week: 'week',
          day: 'day',
        },
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          weeks: 'weeks',
        },
        schemaMail: [
          {
            type: 'text',
            name: 'user',
            label: 'User',
            validation: 'required|email',
          },
          {
            type: 'password',
            name: 'password',
            label: 'Password',
            validation: 'required',
          },
          {
            type: 'text',
            name: 'smtp_server',
            label: 'Smtp Server',
            validation: 'required',
          },
          {
            type: 'group',
            name: 'receivers',
            validation: 'min:1,length',
            repeatable: true,
            'add-label': '+ Add receiver',
            value: [{}],
            children: [
              {
                type: 'text',
                name: 'receiver',
                label: 'Receiver',
                validation: 'email',
              },
              {
                type: 'text',
                name: 'subject',
                label: 'Subject',
                validation: 'required',
              },
              {
                type: 'textarea',
                name: 'body',
                label: 'Body',
                validation: 'required',
              },
              {
                type: 'file',
                name: 'attached',
                label: 'Attach a file',
                value: null,
              },
            ],
          },
          {
            type: 'submit',
            label: 'Ejecutar',
          },
        ],
        schemaSearch: [
          {
            type: 'textarea',
            name: 'topic_sentence',
            label: 'Search',
            validation: 'required',
          },
          {
            type: 'group',
            name: 'receivers',
            validation: 'min:1,length',
            repeatable: true,
            'add-label': '+ Add receiver',
            value: [{}],
            children: [
              {
                type: 'text',
                name: 'receiver',
                label: 'Receiver',
                validation: 'email',
              },
            ],
          },
          {
            type: 'number',
            name: 'topk',
            label: 'topk',
            value: null,
          },
          {
            type: 'submit',
            label: 'Ejecutar',
          },
        ],
        schema: [
        ],

      }
    },
    mounted: function () {
      ProcessService.get(this.$route.params.idProcess)
        .then(response => {
          this.processDesc = response.data
          console.log(this.processDesc)
          // this.processDesc.capable_robots.unshift('None')
        })
        .catch((error) => {
          throw new Error(error)
        })
      ProcessService.getForm(this.$route.params.idProcess)
        .then(response => {
          console.log(response.data)
          this.schema = response.data
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    methods: {
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
