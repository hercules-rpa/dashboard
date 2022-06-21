<template>
  <v-card>
    <v-toolbar
      color="primary"
      dark
      flat
    >
      <v-icon>mdi-account-box</v-icon>
      <v-toolbar-title>Perfil de Recomendación</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col
        cols="12"
        md="12"
      >
        <v-card-text>
          <v-treeview
            v-model="tree"
            :items="items"
            selected-color="indigo"
            return-object
            item-key="id"
          >
            <template v-slot:label="{item}">
              <div class="row">
                <div class="columnAreas">
                  {{ item.name }}
                </div>
                <div class="columnRating">
                  <input
                    v-if="item.id != 0"
                    id="checkbox"
                    v-model="rating"
                    :value="item"
                    type="checkbox"
                    style="width:100%;align:right;margin: auto;"
                  >
                </div>
              </div>
            </template>
          </v-treeview>
        </v-card-text>
      </v-col>
      <v-divider vertical />

      <v-col
        cols="12"
        md="4"
      >
        <v-card-text>
          <div
            v-if="tree.length === 0"
            key="title"
            class="text-h4 font-weight-light pa-4 text-center"
          >
            <span> {{ rating }} </span>
          </div>

          <v-scroll-x-transition
            group
            hide-on-leave
          >
            <v-chip
              v-for="(selection, i) in tree"
              :key="i"
              color="grey"
              dark
              small
              class="ma-1"
            >
              <v-icon
                left
                small
              >
                mdi-beer
              </v-icon>
              {{ selection.name }}
            </v-chip>
          </v-scroll-x-transition>
        </v-card-text>
      </v-col>
    </v-row>

    <v-divider />
    <v-card-actions>
      <v-btn
        text
        @click="tree = [], rationg = []"
      >
        Reset
      </v-btn>
      <v-spacer />
      <v-btn
        class="white--text"
        color="green darken-1"
        depressed
      >
        Save
        <v-icon right>
          mdi-content-save
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { ProfileRecommendationService } from '@/common/api.service'
  export default {
    name: 'ProfileRecommendation',
    data () {
      return {
        fuentes: [
          {
            text: '',
            value: 'nombre',
            sortable: false,
          },
          {
            text: '',
            value: 'descripcion',
            sortable: false,
          },
        ],
        areastematicas: [],
        tree: [],
        rating: [],
      }
    },
    computed: {
      items () {
        const children = this.areastematicas.map(areatematica => ({
          id: areatematica.id,
          name: areatematica.descripcion,
          children: this.getChildren(areatematica),
        }))
        return [{
          id: 0,
          name: 'All Areas',
          children,
        }]
      },
    },
    mounted: function () {
      ProfileRecommendationService.query(this.$route.params.token)
        .then(response => {
          console.log(response.data)
          this.areastematicas = response.data
        })
        .catch(error => {
          throw new Error(error)
        })
    },

    methods: {
      getChildren (areatematica) {
        const areasHijos = []
        if (areatematica[areatematica.id].length > 0) {
          // eslint-disable-next-line no-unused-vars
          for (const area of areatematica[areatematica.id]) {
            areasHijos.push({ id: area.id, name: area.descripcion, children: this.getChildren(area) })
          }
        }

        return areasHijos
      },
    },
  }

</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
<style scoped>
.treeview-item {
  display:inline-block;;
  position:absolute;
  width:100%;
}

.row {
  display: flex;
}
.columnAreas {
  display: block;
  position:relative;
  width: 75%;
  padding: 15px;
  padding-left: 15px;
  overflow: hidden;
  margin: 0 auto;
}
.columnRating {
  display: block;
  position:relative;
  width: 20%;
  padding: 15px;
  margin: 0 auto;
}

</style>
