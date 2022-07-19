<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-hover>
          <base-material-stats-card
            hover
            color="info"
            icon="mdi-robot"
            title="Robots Online"
            :value="robotsOnline"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
            @click.native="$router.push(`/pages/robots/`)"
          />
        </v-hover>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-hover>
          <base-material-stats-card
            color="primary"
            icon="mdi-cog-sync-outline"
            title="Processes completed"
            :value="processesCompleted"
            sub-icon="mdi-calendar"
            sub-text="Last 24 hours"
            hover
            @click.native="$router.push(`/pages/executions/`)"
          />
        </v-hover>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-hover>
          <base-material-stats-card
            color="success"
            icon="mdi-calendar-check"
            title="Schedules Actives"
            :value="schedulesActives"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
            hover
            @click.native="$router.push(`/pages/schedules/`)"
          />
        </v-hover>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-hover>
          <base-material-stats-card
            color="error"
            icon="mdi-alert"
            title="IT Problems"
            :value="itProblems"
            sub-icon="mdi-flash"
            sub-icon-color="red"
            sub-text="low impact"
            hover
            @click.native="$router.push(`/pages/problems/`)"
          />
        </v-hover>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <base-material-chart-card
          :data="monthlyExecutionsChart.data"
          :options="monthlyExecutionsChart.options"
          :responsive-options="monthlyExecutionsChart.responsiveOptions"
          color="#7d3c52"
          hover-reveal
          type="Bar"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon
                    color="info"
                  >
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Monthly Executions
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Total executions by month
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="text-caption grey--text font-weight-light">updated 10 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <base-material-chart-card
          :data="dailyExecutionsChart.data"
          :options="dailyExecutionsChart.options"
          color="#528254"
          hover-reveal
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon
                    color="info"
                  >
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Daily Executions
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Total executions per week
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="text-caption grey--text font-weight-light">updated 4 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>
      <v-col
        cols="12"
        lg="12"
      >
        <base-material-chart-card
          :data="activeProcessesChart.data"
          :options="activeProcessesChart.options"
          hover-reveal
          color="#0e8c9c"
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon
                    color="info"
                  >
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Last month executions
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Total Executions last 30 days
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="text-caption grey--text font-weight-light">Just Updated</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col
        cols="12"
        md="12"
      >
        <base-material-card
          color="primary"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">
              Recent Executions
            </div>

            <div class="text-subtitle-1 font-weight-light">
              last robot process executions
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="executions"
              single-select
              :search="search"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @dblclick:row="goToExecution"
            >
              <template v-slot:[`item.start_time`]="{ item }">
                {{ item.start_time | date }}
              </template>
              <template v-slot:[`item.end_time`]="{ item }">
                {{ item.end_time | date }}
              </template>
              <template v-slot:[`item.id_robot`]="{ item }">
                <router-link
                  class="blue--text text--darken-3"
                  :to="{ path: '/pages/robots/'+item.id_robot }"
                >
                  {{ item.id_robot }}
                </router-link>
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
                  {{ item.finished ? 'FINISHED' : 'RUNNING' }}
                </div>
              </template>
              <template v-slot:[`item.state`]="{ item }">
                <div :class="[item.state == 'OK' ? 'green--text' : 'red--text']">
                  {{ item.state }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { StatisticsService, LogsService, SchedulesService } from '@/common/api.service'
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        sortBy: 'end_time',
        sortDesc: true,
        search: '',
        data: {},
        robotsOnline: 0,
        processesCompleted: 0,
        schedulesActives: 0,
        itProblems: 0,
        dailyExecutionsChart: {
          data: {
            labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            series: [
              [0, 0, 0, 0, 0, 0, 0],
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
        activeProcessesChart: {
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            series: [
              [230, 750, 450, 300, 280, 240, 200, 190],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 0, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        monthlyExecutionsChart: {
          data: {
            labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
            series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
          },
          options: {
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        },
        headers: [
          {
            sortable: true,
            text: 'Process',
            value: 'process_name',
          },
          {
            sortable: true,
            text: 'Schedule',
            value: 'id_schedule',
          },
          {
            sortable: true,
            text: 'Log',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Started',
            value: 'start_time',
          },
          {
            sortable: true,
            text: 'Ended',
            value: 'end_time',
          },
          {
            sortable: true,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            sortable: true,
            text: 'Status',
            value: 'finished',
          },
          {
            sortable: true,
            text: 'Result',
            value: 'state',
          },
        ],
        executions: [],
        tabs: 0,
        tasks: {
          0: [
            {
              text: 'Firmar contrato "What are conference organizers afraid of?"',
              value: true,
            },
            {
              text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
              value: false,
            },
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: false,
            },
            {
              text: 'Create 4 Invisible User Experiences you Never Knew About',
              value: true,
            },
          ],
          1: [
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: true,
            },
            {
              text: 'Sign contract for "What are conference organizers afraid of?"',
              value: false,
            },
          ],
          2: [
            {
              text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
              value: false,
            },
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: true,
            },
            {
              text: 'Sign contract for "What are conference organizers afraid of?"',
              value: true,
            },
          ],
        },
        list: {
          0: false,
          1: false,
          2: false,
        },
      }
    },
    computed: {

    },
    mounted: function () {
      StatisticsService.query()
        .then(response => {
          console.log(response.data)
          this.data = response.data
          this.robotsOnline = this.data.robots_online
          this.itProblems = this.data.process_problems
          this.processesCompleted = this.data.process_completed
          this.schedulesActives = this.data.process_actives
          this.dailyExecutionsChart.data.series[0] = this.data.execution_day_week
          this.dailyExecutionsChart.options.high = Math.max.apply(null, this.data.execution_day_week)
          this.monthlyExecutionsChart.data.series[0] = this.data.execution_month_year
          this.monthlyExecutionsChart.options.high = Math.max.apply(null, this.data.execution_month_year)
          this.activeProcessesChart.data.series[0] = this.data.execution_day_month
          this.activeProcessesChart.options.high = Math.max.apply(null, this.data.execution_day_month)
          console.log(this.monthlyExecutionsChart.data)
        })
        .catch(error => {
          alert('Ha ocurrido un error', error)
        })
      LogsService.query()
        .then(response => {
          console.log(response.data)
          this.executions = response.data
        })
        .catch(error => {
          alert('Ha ocurrido un error', error)
        })
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
      getExecution (idExecution) {
        SchedulesService.getForm(idExecution)
          .then(response => {
            alert('Nos vamos a la ventana de formulario')
          })
          .catch(error => {
            alert('Ha ocurrido un error', error)
          })
      },
      goToExecution (value, data) {
        console.log(value)
        console.log(data)
        this.$router.push('/pages/logs/' + data.item.id)
      },
    },
  }
</script>
