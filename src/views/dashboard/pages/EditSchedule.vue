<template>
  <div>
    <v-container
      id="form"
      fluid
      tag="section"
    >
      <v-card
        class="px-5 py-3"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-form-select
          </v-icon>Edit Schedule - {{ schedule.id }}: Process {{ schedule.process_name }} : {{ schedule.id_process }}
        </v-card-title>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-heading-6 font-weight-black black--text">
                General Options
              </div>
              <FormulateForm
                v-model="generalOptions"
                class="mt-5"
                error-behavior="live"
                @submit="save"
              >
                <FormulateInput
                  type="select"
                  name="id_robot"
                  label="Robot"
                  placeholder="Select a robot"
                  :value="null"
                  :options="processDesc.capable_robots"
                />
                <FormulateInput
                  type="number"
                  name="priority"
                  label="Process priority"
                  default="1"
                  validation="required"
                />
              </FormulateForm>

              <div class="mt-5 text-heading-6 font-weight-black black--text">
                Schedule Options
              </div>

              <FormulateForm
                v-model="timeSchedule"
                class="mt-5"
                @submit="save"
              >
                <FormulateInput
                  type="select"
                  name="mode"
                  label="Execution mode"
                  value="Schedule"
                  :options="{ Instant: 'Instanteous', Schedule: 'Schedule'}"
                />
                <div v-if="timeSchedule.mode == 'Schedule'">
                  <FormulateInput
                    type="number"
                    name="every_number"
                    :value="null"
                    label="every"
                  />
                  <div
                    v-if="timeSchedule.every_number == null || timeSchedule.every_number == ''"
                  >
                    <FormulateInput
                      type="select"
                      name="every_unit"
                      label="time unit"
                      :options="days"
                    />
                  </div><div v-else>
                    <FormulateInput
                      type="select"
                      name="every_unit"
                      label="time unit"
                      :options="units"
                    />
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="time"
                    name="at"
                    label="at"
                    :value="null"
                    placeholder="at"
                  />
                  <FormulateInput
                    type="select"
                    name="forever"
                    :value="false"
                    label="forever"
                    :options="{false: 'false',true: 'true'}"
                  />
                  <FormulateInput
                    type="text"
                    name="tag"
                    label="tag"
                    validation="required"
                  />
                </div>
                <FormulateInput
                  v-if="schema == null"
                  type="submit"
                  label="Save"
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
                <h3 class="mt-5">
                  paramsfinal
                  {{ params }}
                </h3>
                <v-btn
                  color="blue"
                  class="mb-5 ml-3"
                  dark
                  @click="formatTimeSchedule"
                >
                  format time<v-icon class="ml-3">
                    mdi-clock
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-row />
          </v-row>
        </v-container>
      </v-card>
    </v-container>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card class="text-center">
        <v-card-title>
          <span v-if="code === 201">Schedule modified correctly</span><span v-else>Error modifying process</span>

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="code === 201">
          The schedule was modified succesfully <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/executions/'+jobData.schedule_id }"
          >
            {{ jobData.schedule_id }}
          </router-link> do you want to go to the schedule window ?
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
            @click="goToSchedule"
          >
            Si
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { ProcessService, SchedulesService } from '@/common/api.service'
  export default {
    name: 'EditSchedule',
    data () {
      return {
        generalOptions: { priority: 1 },
        timeSchedule: {},
        processParameters: {},
        capableRobots: {},
        schedule: {},
        processDesc: {},
        params: {},
        tscheduleFormatted: {},
        dialog: false,
        test: false,
        schema: null,
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
      }
    },
    mounted: function () {
      console.log(this.$route.params.idSchedule)
      SchedulesService.get(this.$route.params.idSchedule)
        .then(response => {
          console.log('SCHEDULE' + response.data)
          this.schedule = response.data

          ProcessService.get(this.schedule.id_process)
            .then(response => {
              console.log('PROCESO' + response.data)
              this.processDesc = response.data
            })
            .catch((error) => {
              throw new Error(error)
            })
        })
        .catch((error) => {
          throw new Error(error)
        })
    },
    methods: {
      goToSchedule () {
        console.log(this.jobData)
        this.$router.push('/pages/executions/' + this.jobData.schedule_id)
      },
      formatTimeSchedule () {
        this.tscheduleFormatted.every = [this.timeSchedule.every_number === undefined ? null : this.timeSchedule.every_number, this.timeSchedule.every_unit]
        this.tscheduleFormatted.at = this.timeSchedule.at
        this.tscheduleFormatted.forever = this.timeSchedule.forever
        this.tscheduleFormatted.tag = this.timeSchedule.tag
        this.tscheduleFormatted.category = 'asdf'
        console.log(this.tscheduleFormatted)
        return this.tscheduleFormatted
      },
      save () {
        this.timeSchedule.mode === 'Instant' ? this.params.time_schedule = null : this.params.time_schedule = this.formatTimeSchedule()
        this.params.process = this.generalOptions
        this.params.process.parameters = this.schema === null ? null : this.processParameters
        this.params.process.id_process = this.schedule.id_process
        this.params.process.priority = this.generalOptions.priority
        console.log(this.params)
        SchedulesService.modify(this.schedule.id, this.params).then((response) => {
          console.log(response.data)
          this.jobData = response.data
          this.code = response.status
          console.log(this.code)
          this.dialog = true
        })
      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
