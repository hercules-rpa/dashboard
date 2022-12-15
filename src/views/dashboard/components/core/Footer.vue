<template>
  <v-footer
    id="dashboard-core-footer"
  >
    <v-container>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center mb-sm-0 mb-5"
          cols="auto"
        >
          <a
            :href="link.href"
            class="mr-0 grey--text text--darken-3"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col
          cols="12"
          md="auto"
        >
          <div class="text-body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; 2022, made
            by <a href="https://www.treelogic.com/">TREELOGIC</a> for Hércules-RPA.
          </div>
        </v-col>
      </v-row>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          class="text-center ml-3 mt-5"
          cols="auto"
        >
          <v-img
            src="../../../../assets/hercules-crue.png"
            max-height="500"
            max-width="200"
          />
        </v-col>
        <v-col
          class="text-center ml-3 mt-5"
          cols="auto"
        >
          <v-img
            src="../../../../assets/lema.jpg"
            max-width="230"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />
        <v-col
          cols="12"
          md="auto"
        >
          <v-img
            class="mt-5 mr-10"
            src="../../../../assets/logo-union-europea.png"
            max-height="300"
            max-width="70"
          />
        </v-col>
        <v-col
          cols="12"
          md="auto"
        >
          <v-img
            class="mr-2 mt-4"
            src="../../../../assets/logos-ministerio-hecules.jpg"
            max-width="200"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    data: () => ({
      links: [
        {
          href: '#/dashboard',
          text: 'Equipo',
        },
        {
          href: '#/dashboard',
          text: 'Sobre Nosotros',
        },
        {
          href: '#/dashboard',
          text: 'Blog',
        },
        {
          href: '#/dashboard',
          text: 'Licencia',
        },
        {
          href: '#/pages/accessibility',
          text: 'Accesibilidad',
        },
      ],
    }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
