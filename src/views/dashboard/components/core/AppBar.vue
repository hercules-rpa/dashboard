<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$router.go(-1)"
    >
      <v-icon>
        mdi-arrow-left
      </v-icon>
    </v-btn>
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>
      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-spacer />

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/dashboard"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      :key="text"
      offset-y
      :rounded="rounded"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="selectSection(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  // Components

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {

    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        notifications: [
        ],
        items: [
          { title: 'Logout' },
        ],
      }
    },

    computed: {
      ...mapState(['drawer']),
    },
    mounted: function () {

    },

    methods: {
      selectSection (item) {
        if (item.title === 'Logout') {
          this.$store.dispatch('logoutAction')
          this.$router.push({ path: '/' })
        }
        if (item.title === 'Preferencias') {
          this.$router.push({ path: '/pages/user' })
        }
      },
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
    },
  }
</script>
