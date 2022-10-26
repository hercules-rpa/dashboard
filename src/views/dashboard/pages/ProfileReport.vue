<template>
  <div>
    <v-container
      id="profile-recomendation"
      fluid
      tag="section"
    >
      <base-material-card
        icon="mdi-clipboard-text"
        title="Informe de Áreas temáticas"
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
                Ha ocurrido un error : Sesión caducada
              </h1>

              <div class="mt-10">
                <v-select
                  v-model="selectedInvestigador"
                  label="Investigador"
                  hint="Selecciona un investigador"
                  class="select-adjust"
                  item-text="nombre"
                  :items="arrayInvestigadores"
                  return-object
                  @change="selectChanged()"
                >
                  Investigadores
                </v-select>
              </div>
              <v-btn
                :disabled="invSingleSelected"
                class="white--text mt-5"
                color="green darken-1"
                depressed
                @click="downloadSingleReport()"
              >
                Descargar CSV Investigador
                <v-icon right>
                  mdi-download
                </v-icon>
              </v-btn>
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
              />
              <v-scroll-x-transition
                group
                hide-on-leave
              />
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider />
        <v-card-actions>
          <v-btn
            :disabled="invLoaded"
            class="white--text"
            color="blue darken-1"
            depressed
            @click="printToCSV()"
          >
            Descargar todos CSV
            <v-icon right>
              mdi-download
            </v-icon>
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </base-material-card>
    </v-container>
  </div>
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
        borrarDatosText: '¿ Desea borrar todos los datos de entrenamiento?',
        areasTematicasIniciales: [],
        tree: [],
        rating: [],
        itemsSelected: new Map(),
        items: [],
        error: false,
        invLoaded: true,
        invSingleSelected: true,
        code: '',
        dialog: false,
        dialog3: false,
        dialog4: false,
        perfilBase: false,
        token: '',
        codeDelete: '',
        contentRendered: false,
        progress: 0,
        generatingPdf: false,
        pdfDownloaded: false,
        areasToPrint: [],
        arrayInvestigadores: [],
        selectedInvestigador: null,
        json_fields: {
          areaTematica: 'nombre',
          Puntuacion: 'puntuacion',
        },
      }
    },
    computed: {

    },
    mounted: function () {
      this.loadData()
    },

    methods: {
      selectChanged () {
        this.invSingleSelected = false
      },
      downloadSingleReport () {
        const link = document.createElement('a')
        var strContent = ''
        // const blob = new Blob([this.log.data.replace(/(\\r)*\\n/g, '\n')], { type: 'application/txt' })

        for (var j = 0; j < this.selectedInvestigador.areasToPrint.length; j++) {
          const a = this.selectedInvestigador.areasToPrint[j]
          console.log('AREA ', a)
          strContent = strContent + a.nombre.replace(',', '') + ',' + a.puntuacion + '\n'
        }

        const blob = new Blob([strContent], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = this.selectedInvestigador.nombre.replace(' ', '') + '.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      printToCSV () {
        const link = document.createElement('a')
        var strContent = ''
        // const blob = new Blob([this.log.data.replace(/(\\r)*\\n/g, '\n')], { type: 'application/txt' })
        for (var i = 0; i < this.arrayInvestigadores.length; i++) {
          const inv = this.arrayInvestigadores[i]
          console.log('INV', inv)
          strContent = strContent + inv.nombre + ',' + inv.email + '\n'
          for (var j = 0; j < inv.areasToPrint.length; j++) {
            const a = inv.areasToPrint[j]
            console.log('AREA ', a)
            strContent = strContent + a.nombre.replace(',', '') + ',' + a.puntuacion + '\n'
          }
        }

        const blob = new Blob([strContent], { type: 'application/txt' })
        link.href = window.URL.createObjectURL(blob)
        link.download = 'InformeAreasTematicas.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      loadData () {
        this.token = this.$route.params.token
        ProfileRecommendationService.getAllProfiles()
          .then(response => {
            this.arrayInvestigadores = response.data
            this.arrayInvestigadores.forEach(investigador => {
              const areasInv = investigador.tree
              investigador.items = this.fillItemsNew(areasInv)
              investigador.areasToPrint = []
              this.buildResponse(investigador.items[0].children, investigador.areasToPrint)
              this.invLoaded = false
              console.log(investigador)
            })
          })
          .catch(error => {
            this.error = false
            this.code = error
            console.log(error)
            throw new Error(error)
          })
      },
      fillItemsNew (areasTematicas) {
        const children = areasTematicas.map(areatematica => ({
          id: areatematica.id,
          name: areatematica.descripcion,
          children: this.getChildren(areatematica),
          rating: areatematica.puntuacion,
          fuente: areatematica.fuente,
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
      buildResponse (array, areasList) {
        array.forEach(area => {
          if (area.rating > 0) {
            areasList.push({ idarea: area.id, puntuacion: area.rating, nombre: area.name })
          }
          if (area.children.length > 0) {
            this.buildResponse(area.children, areasList)
          }
        })
      },
      getChildren (areatematica) {
        const areasHijos = []
        if (areatematica[areatematica.id].length > 0) {
          // eslint-disable-next-line no-unused-vars
          for (const area of areatematica[areatematica.id]) {
            areasHijos.push({ id: area.id, name: area.descripcion, rating: area.puntuacion, fuente: area.fuente, children: this.getChildren(area) })
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

<style lang="sass">
.select-adjust
  width: 300px
</style>
