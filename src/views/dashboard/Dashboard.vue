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
            />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { StatisticsService } from '@/common/api.service'
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
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
            sortable: false,
            text: 'Process',
            value: 'process_name',
          },
          {
            sortable: false,
            text: 'Schedule ID',
            value: 'schedule_id',
          },
          {
            sortable: false,
            text: 'Log ID',
            value: 'log',
            align: 'right',
          },
          {
            sortable: false,
            text: 'Robot',
            value: 'robot',
            align: 'right',
          },
          {
            sortable: false,
            text: 'Status',
            value: 'status',
            align: 'right',
          },
        ],
        executions: [
          {
            process_id: 1,
            process_name: 'Hola Mundo',
            schedule_description: 'Cada quince dias',
            schedule_id: '123123131235-123452412-1231',
            log: 1234,
            robot: 'robotremote1',
            updated: '1620821712',
            status: 'RUNNING',
          },
          {
            process_id: 2,
            process_name: 'Process Compose Test',
            schedule_description: 'cada 10 segundos',
            schedule_id: '123123131235-123452412-1231',
            log: 1235,
            robot: 'robotremote1',
            updated: '1620821712',
            status: 'FINISHED',
          },
          {
            process_id: 3,
            process_name: 'Process Send Mail',
            schedule_description: 'sabados a las 20:00',
            schedule_id: '123123131235-123452412-1231',
            robot: 'robotedu',
            log: 1234,
            updated: '1620821712',
            status: 'FINISHED',
          },
          {
            process_id: 4,
            process_name: 'Process Selenium TSLA',
            schedule_description: null,
            schedule_id: '123123131235-123452412-1231',
            robot: 'robotMacBook',
            log: 1234,
            updated: '1620821712',
            status: 'ABORTED',
          },
        ],
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
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>
