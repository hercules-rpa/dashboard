<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="80%"
    >
      <v-card class="text-center">
        <v-card-title>
          {{ lData.robot }} Running Process

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <v-textarea
              autofocus
              rows="20"
              row-height="30"
              outlined
              readonly
              name="input-7-4"
              :label="'Process : ' + lData.processName"
              :value="lData.logText"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            text
            @click="dialog = false"
          >
            Download
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
