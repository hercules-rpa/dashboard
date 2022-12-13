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
            sub-text="Recién actualizado"
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
            title="Procesos completados"
            :value="processesCompleted"
            sub-icon="mdi-calendar"
            sub-text="Últimas 24 horas"
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
            title="Planificaciones Activas"
            :value="schedulesActives"
            sub-icon="mdi-clock"
            sub-text="recién actualizado"
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
            title="Problemas técnicos"
            :value="itProblems"
            sub-icon="mdi-flash"
            sub-icon-color="red"
            sub-text="bajo impacto"
            hover
            @click.native="$router.push(`/pages/problems/`)"
          />
        </v-hover>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="px-5 py-3"
        >
          <v-card-title>
            <v-icon class="mr-3">
              mdi-chart-bar
            </v-icon>Ejecuciones Mensuales
          </v-card-title>
          <v-container
            class="py-0"
          >
            <v-row class="mt-5 mb-5">
              <v-col
                cols="12"
                md="12"
              >
                <apexchart
                  height="300"
                  type="bar"
                  :options="monthlyExecutionsChartApex.options"
                  :series="monthlyExecutionsChartApex.series"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="px-5 py-3"
        >
          <v-card-title>
            <v-icon class="mr-3">
              mdi-chart-bar
            </v-icon>Ejecuciones Diarias
          </v-card-title>
          <v-container
            class="py-0"
          >
            <v-row class="mt-5 mb-5">
              <v-col
                cols="12"
                md="12"
              >
                <apexchart
                  height="300"
                  type="line"
                  :options="dailyExecutionsChartApex.options"
                  :series="dailyExecutionsChartApex.series"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        lg="12"
      >
        <v-card
          class="px-5 py-3"
        >
          <v-card-title>
            <v-icon class="mr-3">
              mdi-chart-bar
            </v-icon>Ejecuciones últimos 30 días
          </v-card-title>
          <v-container
            class="py-0"
          >
            <v-row class="mt-5 mb-5">
              <v-col
                cols="12"
                md="12"
              >
                <apexchart
                  height="300"
                  type="line"
                  :options="lastMonthChartApex.options"
                  :series="lastMonthChartApex.series"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
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
              Ejecuciones recientes
            </div>

            <div class="text-subtitle-1 font-weight-light">
              últimas ejecuciones en robots
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
              :loading="loading"
              loading-text="Cargando datos...por favor espere"
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
                <div :class="[item.finished ? 'green--text text--darken-3' : 'yellow--text text--darken-3']">
                  {{ item.finished ? 'FINALIZADO' : 'EJECUTANDO' }}
                </div>
              </template>
              <template v-slot:[`item.state`]="{ item }">
                <div :class="[item.state == 'OK' ? 'green--text text--darken-3' : 'red--text text--darken-2']">
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
        loading: true,
        data: {},
        robotsOnline: 0,
        processesCompleted: 0,
        schedulesActives: 0,
        itProblems: 0,
        lastMonthChartApex: {
          options: {
            title: {
              text: 'Ejecuciones últimos 30 días',
            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            },
            noData: {
              text: 'Cargando...',
            },
            colors: ['#0aaec2'],

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: true,
                    position: 'bottom',
                  },
                },
              },
            ],
          },
          series: [],
        },
        dailyExecutionsChartApex: {
          options: {
            title: {
              text: 'Ejecuciones diarias',
            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              categories: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            },
            colors: ['#528254'],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: true,
                    position: 'bottom',
                  },
                },
              },
            ],
          },
          series: [],
        },
        monthlyExecutionsChartApex: {
          options: {
            title: {
              text: 'Ejecuciones mensuales',
            },
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              categories: ['En', 'Fe', 'Ma', 'Ab', 'Ma', 'Ju', 'Jul', 'Ag', 'Se', 'Oc', 'No', 'Di'],
            },
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true | '<img src="/static/icons/reset.png" width="20">',
              customIcons: [],
            },
            colors: ['#7d3c52'],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: true,
                    position: 'bottom',
                  },
                },
              },
            ],
          },
          series: [],
        },
        headers: [
          {
            sortable: true,
            text: 'Proceso',
            value: 'process_name',
          },
          {
            sortable: true,
            text: 'Planificación',
            value: 'id_schedule',
          },
          {
            sortable: true,
            text: 'Log',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Inicio',
            value: 'start_time',
          },
          {
            sortable: true,
            text: 'Fin',
            value: 'end_time',
          },
          {
            sortable: true,
            text: 'Robot',
            value: 'id_robot',
          },
          {
            sortable: true,
            text: 'Estado',
            value: 'finished',
          },
          {
            sortable: true,
            text: 'Resultado',
            value: 'state',
          },
        ],
        executions: [],
        tabs: 0,
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
          this.data = response.data
          this.robotsOnline = this.data.robots_online
          this.itProblems = this.data.process_problems
          this.processesCompleted = this.data.process_completed
          this.schedulesActives = this.data.process_actives

          // this.dailyExecutionsChartApex.series[0].data = this.data.execution_day_week.map(el => el.toFixed(1))
          this.dailyExecutionsChartApex.series.push({
            name: 'ejecuciones-diarias',
            data: this.data.execution_day_week.map(el => el.toFixed(1)),
          })

          // this.monthlyExecutionsChartApex.series[0].data.push(this.data.execution_month_year.map(el => el.toFixed(1)))
          this.monthlyExecutionsChartApex.series.push({
            name: 'ejecuciones-mensuales',
            data: this.data.execution_month_year.map(el => el.toFixed(1)),
          })

          // this.lastMonthChartApex.series[0].data = this.data.execution_day_month.map(el => el.toFixed(1))
          console.log(this.data.execution_day_month.map(el => el.toFixed(1)))
          this.lastMonthChartApex.series.push({
            name: 'ejecuciones-ultimo-mes',
            data: this.data.execution_day_month.map(el => el.toFixed(1)),
          })
        })
        .catch(error => {
          throw new Error(error)
        })
      LogsService.query()
        .then(response => {
          this.executions = response.data
          this.loading = false
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
      getExecution (idExecution) {
        SchedulesService.getForm(idExecution)
          .then(response => {

          })
          .catch(error => {
            throw new Error(error)
          })
      },
      goToExecution (value, data) {
        this.$router.push('/pages/logs/' + data.item.id)
      },
    },
  }
</script>
