<template>
  <v-container
    id="robots"
    fluid
    tag="section"
  >
    <v-checkbox
      v-model="showOffline"
      :label="`Show Offline Robots`"
    />
    <v-row>
      <v-col
        v-for="robot in robotsOnline"
        :key="robot"
        cols="12"
        sm="3"
        md="4"
      >
        <v-hover>
          <tarjeta-robot
            hover
            :color="robot.online ? 'green':'red'"
            d-flex
            icon="mdi-robot"
            :robot-name="`${robot.robot_name}`"
            :robot-id="`${robot.robot_id}`"
            :ip-address="`${robot.robot_address}`"
            :process="robot.process_running"
            :online="robot.online"
            :last-seen="robot.last_seen"
            @click.native="$router.push(`/pages/robots/${robot.robot_id}`)"
          />
        </v-hover>
      </v-col>
    </v-row>
    <v-row v-if="showOffline">
      <v-divider />
    </v-row>
    <v-row v-if="showOffline">
      <v-col
        v-for="robot in robotsOffline"
        :key="robot"
        cols="12"
        sm="3"
        md="4"
      >
        <v-hover>
          <tarjeta-robot
            hover
            :color="robot.online ? 'green':'red'"
            d-flex
            icon="mdi-robot"
            :robot-name="`${robot.robot_name}`"
            :robot-id="`${robot.robot_id}`"
            :ip-address="`${robot.robot_address}`"
            :process="robot.process_running"
            :online="robot.online"
            :last-seen="robot.last_seen"
            @click.native="$router.push(`/pages/robots/${robot.robot_id}`)"
          />
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TarjetaRobot from '../../../components/TarjetaRobot'
  import { RobotsService } from '@/common/api.service'
  export default {
    name: 'Robots',
    components: { TarjetaRobot },

    data () {
      return {
        polling: null,
        robots: [],
        robotsOffline: [],
        robotsOnline: [],
        showOffline: true,
      }
    },
    mounted: function () {
      RobotsService.query().then(response => {
        console.log(response.data)
        this.robots = response.data
        this.robots.forEach(robot => {
          robot.online ? this.robotsOnline.push(robot) : this.robotsOffline.push(robot)
        })
      }).catch(error => {
        throw new Error(error)
      })
    },
    created () {
      this.pollData()
    },
    beforeDestroy () {
      clearInterval(this.polling)
    },
    methods: {
      pollData () {
        this.polling = setInterval(() => {
          RobotsService.query().then(response => {
            console.log(response.data)
            this.robots = response.data
            // TODO: mejorar esto por que es una mierda
            this.robotsOnline = []
            this.robotsOffline = []
            this.robots.forEach(robot => {
              if (robot.online) {
                this.robotsOnline.push(robot)
              } else if (!robot.online) {
                this.robotsOffline.push(robot)
              }
            })
          }).catch(error => {
            throw new Error(error)
          })
        }, 1000)
      },
    },
  }
</script>
