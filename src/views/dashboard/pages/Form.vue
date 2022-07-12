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
          </v-icon>New Process - {{ processDesc.process_id }}:{{ processDesc.process_name }}
        </v-card-title>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              v-if="schema !== null "
              cols="12"
              md="6"
            >
              <span class="text-heading-6 font-weight-black black--text">
                Process Options
              </span>
              <FormulateForm
                v-model="processParameters"
                class="mt-5"
                :schema="schema"
                error-behavior="live"
                @submit="execute"
              >
                <FormulateInput
                  v-if="processParameters.comision === '8'"
                  type="checkbox"
                  name="perfil_tecnologico"
                  label="Perfil Tecnológico"
                  :value="false"
                />
                <FormulateInput
                  v-if="processParameters.comision === '21'"
                  type="select"
                  name="categoria_acreditacion"
                  :options="{investigacion: 'Investigación', docencia: 'Docencia'}"
                  placeholder="Selecciona una opción"
                  label="Categoría de acreditación"
                />
                <FormulateInput
                  v-if="processParameters.comision === '9'"
                  type="select"
                  name="subcomite"
                  :options="{1: 'Ciencias Sociales, Políticas y Comunicación', 2: 'Ciencias del Comportamiento',3: 'Biblioteconomía y Documentación',4: 'Estudios de Género',5: 'Antropología Social, Trabajo Social y Servicios Sociales e Historia del Pensamiento y de los Movimientos Sociales',6:'Otros'}"
                  placeholder="Selecciona una opción"
                  label="Subcomité"
                />
                <FormulateInput
                  type="submit"
                  label="Ejecutar"
                />
              </FormulateForm>
              <div v-if="test">
                <h3 class="mt-5">
                  Parameters
                  {{ processParameters }}
                </h3>
              </div>
            </v-col>
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
                @submit="execute"
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
                @submit="execute"
              >
                <FormulateInput
                  type="select"
                  name="mode"
                  label="Execution mode"
                  :options="{ Instant: 'Instanteous', Schedule: 'Schedule'}"
                />
                <div v-if="timeSchedule.mode == 'Schedule'">
                  <FormulateInput
                    v-model="concreteValue"
                    type="checkbox"
                    name="concrete"
                    label="concrete day and hour"
                  />
                  <FormulateInput
                    v-if="concreteValue"
                    type="datetime-local"
                    name="concreteDayHour"
                    label="Concrete day and hour"
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
                      v-model="foreverValue"
                      type="checkbox"
                      name="forever"
                      label="forever"
                    />
                  </div>
                  <FormulateInput
                    class="mt-5"
                    type="text"
                    name="tag"
                    label="tag"
                    :value="!concreteValue ? timeSchedule.concreteDayHour : timeSchedule.concreteDayHour"
                    validation="required"
                  />
                </div>
                <FormulateInput
                  v-if="schema == null"
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
      </v-card>
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
  import { ProcessService, OrchestratorService } from '@/common/api.service'
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
          {
            type: 'text',
            name: 'orcid',
            label: 'Orcid',
          },
          {
            type: 'text',
            name: 'personaref',
            label: 'PersonaRef',
          },
          {
            type: 'text',
            name: 'email',
            label: 'Email',
            validation: 'optional|email',
          },
          {
            type: 'select',
            options: {
              50: 'Titularidad',
              51: 'Cátedra',
            },
            placeholder: 'Selecciona una acreditación',
            name: 'tipo_acreditacion',
            validation: 'required',
            label: 'Acreditación',
          },
          {
            type: 'select',
            options: {
              1: 'Matemáticas',
              2: 'Física',
              3: 'Química',
              4: 'Ciencias de la naturaleza ',
              5: 'Biología Celular y Molecular',
              6: 'Ciencias biomédicas',
              7: 'Medicina clínica y especialidades clínicas',
              8: 'Otras especialidades sanitarias',
              9: 'Ingeniería química, de los materiales y del medio natural',
              10: 'Ingeniería mecánica y de la navegación',
              11: 'Ingeniería eléctrica y de las telecomunicaciones',
              12: 'Ingeniería informática',
              13: 'Arquitectura, ingeniería civil, construcción y urbanismo',
              14: 'Derecho',
              15: 'Ciencias económicas y ciencias empresariales',
              16: 'Ciencias económicas y ciencias empresariales',
              17: 'Ciencias de la educación',
              18: 'Ciencias del comportamiento',
              19: 'Ciencias sociales',
              20: 'Historia, filosofía y geografía - Historia del arte y expresión artística',
              21: 'Filología y lingüística',
            },
            placeholder: 'Selecciona una comisión',
            name: 'comision',
            validation: 'required',
            label: 'comisión de investigación',
          },
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
          if (response.data.length !== 0) {
            this.schema = response.data
          }
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
        if (this.processDesc.capable_robots.length === 0) {
          this.dialogAlert = true
        } else {
          if (this.processParameters.file !== undefined) {
            delete this.processParameters.file.context
            this.processParameters.files = []
            this.processParameters.file.files.forEach(element => {
              this.processParameters.files.push(element.path)
            })
            delete this.processParameters.file
          }
          this.timeSchedule.mode === 'Instant' ? this.params.time_schedule = null : this.params.time_schedule = this.formatTimeSchedule()
          this.params.process = this.generalOptions
          this.params.process.parameters = this.schema === null ? null : this.processParameters
          this.params.process.id_process = parseInt(this.$route.params.idProcess)
          this.params.process.priority = this.generalOptions.priority
          console.log(this.params)

          // EJECUTAMOS PROCESO CON LOS PARAMETROS
          console.log(this.params)
          OrchestratorService.execute(this.params).then((response) => {
            console.log(response.data)
            // alert(response.data.description)
            this.jobData = response.data
            this.code = response.status
            this.dialog = true
          })
        }
      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
