<template>
  <div>
    <v-dialog
      v-model="dialog4"
      max-width="500"
    >
      <v-card class="text-center">
        <v-card-title>
          <span v-if="codeDelete === 200">Los datos de entrenamiento se han borrado correctamente</span><span v-else>Ha ocurrido un error al borrar los datos de entrenamiento</span>

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="cerrarDialogEntrenamiento"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="codeDelete === 200">
          Datos de entrenamiento borrados correctamente<span v-if="perfilBase">, se ha cargado el perfil base</span>s
        </v-card-text><v-card-text v-else>
          Ha ocurrido un error al realizar la petición -> codigo de error {{ codeDelete }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            text
            @click="cerrarDialogEntrenamiento"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card class="text-center">
        <v-card-title>
          <span v-if="code === 201">Información enviada correctamente</span><span v-else>Ha ocurrido un error al realizar la petición</span>

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="code === 201">
          Información enviada correctamente
        </v-card-text><v-card-text v-else>
          Ha ocurrido un error al realizar la petición -> codigo de error {{ code }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            text
            @click="cerrarDialog"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog3"
      max-width="400"
      height="500"
    >
      <v-card>
        <v-card-title>
          {{ borrarDatosText }}
          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog3 = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text class="pb-6 pt-12 text-center">
          <v-row
            justify="center"
          >
            <v-col
              cols="12"
              md="6"
              class="mt-4"
            >
              ¿ Cargar perfil base ?
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-switch
                v-model="perfilBase"
                class="switch-center"
              />
            </v-col>
          </v-row>
          <v-btn
            class="mr-3"
            text
            @click="dialog3 = false"
          >
            No
          </v-btn>

          <v-btn
            color="red"
            text
            @click="borrarDatosEntrenamiento(token,perfilBase)"
          >
            Sí
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <vue-html2pdf
      ref="html2Pdf"
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"

      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->

        <h1 class="title-header">
          REPORTE SOBRE ÁREAS SELECCIONADAS:
        </h1>
        <br>
        <li
          v-for="item in areasToPrint"
          :key="item"
        >
          {{ item.nombre }}, puntuación: {{ item.puntuacion }}
        </li>
      </section>
    </vue-html2pdf>
    <v-container
      id="profile-recomendation"
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
                Ha ocurrido un error : Sesión caducada
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
                    <div
                      v-if="!item.fuente"
                      class="columnRating"
                    >
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
            text
            color="blue darken-1"
            @click="initialize()"
          >
            Limpiar
          </v-btn>
          <v-btn
            text
            color="blue darken-1"
            @click="borrarDatosDialog()"
          >
            Borrar datos de entrenamiento
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="error"
            class="white--text"
            color="blue darken-1"
            depressed
            @click="downloadPdf()"
          >
            Descargar
            <v-icon right>
              mdi-download
            </v-icon>
          </v-btn>
          <v-btn
            :disabled="error"
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
      }
    },
    computed: {

    },
    mounted: function () {
      this.loadData()
    },

    methods: {
      async downloadPdf () {
        const areasList = []
        this.buildResponse(this.items[0].children, areasList)
        this.areasToPrint = areasList

        this.$refs.html2Pdf.generatePdf()
      },
      onProgress (progress) {
        this.progress = progress
      },
      startPagination () {

      },
      hasPaginated () {

      },
      async beforeDownload ({ html2pdf, options, pdfContent }) {

      },
      hasDownloaded (blobPdf) {
        this.pdfDownloaded = true
      },
      loadData () {
        this.token = this.$route.params.token
        ProfileRecommendationService.query(this.$route.params.token)
          .then(response => {
            this.code = response.status

            if (response.status === 200) {
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

            throw new Error(error)
          })
      },
      fillItems () {
        const children = this.areastematicas.map(areatematica => ({
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
        //
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

          this.fillChildrenRecursive(item)
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
      cerrarDialog () {
        this.dialog = false
        this.$router.go()
      },
      cerrarDialogEntrenamiento () {
        this.dialog4 = false
        this.$router.go()
      },
      save () {
        const areasList = []
        this.buildResponse(this.items[0].children, areasList)

        ProfileRecommendationService.register(this.$route.params.token, areasList)
          .then(response => {
            this.code = response.status

            if (this.response.status === 201) {
              this.dialog = true
            } else {
              this.dialog = true
            }
          }).catch(error => {
            this.dialog = true
            throw new Error(error)
          })
      },
      initialize () {
        this.areastematicas = this.areasTematicasIniciales
        this.items = this.fillItems()
      },
      borrarDatosDialog () {
        this.perfilBase = false
        this.dialog3 = true
      },
      borrarDatosEntrenamiento (token, perfilBase) {
        this.dialog3 = false
        ProfileRecommendationService.borrarDatosEntrenamiento(token, perfilBase)
          .then(response => {
            this.codeDelete = response.status

            if (this.response.status === 200) {
              this.dialog4 = true
            } else {
              this.dialog4 = true
            }
            this.loadData()
          }).catch(error => {
            this.dialog4 = true
            throw new Error(error)
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
<style scoped>
.treeview-item {
  display:inline-block;;
  position:absolute;
  width:100%;
}
.switch-center {
  display: flex;
  justify-content: center;
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
