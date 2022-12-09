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
          </v-icon>Editar Planificación - {{ schedule.id }}: Proceso {{ schedule.process_name }} : {{ schedule.id_process }}
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
                Opciones generales
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
                  placeholder="Selecciona un robot"
                  :value="null"
                  :options="processDesc.capable_robots"
                />
                <FormulateInput
                  type="number"
                  name="priority"
                  label="Prioridad"
                  default="1"
                  validation="required"
                />
              </FormulateForm>

              <div class="mt-5 text-heading-6 font-weight-black black--text">
                Opciones de planificación
              </div>

              <FormulateForm
                v-model="timeSchedule"
                class="mt-5"
                @submit="save"
              >
                <FormulateInput
                  type="select"
                  name="mode"
                  label="Modo de Ejecución"
                  :options="{Schedule: 'Planificado'}"
                />
                <div v-if="timeSchedule.mode == 'Schedule'">
                  <FormulateInput
                    v-model="concreteValue"
                    type="checkbox"
                    name="concrete"
                    label="Día y hora concreto"
                  />
                  <FormulateInput
                    v-if="concreteValue"
                    type="datetime-local"
                    name="concreteDayHour"
                    label="Día y hora concreto"
                    placeholder="Sample datetime-local placeholder"
                    validation="required"
                  />

                  <div
                    v-if="!concreteValue"
                  >
                    <FormulateInput
                      type="number"
                      name="every_number"
                      :value="null"
                      label="cada"
                    />
                    <div
                      v-if="timeSchedule.every_number == null || timeSchedule.every_number == ''"
                    >
                      <FormulateInput
                        type="select"
                        name="every_unit"
                        label="Unidad de tiempo"
                        :options="days"
                      />
                    </div><div v-else>
                      <FormulateInput
                        type="select"
                        name="every_unit"
                        label="Unidad de tiempo"
                        :options="units"
                      />
                    </div>
                    <FormulateInput
                      v-if="timeSchedule.every_unit != 'minutes' &&timeSchedule.every_unit != 'weeks'"
                      class="mt-5"
                      type="time"
                      name="at"
                      label="a"
                      :value="null"
                      placeholder="at"
                    />
                    <FormulateInput
                      v-model="foreverValue"
                      type="checkbox"
                      name="forever"
                      label="Repetir"
                    />
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="tag"
                    label="Etiqueta"
                    :value="!concreteValue ? timeSchedule.concreteDayHour : timeSchedule.concreteDayHour"
                    validation="required"
                  />
                  <FormulateInput
                    v-if="schema == null"
                    type="submit"
                    label="Guardar"
                  />
                </div>
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
          <span v-if="code === 201">Planificación modificada correctamente</span><span v-else>Error modificando planificación</span>

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="code === 201">
          La planificación ha sido modificada correctamente <router-link
            class="blue--text text--darken-3"
            :to="{ path: '/pages/executions/'+jobData.schedule_id }"
          >
            {{ jobData.schedule_id }}
          </router-link> ¿ Quieres ir a la ventana de planificación ?
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
        foreverValue: false,
        concreteValue: false,
        concrete: false,
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
          monday: 'lunes',
          tuesday: 'martes',
          wednesday: 'miércoles',
          thurdsday: 'jueves',
          friday: 'viernes',
          saturday: 'sábado',
          sunday: 'domingo',
          week: 'semana',
          day: 'día',
        },
        units: {
          minutes: 'minutos',
          hours: 'horas',
          days: 'días',
          weeks: 'semanas',
        },
      }
    },
    mounted: function () {
      SchedulesService.get(this.$route.params.idSchedule)
        .then(response => {
          this.schedule = response.data
          // this.timeSchedule = this.schedule.time_schedule
          this.timeSchedule.mode = 'Schedule'
          this.timeSchedule.every_number = this.schedule.time_schedule.every[0]
          this.timeSchedule.every_unit = this.schedule.time_schedule.every[1]
          this.timeSchedule.at = this.schedule.time_schedule.at
          this.timeSchedule.tag = this.schedule.time_schedule.tag
          this.timeSchedule.forever = this.schedule.time_schedule.forever
          // const secondsAt = this.schedule.time_schedule.every[0]
          // const secondsInit = Math.floor(Date.now() / 1000)
          // const suma = secondsAt + secondsInit
          // const result2 = new Date(suma * 1000).toISOString()
          // this.timeSchedule.concreteDayHour1 = result2
          // this.timeSchedule.concrete = false
          // console.log(result2)

          ProcessService.get(this.schedule.id_process)
            .then(response => {
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
        this.$router.push('/pages/executions/' + this.jobData.schedule_id)
      },
      formatTimeSchedule () {
        if (this.timeSchedule.concrete) {
          // this.tscheduleFormatted.concreteDayHour = this.timeSchedule.concreteDayHour
          const date = new Date(this.timeSchedule.concreteDayHour)
          const realDate = date.getTime() - Date.now()
          const seconds = Math.floor(realDate / 1000)
          this.timeSchedule.every_number = seconds
          this.timeSchedule.every_unit = 'seconds'
          this.timeSchedule.at = null
          this.timeSchedule.category = 'Planificado día y hora concretos'
          this.timeSchedule.forever = false
          // this.tscheduleFormatted.every = [this.timeSchedule.every_number, this.timeSchedule.every_unit]
        }
        this.tscheduleFormatted.every = [this.timeSchedule.every_number === undefined ? null : this.timeSchedule.every_number, this.timeSchedule.every_unit]
        if (this.timeSchedule.at === undefined) {
          this.tscheduleFormatted.at = null
        } else {
          this.tscheduleFormatted.at = this.timeSchedule.at
        }
        this.tscheduleFormatted.forever = this.timeSchedule.forever
        this.tscheduleFormatted.tag = this.timeSchedule.tag
        this.tscheduleFormatted.category = this.timeSchedule.category === undefined ? null : 'Planificado'
        // this.tscheduleFormatted = this.timeSchedule

        return this.tscheduleFormatted
      },
      save () {
        this.timeSchedule.mode === 'Instant' ? this.params.time_schedule = null : this.params.time_schedule = this.formatTimeSchedule()
        this.params.process = this.generalOptions
        this.params.process.parameters = this.schema === null ? null : this.processParameters
        this.params.process.id_process = this.schedule.id_process
        this.params.process.priority = this.generalOptions.priority

        SchedulesService.modify(this.schedule.id, this.params).then((response) => {
          this.jobData = response.data
          this.code = response.status

          this.dialog = true
        })
      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
