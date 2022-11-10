<template>
  <div>
    <v-dialog
      v-model="dialogEditAll"
      width="80%"
    >
      <v-card class="text-center">
        <v-card-title>
          Editar criterios

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialogEditAll = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <v-jsoneditor
              v-model="comisiones"
              :options="options"
              :plus="false"
              height="600px"
              @error="onErrorEditor"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green"
            text
            @click="guardarTodo()"
          >
            Guardar
          </v-btn>
          <v-btn
            color="red"
            text
            @click="dialogEditAll = false"
          >
            Salir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      width="80%"
    >
      <v-card class="text-center">
        <v-card-title>
          Editar criterio

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialogEdit = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <v-jsoneditor
              v-model="json"
              :options="options"
              :plus="false"
              height="600px"
              @error="onErrorEditor"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green"
            text
            @click="guardarCriterio()"
          >
            Guardar
          </v-btn>
          <v-btn
            color="red"
            text
            @click="dialogEdit = false"
          >
            Salir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogReset"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          ¿ Desea resetear el configurador a su estado original ?
          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialogReset = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            class="mr-3"
            text
            @click="dialogReset = false"
          >
            No
          </v-btn>

          <v-btn
            color="red"
            text
            @click="resetDefaultConfig()"
          >
            Sí
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container
      id="form"
      fluid
      tag="section"
    >
      <v-card
        class="px-5 py-3"
      >
        <v-card-title>
          <v-icon class="mr-3">
            mdi-cog
          </v-icon>Process Settings - {{ this.$route.params.configPath.replaceAll('+', ' ') }}
        </v-card-title>
        <v-container
          class="py-0"
        >
          <v-row class="mt-5 mb-5">
            <v-col
              v-if="schema !== null "
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="search"
                class="mb-5 search-adjust"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              />
              <v-btn
                color="primary"
                class="ma-2 white--text"
                @click="editarAMano()"
              >
                EDICIÓN MANUAL
                <v-icon
                  right
                  dark
                >
                  mdi-plus
                </v-icon>
              </v-btn>
              <v-btn
                color="#de9c18"
                class="ma-2 white--text"
                @click="dialogReset = true"
              >
                Congiuración por defecto
                <v-icon
                  right
                  dark
                >
                  mdi-arrow-u-left-top
                </v-icon>
              </v-btn>
              <v-data-table
                :headers="headers"
                :items="comisionesArray"
                single-select
                :search="search"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
              >
                <template v-slot:[`item.controls`]="{ item }">
                  <v-btn
                    class="ma-2"
                    outlined
                    x-small
                    fab
                    color="primary"
                    @click="editCriterio(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <v-row />
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>
<script>
  import { ProcessSettingsService } from '@/common/api.service'
  export default {
    name: 'Form',
    data () {
      return {
        criterioId: {},
        search: '',
        options: {},
        sortBy: 'created',
        sortDesc: true,
        dialogEditAll: false,
        dialogReset: false,
        dialogEdit: false,
        generalOptions: { priority: 1 },
        timeSchedule: {},
        executions: [],
        comisionesArray: [],
        json: {},
        headers: [
          {
            sortable: true,
            text: 'Nombre',
            value: 'value.name',
          },
          {
            sortable: true,
            text: 'Id',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Autoria',
            value: 'value.autoria_orden',
          },
          {
            sortable: false,
            text: 'Libros',
            value: 'value.libros',
          },
          {
            sortable: false,
            text: 'Congresos',
            value: 'value.congresos',
          },
          {
            text: '',
            value: 'controls',
            sortable: false,
          },
        ],
        comisiones: {},
        foreverValue: false,
        concreteValue: false,
        processParameters: {},
        params: {},
        tscheduleFormatted: {},
        dialog: false,
        dialogAlert: false,
        test: false,
        testSchema: {},
      }
    },
    mounted: function () {
      ProcessSettingsService.getConfig(this.$route.params.configPath.replaceAll('+', '/'))
        .then(response => {
          this.comisiones = response.data

          const it = Object.entries(this.comisiones)
          it.forEach(resp => {
            this.comisionesArray.push({ id: resp[0], value: resp[1] })
          })
        })
        .catch((error) => {
          throw new Error(error)
        })
    },
    methods: {
      crearArrayConfigs () {
        const it = Object.entries(this.comisiones)
        it.forEach(resp => {
          this.comisionesArray.push({ id: resp[0], value: resp[1] })
        })
      },
      editCriterio (criterio) {
        this.criterioId = criterio.id
        this.json = this.comisiones[criterio.id]
        this.dialogEdit = true
      },
      guardarCriterio () {
        this.comisiones[this.criterioId] = this.json
        ProcessSettingsService.editConfig(this.$route.params.configPath.replaceAll('+', '/'), this.comisiones)
          .then(response => {
            if (response.status === 200) {

            }
          })
          .catch((error) => {
            throw new Error(error)
          })
        this.dialogEdit = false
      },
      onErrorEditor () {

      },
      guardarTodo () {
        ProcessSettingsService.editConfig(this.$route.params.configPath.replaceAll('+', '/'), this.comisiones)
          .then(response => {
            if (response.status === 200) {

            }
          })
          .catch((error) => {
            throw new Error(error)
          })

        this.dialogEditAll = false
      },
      resetDefaultConfig () {
        ProcessSettingsService.resetConfig(this.$route.params.configPath.replaceAll('+', '/'))
          .then(response => {
            if (response.status === 200) {
              this.dialogReset = false
            } else {
              alert('Error')
            }
          })
          .catch((error) => {
            throw new Error(error)
          })
      },
      editarAMano () {
        this.dialogEditAll = true
      },
    },
  }
</script>
<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss'
</style>
<style lang="sass">
.search-adjust
  width: 200px
</style>
