<template>
  <v-card
    class="mx-auto text-center"
    color="green"
    dark
    max-width="600"
  >
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :value="datos"
          color="rgba(255, 255, 255, .7)"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            ${{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">
        {{ property }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-center">
      <v-btn
        block
        text
      >
        {{ actionLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    name: 'TarjetaRobot',
    inheritAttrs: false,
    props: {
      datos: {
        type: Array,
        default: null,
      },
      property: {
        type: String,
        default: 'PROPERTY',
      },
      actionLabel: {
        type: String,
        default: 'Go To Report',
      },
    },
    data () {
      return {
      }
    },
    methods: {
    },
  }
</script>
