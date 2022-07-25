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
                EDITAR A MANO
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
        comisionesAux: {
          1: {
            name: 'Matemáticas',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              ncontribuciones_mas_relevantes: 4,
            },
          },
          2: {
            name: 'Física',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                O1: {
                  n_relevantes: 4,
                  min_publicaciones: 50,
                  t1_publicaciones: 30,
                },
                O2: {
                  n_relevantes: 4,
                  min_publicaciones: 50,
                  t1t2_publicaciones: 30,
                },
                O3: {
                  n_relevantes: 4,
                  min_publicaciones: 38,
                  t1_publicaciones: 38,
                },
              },
              titularidad: {
                O1: {
                  n_relevantes: 4,
                  min_publicaciones: 22,
                  t1_publicaciones: 14,
                },
                O2: {
                  n_relevantes: 4,
                  min_publicaciones: 22,
                  t1t2_publicaciones: 22,
                },
                O3: {
                  n_relevantes: 4,
                  min_publicaciones: 17,
                  t1_publicaciones: 17,
                },
              },
            },
          },
          3: {
            name: 'Química',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                n_relevantes: 4,
                min_publicaciones: 50,
                t1_publicaciones: 25,
                t1_ap_publicaciones: 4,
                max_anyo: 15,
              },
              titularidad: {
                n_relevantes: 4,
                min_publicaciones: 20,
                t1_publicaciones: 15,
                t1_ap_publicaciones: 4,
                max_anyo: 10,
              },
            },
          },
          4: {
            name: 'Ciencias de la naturaleza',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                B: {
                  num_publicaciones: 40,
                  min_publicaciones: 30,
                  t1_publicaciones: 10,
                  min_t1_publicaciones: 8,
                  t1_t2publicaciones: 25,
                  min_t1_t2publicaciones: 22,
                  max_anyo: 10,
                  autoria_preferente: 10,
                },
              },
              titularidad: {
                B: {
                  num_publicaciones: 15,
                  min_publicaciones: 11,
                  t1_publicaciones: 5,
                  min_t1_publicaciones: 4,
                  t1_t2publicaciones: 10,
                  min_t1_t2publicaciones: 8,
                  max_anyo: 10,
                  autoria_preferente: 4,
                },
              },
            },
          },
          5: {
            name: 'Biología Celular y Molecular',
            autoria_orden: true,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                B100: {
                  min_publicaciones: 40,
                  t1_articulos: 20,
                  n_autoria_preferente: 10,
                },
                B75: {
                  min_publicaciones: 30,
                  t1_articulos: 15,
                  n_autoria_preferente: 8,
                },
              },
              titularidad: {
                B100: {
                  min_publicaciones: 20,
                  t1_articulos: 10,
                  n_autoria_preferente: 5,
                  n_relevantes: 4,
                },
                B75: {
                  min_publicaciones: 15,
                  t1_articulos: 8,
                  n_autoria_preferente: 4,
                  n_relevantes: 4,
                },
              },
            },
          },
          6: {
            name: 'Ciencias biomédicas',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                A: {
                  n_relevantes: 4,
                  min_publicaciones: 100,
                  t1_publicaciones: 75,
                  n_autoria_principal: 75,
                },
                A2: {
                  n_relevantes: 4,
                  min_publicaciones: 100,
                  d1_publicaciones: 65,
                  t1_ap_publicaciones: 40,
                },
                B: {
                  n_relevantes: 4,
                  min_publicaciones: 50,
                  t1_publicaciones: 25,
                  t2_publicaciones: 15,
                  n_autoria_principal: 25,
                  t1_ap_publicaciones: 10,
                },
                B2: {
                  n_relevantes: 4,
                  min_publicaciones: 30,
                  d1_publicaciones: 20,
                  n_autoria_principal: 20,
                  t1_ap_publicaciones: 12,
                },
                B3: {
                  n_relevantes: 4,
                  min_publicaciones: 40,
                  t1_publicaciones: 20,
                  n_autoria_principal: 20,
                  t1_ap_publicaciones: 10,
                },
                C: {
                  n_relevantes: 4,
                  min_publicaciones: 32,
                  t1_publicaciones: 16,
                  n_autoria_principal: 16,
                  t1_ap_publicaciones: 8,
                  proyectos_ip: 16,
                },
                C2: {
                  n_relevantes: 4,
                  min_publicaciones: 24,
                  d1_publicaciones: 16,
                  n_autoria_principal: 16,
                  t1_ap_publicaciones: 10,
                  proyectos_ip: 12,
                },
                C3: {
                  n_relevantes: 4,
                  min_publicaciones: 28,
                  t1_publicaciones: 14,
                  n_autoria_principal: 14,
                  t1_ap_publicaciones: 7,
                  proyectos_ip: 14,
                },
              },
              titularidad: {
                A: {
                  n_relevantes: 4,
                  min_publicaciones: 50,
                  t1_publicaciones: 25,
                  t2_publicaciones: 15,
                  n_autoria_principal: 25,
                  t1_ap_publicaciones: 40,
                },
                A2: {
                  n_relevantes: 4,
                  min_publicaciones: 30,
                  d1_publicaciones: 20,
                  n_autoria_principal: 20,
                  t1_ap_publicaciones: 12,
                },
                B: {
                  n_relevantes: 4,
                  min_publicaciones: 25,
                  t1_publicaciones: 12,
                  t2_publicaciones: 10,
                  n_autoria_principal: 25,
                  t1_ap_publicaciones: 10,
                  proyectos_ip: 25,
                },
                B2: {
                  n_relevantes: 4,
                  min_publicaciones: 30,
                  d1_publicaciones: 20,
                  n_autoria_principal: 20,
                  t1_ap_publicaciones: 12,
                },
                B3: {
                  n_relevantes: 4,
                  min_publicaciones: 40,
                  t1_publicaciones: 20,
                  n_autoria_principal: 20,
                  t1_ap_publicaciones: 10,
                  proyectos_ip: 20,
                },
                C: {
                  n_relevantes: 4,
                  min_publicaciones: 32,
                  t1_publicaciones: 16,
                  n_autoria_principal: 16,
                  t1_ap_publicaciones: 8,
                  proyectos_ip: 16,
                },
                C2: {
                  n_relevantes: 4,
                  min_publicaciones: 24,
                  d1_publicaciones: 16,
                  n_autoria_principal: 16,
                  t1_ap_publicaciones: 10,
                  proyectos_ip: 12,
                },
                C3: {
                  n_relevantes: 4,
                  min_publicaciones: 28,
                  t1_publicaciones: 14,
                  n_autoria_principal: 14,
                  t1_ap_publicaciones: 7,
                  proyectos_ip: 14,
                },
              },
            },
          },
          7: {
            name: 'Medicina clínica y especialidades clínicas',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                n_relevantes: 4,
                min_publicaciones: 40,
                t1_publicaciones: 20,
                min_autor: 15,
                t1_ap_publicaciones: 10,
              },
              titularidad: {
                n_relevantes: 4,
                min_publicaciones: 22,
                t1_publicaciones: 12,
                min_autor: 8,
                t1_ap_publicaciones: 5,
              },
            },
          },
          8: {
            name: 'Otras especialidades sanitarias',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                A: {
                  min_publicaciones: 100,
                  n_autoria_preferente: 75,
                  t1_ap_publicaciones: 40,

                },
                B: {
                  min_publicaciones: 50,
                  n_autoria_preferente: 25,
                  t1_ap_publicaciones: 10,
                },
                C: {
                  min_publicaciones: 32,
                  n_autoria_preferente: 16,
                  t1_ap_publicaciones: 8,
                },
              },
              titularidad: {
                A: {
                  min_publicaciones: 50,
                  n_autoria_preferente: 25,
                  t1_ap_publicaciones: 10,

                },
                B: {
                  min_publicaciones: 20,
                  n_autoria_preferente: 10,
                  t1_ap_publicaciones: 5,
                },
                C: {
                  min_publicaciones: 12,
                  n_autoria_preferente: 7,
                  t1_ap_publicaciones: 3,
                },
              },
            },
          },
          9: {
            name: 'Ingeniería química, de los materiales y del medio natural',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          10: {
            name: 'Ingeniería mecánica y de la navegación',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          11: {
            name: 'Ingeniería eléctrica y de las telecomunicaciones',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: true,
            criterio: {
              catedra: {
                n_relevantes: 30,
                n_muy_relevantes: 20,
              },
              titularidad: {
                n_relevantes: 12,
                n_muy_relevantes: 8,
              },
            },

          },
          12: {
            name: 'Ingeniería informática',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: true,
            criterio: {
              catedra: {
                A: {
                  n_relevantes: 50,
                  n_muy_relevantes: 25,
                },
                B: {
                  n_relevantes: 28,
                  n_muy_relevantes: 14,
                },

              },
              titularidad: {
                A: {
                  n_relevantes: 24,
                  n_muy_relevantes: 12,
                },
                B: {
                  n_relevantes: 12,
                  n_muy_relevantes: 6,
                },
              },
            },
          },
          13: {
            name: 'Arquitectura, ingeniería civil, construcción y urbanismo',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          14: {
            name: 'Derecho',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          15: {
            name: 'Ciencias económicas y ciencias empresariales',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                A: {
                  n_relevantes: 4,
                  n1_publicaciones: 8,
                  n2_publicaciones: 4,
                },
                B: {
                  n_relevantes: 4,
                  d1_publicaciones: 6,
                },

              },
              titularidad: {
                A: {
                  n_relevantes: 4,
                  n1_publicaciones: 4,
                  n2_publicaciones: 2,
                },
                B: {
                  n_relevantes: 4,
                  d1_publicaciones: 3,
                },
              },
            },

          },
          16: {
            name: 'Ciencias económicas y ciencias empresariales',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                A: {
                  n_relevantes: 4,
                  n1_publicaciones: 8,
                  n2_publicaciones: 4,
                },
                B: {
                  n_relevantes: 4,
                  d1_publicaciones: 6,
                },

              },
              titularidad: {
                A: {
                  n_relevantes: 4,
                  n1_publicaciones: 4,
                  n2_publicaciones: 2,
                },
                B: {
                  n_relevantes: 4,
                  d1_publicaciones: 3,
                },
              },
            },
          },
          17: {
            name: 'Ciencias de la educación',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          18: {
            name: 'Ciencias del comportamiento',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                B: {
                  min_publicaciones: 20,
                  q1q2_articulos: 10,
                  q1q2_ap_articulos: 6,
                },
                B2: {
                  min_publicaciones: 16,
                  q1q2_articulos: 8,
                  q1q2_ap_articulos: 5,
                },
                min_porcentaje: 80,
              },
              titularidad: {
                B: {
                  min_publicaciones: 10,
                  q1q2_articulos: 6,
                  q1q2_ap_articulos: 4,
                },
                B2: {
                  min_publicaciones: 8,
                  q1q2_articulos: 5,
                  q1q2_ap_articulos: 3,
                },
                min_porcentaje: 80,
              },
            },
          },
          19: {
            name: 'Ciencias sociales',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                A: {
                  min_publicaciones: 40,
                  l1l2_publicaciones: 16,
                },
                B: {
                  min_publicaciones: 30,
                  l1_publicaciones: 4,
                  l2_publicaciones: 8,
                },
                C: {
                  min_publicaciones: 24,
                  l1_publicaciones: 3,
                  l2_publicaciones: 6,
                },
                min_porcentaje: 80,
              },
              titularidad: {
                A: {
                  min_publicaciones: 24,
                  l1l2_publicaciones: 8,
                },
                B: {
                  min_publicaciones: 20,
                  l1l2_publicaciones: 4,
                },
                C: {
                  min_publicaciones: 16,
                  l1l2_publicaciones: 4,
                },
                min_porcentaje: 80,
              },
            },
          },
          20: {
            name: 'Historia, filosofía y geografía - Historia del arte y expresión artística',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
          },
          21: {
            name: 'Filología y lingüística',
            autoria_orden: false,
            autoria_str: '',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            criterio: {
              catedra: {
                B: {
                  n_relevantes: 4,
                  min_publicaciones: 30,
                  n1_publicaciones: 12,
                },
                min_porcentaje: 75,
              },
              titularidad: {
                B: {
                  min_publicaciones: 15,
                  n1_publicaciones: 6,
                },
                min_porcentaje: 75,
              },
            },
          },
        },
        comites: {
          1: {
            name: 'Matemáticas y Física',
            autoria_orden: false,
            autoria_str: 'No relevante la posición',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            patentes: false,
          },
          2: {
            name: 'Química',
            autoria_orden: true,
            autoria_str: 'Relevante, preferible mejor posición',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: true,
            criterio: {
              min_publicaciones: 5,
              puntuaciones: {
                puntuacion_q1: 6.5,
                puntuacion_q2: 2,
                puntuacion_libro: 1,
                puntuacion_capitulo_libro: 0.5,
              },
            },
          },
          3: {
            name: 'Biología Celular y Molecular',
            autoria_orden: true,
            autoria_str: 'Relevante, preferible mejor posición',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: true,
            criterio: {
              criterio1: {
                num_publicaciones_q1: 5,
              },
              criterio2: {
                num_publicaciones_q2: 5,
                num_firmante_destacado: 3,
              },
              criterio3: {
                num_publicaciones_d1: 3,
                num_publicaciones_q1: 4,
                num_firmante_destacado_q1: 2,
              },
              criterio4: {
                num_publicaciones_q1q2: 5,
              },
              puntuaciones: {
                puntuacion_no_jcr_publicaciones: 0,
                puntuacion_q1_autoria_destacada: 9,
                puntuacion_q2_autoria_destacada: 7,
                puntuacion_q3_autoria_destacada: 5,
                puntuacion_q4_autoria_destacada: 3,
                puntuacion_d1_autoria_destacada: 10,
                puntuacion_q1_autoria_secundaria: 8,
                puntuacion_q2_autoria_secundaria: 6,
                puntuacion_q3_autoria_secundaria: 4,
                puntuacion_q4_autoria_secundaria: 2,
                puntuacion_d1_autoria_secundaria: 9.5,
                puntuacion_q1_mas_6_autores: 7,
                puntuacion_q2_mas_6_autores: 5,
                puntuacion_q3_mas_6_autores: 3,
                puntuacion_q4_mas_6_autores: 1,
                puntuacion_d1_mas_6_autores: 9,
                puntuacion_libros_autoria_destacada: 3,
                puntuacion_libros_autoria_secundaria: 2,
                puntuacion_libros_mas_6_autores: 1,
                puntuacion_capitulos_libros_autoria_destacada: 3,
                puntuacion_capitulos_libros_autoria_secundaria: 2,
                puntuacion_capitulos_libros_mas_6_autores: 1,
              },
            },
          },
          4: {
            name: 'Ciencias Biomédicas',
            autoria_orden: true,
            autoria_str: 'Relevante, preferible mejor posición',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              criterio1: {
                num_relevancia_alta: 2,
                num_relevancia_media: 3,
              },
              criterio2: {
                num_relevancia_media: 1,
                num_relevancia_alta: 3,
                num_relevancia_baja: 1,
              },
              criterio3: {
                num_relevancia_alta: 4,
                num_relevancia_baja: 1,
              },
              puntuaciones: {
                puntuacion_q1: 7.6,
                puntuacion_q2: 5.1,
                puntuacion_q3: 2.6,
                puntuacion_q4: 0.1,
              },
              max_aportaciones_libros_capitulos: 1,
            },
          },
          5: {
            name: 'Ciencias de la Naturaleza',
            autoria_orden: false,
            autoria_str: 'No relevante la posición pero muchos autores puede bajar la evaluación, justificar carga de trabajo y aportación',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              min_publicaciones: 5,
              puntuaciones: {
                puntuacion_q1: 8,
                puntuacion_q2: 7,
                puntuacion_q3: 6,
                puntuacion_q4: 1,
                puntuacion_d1: 9,
              },
            },
          },
          6: {
            name: 'Tecnologías Mecánicas y de la producción',
            autoria_orden: false,
            autoria_str: 'No relevante la posición, justificar carga de trabajo y aportación',
            alerta_autores: -1,
            libros: true,
            congresos: false,
            patentes: false,
          },
          7: {
            name: 'Ingenierías de la Comunicación, Computación y Electrónica',
            autoria_orden: false,
            autoria_str: 'No relevante la posición, justificar carga de trabajo y aportación',
            alerta_autores: 6,
            libros: true,
            congresos: true,
            patentes: true,
            criterio: {
              criterio1: {
                num_relevancia_media: 1,
                num_relevancia_alta: 2,
              },
              criterio2: {
                num_relevancia_media: 3,
                num_relevancia_alta: 1,
              },
              puntuaciones: {
                puntuacion_q1: 10,
                puntuacion_q2: 10,
                puntuacion_q3: 6,
                puntuacion_q4: 3,
                puntuacion_congresos_clase1_ggs: 10,
                puntuacion_congresos_clase2_ggs: 6,
                puntuacion_congresos_clase3_ggs: 3,
                puntuacion_patente_internacional: 10,
                puntuacion_patente_nacional_explotacion: 6,
                puntuacion_patente_nacional_no_explotacion: 3,
                puntuacion_libro_investigacion: 6,
                puntuacion_capitulo_libro_investigacion: 3,
              },
            },
          },
          8: {
            name: 'Arquitectura, Ingeniería Civil y Urbanismo',
            autoria_orden: false,
            autoria_str: 'Muchos autores puede bajar la evaluación, justificar carga de trabajo y aportación',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              perfil_tecnologico: {
                min_aportaciones: 3,
              },
              perfil_no_tecnologico: {
                min_aportaciones: 2,
              },
            },
          },
          9: {
            name: 'Ciencias Sociales, Políticas, del Comportamiento y de Estudios de Género',
            autoria_orden: false,
            autoria_str: 'Muchos autores puede bajar la evaluación, justificar carga de trabajo y aportación',
            alerta_autores: 4,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              comportamiento: {
                min_publicaciones: 4,
                min_q1q2: 3,
                puntuaciones: {
                  puntuacion_q1: 10,
                  puntuacion_q2: 9,
                  puntuacion_q3: 8,
                  puntuacion_q4: 7,
                  puntuacion_fecyt_q1q1_publicaciones: 6,
                  puntuacion_fecyt_q3q4_publicaciones: 5,
                  puntuacion_spi_q1q2_libros: 4,
                  puntuacion_no_spi_libros: 1,
                  puntuacion_spi_q1q2_capitulos_libros: 2,
                },
                penalizaciones: {
                  n_autores_max_7: 0.25,
                },

              },
              estudiosgenero: {
                min_publicaciones: 4,
                min_q1q2: 3,
                puntuaciones: {
                  puntuacion_q1: 10,
                  puntuacion_q2: 9,
                  puntuacion_q3: 8,
                  puntuacion_q4: 7,
                  puntuacion_fecyt_q1q1_publicaciones: 6,
                  puntuacion_fecyt_q3q4_publicaciones: 5,
                  puntuacion_spi_q1q2_libros: 4,
                  puntuacion_no_spi_libros: 1,
                  puntuacion_spi_q1q2_capitulos_libros: 2,
                },
                penalizaciones: {
                  n_autores_4_6: 0.25,
                  n_autores_max_7: 0.50,
                },
              },
              cienciassociales: {
                min_publicaciones: 4,
                min_q1q2: 3,
                puntuaciones: {
                  puntuacion_q1: 10,
                  puntuacion_q2: 9,
                  puntuacion_q3: 8,
                  puntuacion_q4: 7,
                  puntuacion_fecyt_q1q1_publicaciones: 6,
                  puntuacion_fecyt_q3q4_publicaciones: 5,
                  puntuacion_spi_q1q2_libros: 4,
                  puntuacion_no_spi_libros: 1,
                  puntuacion_spi_q1q2_capitulos_libros: 2,
                },
                penalizaciones: {
                  n_autores_4_6: 0.25,
                  n_autores_max_7: 0.50,
                },
              },
            },
          },
          10: {
            name: 'Ciencias de la Educación',
            autoria_orden: true,
            autoria_str: 'más de 4 firmantes pueden penalizar, si las exigencias de su contenido y metodología no lo justifican',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              min_publicaciones: 2,
              puntuaciones: {
                puntuacion_jcr_publicaciones: 7,
                puntuacion_sjr_q1q2_publicaciones: 7,
                puntuacion_sjr_q3q4_publicaciones: 6,
                puntuacion_fecyt_q1q2_publicaciones: 6,
                puntuacion_fecyt_q3q4_publicaciones: 2,
                puntuacion_dialnet_publicaciones: 2,
                puntuacion_spi_q1_editorial_nacional_libros: 6,
                puntuacion_spi_q1q2_editorial_extranjera_libros: 6,
              },
            },
          },
          11: {
            name: 'Ciencias Económicas y Empresariales',
            autoria_orden: false,
            autoria_str: 'Muchos autores puede bajar la evaluación',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: true,
            criterio: {
              min_publicaciones: 5,
              min_q1q2: 3,
              puntuaciones: {
                puntuacion_q1: 8,
                puntuacion_q2: 7,
                puntuacion_q3: 6,
                puntuacion_q4: 3.5,
                puntuacion_sjr_q1_publicaciones: 7,
                puntuacion_sjr_q2_publicaciones: 6,
                puntuacion_spi_q1_editorial_internacional_libros: 6,
                puntuacion_spi_q2_editorial_internacional_libros: 4,
                puntuacion_spi_q1_editorial_nacional_libros: 4,
                puntuacion_spi_q1_editorial_internacional_capitulos_libros: 3,
                puntuacion_spi_q2_editorial_internacional_capitulos_libros: 2,
                puntuacion_spi_q1_editorial_nacional_capitulos_libros: 2,
              },
            },
          },
          12: {
            name: 'Derecho y Jurisprudencia',
            autoria_orden: false,
            autoria_str: 'Muchos autores puede bajar la evaluación, justificar carga de trabajo y aportación',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
          },
          13: {
            name: 'Historia, Geografía y Artes',
            autoria_orden: false,
            autoria_str: 'Muchos autores puede bajar la evaluación, justificar carga de trabajo y aportación',
            alerta_autores: 5,
            libros: true,
            congresos: false,
            patentes: false,
          },
          14: {
            name: 'Filosofía, Filología y Lingüística',
            autoria_orden: true,
            autoria_str: 'Más de dos autores puede bajar la evaluación, justificar muy bien la carga de trabajo y aportación',
            alerta_autores: 2,
            libros: true,
            congresos: false,
            patentes: false,
            criterio: {
              min_publicaciones: 5,
              puntuaciones: {
                puntuacion_q1q2q3_publicaciones: 8,
                puntuacion_q4_publicaciones: 7,
              },
            },
          },
        },
        foreverValue: false,
        concreteValue: false,
        processParameters: {},
        capableRobots: {},
        processDesc: {},
        params: {},
        tscheduleFormatted: {},
        dialog: false,
        dialogAlert: false,
        test: true,
        testSchema: {},
        jobData: {},
        code: {},
        days: {
          monday: 'monday',
          tuesday: 'tuesday',
          wednesday: 'wednesday',
          thurdsday: 'thurdsday',
          friday: 'friday',
          saturday: 'saturday',
          sunday: 'sunday',
          week: 'week',
          day: 'day',
        },
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          weeks: 'weeks',
        },
        schemaMail: [
          {
            type: 'text',
            name: 'user',
            label: 'User',
            validation: 'required|email',
          },
          {
            type: 'password',
            name: 'password',
            label: 'Password',
            validation: 'required',
          },
          {
            type: 'text',
            name: 'smtp_server',
            label: 'Smtp Server',
            validation: 'required',
          },
          {
            type: 'group',
            name: 'receivers',
            validation: 'min:1,length',
            repeatable: true,
            'add-label': '+ Add receiver',
            value: [{}],
            children: [
              {
                type: 'text',
                name: 'receiver',
                label: 'Receiver',
                validation: 'email',
              },
              {
                type: 'text',
                name: 'subject',
                label: 'Subject',
                validation: 'required',
              },
              {
                type: 'textarea',
                name: 'body',
                label: 'Body',
                validation: 'required',
              },
              {
                type: 'file',
                name: 'attached',
                label: 'Attach a file',
                value: null,
              },
            ],
          },
          {
            type: 'submit',
            label: 'Ejecutar',
          },
        ],
        schemaSearch: [
          {
            type: 'textarea',
            name: 'topic_sentence',
            label: 'Search',
            validation: 'required',
          },
          {
            type: 'group',
            name: 'receivers',
            validation: 'min:1,length',
            repeatable: true,
            'add-label': '+ Add receiver',
            value: [{}],
            children: [
              {
                type: 'text',
                name: 'receiver',
                label: 'Receiver',
                validation: 'email',
              },
            ],
          },
          {
            type: 'number',
            name: 'topk',
            label: 'topk',
            value: null,
          },
          {
            type: 'submit',
            label: 'Ejecutar',
          },
        ],
        schema: [
        ],

      }
    },
    mounted: function () {
      console.log(this.$route.params.configPath)
      ProcessSettingsService.getConfig(this.$route.params.configPath.replaceAll('+', '/'))
        .then(response => {
          this.comisiones = response.data
          console.log(this.processDesc)
          const it = Object.entries(this.comisiones)
          it.forEach(resp => {
            this.comisionesArray.push({ id: resp[0], value: resp[1] })
          })
          console.log(this.comisionesArray)
          // this.processDesc.capable_robots.unshift('None')
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
              console.log('modificado unitario correcto')
            }
          })
          .catch((error) => {
            throw new Error(error)
          })
        this.dialogEdit = false
      },
      onErrorEditor () {
        console.log('Error editor')
      },
      guardarTodo () {
        ProcessSettingsService.editConfig(this.$route.params.configPath.replaceAll('+', '/'), this.comisiones)
          .then(response => {
            if (response.status === 200) {
              console.log('modificado correcto')
            }
          })
          .catch((error) => {
            throw new Error(error)
          })
        console.log(this.comisiones)
        this.dialogEditAll = false
      },
      resetDefaultConfig () {
        ProcessSettingsService.resetConfig(this.$route.params.configPath.replaceAll('+', '/'))
          .then(response => {
            if (response.status === 200) {
              console.log('reseteado correcto')
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
      closeDialog () {
        // TODO 1:Revisar esto
        this.dialog = false
        this.$router.push('/pages/newprocess/')
      },
      downloadLog (lData) {
      },
      goToExecution () {
        console.log(this.jobData)
        this.$router.push('/pages/executions/' + this.jobData.schedule_id)
      },
      formatTimeSchedule () {
        this.tscheduleFormatted.every = [this.timeSchedule.every_number === undefined ? null : this.timeSchedule.every_number, this.timeSchedule.every_unit]
        // this.tscheduleFormatted.every[0] = this.timeSchedule.every_number
        // this.tscheduleFormatted.every[1] = this.timeSchedule.every_unit
        this.tscheduleFormatted.at = this.timeSchedule.at
        this.tscheduleFormatted.forever = this.timeSchedule.forever
        this.tscheduleFormatted.tag = this.timeSchedule.tag
        this.tscheduleFormatted.category = 'asdf'
        console.log(this.tscheduleFormatted)
        return this.tscheduleFormatted
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
