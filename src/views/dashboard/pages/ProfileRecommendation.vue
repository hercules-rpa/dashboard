<template>
  <v-container
    id="new-process"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Profile Recomendation"
      class="px-5 py-3"
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-card-text>
            <h1
              v-if="error"
              class="mt-10 red--text"
            >
              Ha ocurrido un error : {{ code }}
            </h1>
            <v-treeview
              v-if="!error"
              v-model="tree"
              rounded
              hoverable
              :items="items"
              selection-type="leaf"
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
                    <v-rating
                      v-if="item.id != 0"
                      v-model="item.rating"
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      half-icon="mdi-star-half-full"
                      hover
                      background-color="grey"
                      color="orange"
                      yellow
                      length="5"
                      size="20"
                      :value="item.rating"
                      @input="selectItem(item)"
                    />
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
              <span>Rating : {{ rating }} </span>
              <span>Tree : {{ tree }}</span>
            </div>
            <div><span>Tree : {{ tree }}</span></div>
            <div><span>Tree : {{ itemsSelected.values() }}</span></div>
            <div><span>Tree : {{ items.values() }}</span></div>
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
          @click="initialize()"
        >
          Reset
        </v-btn>
        <v-spacer />
        <v-btn
          class="white--text"
          color="green darken-1"
          depressed
          @click="save()"
        >
          Enviar
          <v-icon right>
            mdi-send
          </v-icon>
        </v-btn>
      </v-card-actions>
    </base-material-card>
  </v-container>
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
        areasTematicasIniciales: [],
        tree: [],
        rating: [],
        itemsSelected: new Map(),
        items: [],
        error: false,
        code: '',
      }
    },
    computed: {
    },
    mounted: function () {
      ProfileRecommendationService.query(this.$route.params.token)
        .then(response => {
          this.code = response.status
          console.log(response.status)
          if (response.status === 200) {
            console.log(response.data)
            this.areastematicas = response.data
            this.areasTematicasIniciales = response.data
            this.items = this.fillItems()
            this.error = false
          } else {
            this.error = true
          }
        })
        .catch(error => {
          this.error = true
          this.code = error
          console.log(error)
          throw new Error(error)
        })
    },

    methods: {
      fillItems () {
        const children = this.areastematicas.map(areatematica => ({
          id: areatematica.id,
          name: areatematica.descripcion,
          children: this.getChildren(areatematica),
          rating: areatematica.puntuacion,
        }))
        return [{
          id: 0,
          name: 'Áreas Temáticas',
          children,
        }]
      },
      fillChildrenRecursive (padre) {
        // console.log('recursive')
        if (padre.children.length > 0) {
          padre.children.forEach(hijo => {
            hijo.rating = padre.rating
            this.fillChildrenRecursive(hijo)
          })
        }
      },
      isInAnyChildren (item) {
        this.itemsSelected.forEach(element => {
          return this.isInItem(element, item.id)
        })
      },
      isInItem (item, id) {
        if (item.children.length > 0) {
          item.children.forEach(hijo => {
            if (id === hijo.id) {
              return true
            } else {
              this.isInItem(hijo, id)
            }
          })
        } else {
          return false
        }
      },
      selectItem (item) {
        if (!this.isInAnyChildren(item)) {
          this.itemsSelected.set(item.id, item)
          // item.select()

          this.fillChildrenRecursive(item)

          // this.tree.push(this.item)
          console.log(this.items)
          console.log('ITEM :', item)
          console.log(this.itemsSelected)
        }
      },
      buildResponse (array, areasList) {
        array.forEach(area => {
          if (area.rating > 0) {
            areasList.push({ idarea: area.id, puntuacion: area.rating })
          }
          if (area.children.length > 0) {
            this.buildResponse(area.children, areasList)
          }
        })
      },
      save () {
        console.log('ITEMSINICIAL : ', this.items)
        const areasList = []
        this.buildResponse(this.items[0].children, areasList)
        console.log('AREASLIST : ', areasList)
        ProfileRecommendationService.register(this.$route.params.token, areasList)
          .then(response => {
            console.log(response)
          }).catch(error => {
            throw new Error(error)
          })
      },
      initialize () {
        this.areastematicas = this.areasTematicasIniciales
        this.items = this.fillItems()
        console.log(this.areastematicas)
        console.log(this.areasTematicasIniciales)
      },

      getChildren (areatematica) {
        const areasHijos = []
        if (areatematica[areatematica.id].length > 0) {
          // eslint-disable-next-line no-unused-vars
          for (const area of areatematica[areatematica.id]) {
            areasHijos.push({ id: area.id, name: area.descripcion, rating: area.puntuacion, children: this.getChildren(area) })
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
