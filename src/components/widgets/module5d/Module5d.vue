<template>
  <div>
    <v-card-text>
      <v-row
        justify="space-between"
        align="start"
      >
        <v-col
          v-if="getNeedCalibration"
          cols="12"
        >
          <v-alert
            type="warning"
            text
          >
            {{ $t("app.module_5d.msg.hint") }}
          </v-alert>
        </v-col>
        <v-col class="controls-wrapper">
          <template v-if="!printerPrinting">
            <module-5d-control-bars />
          </template>
        </v-col>

        <v-col class="controls-wrapper">
          <module-5d-position />
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import Module5dPosition from './Module5dPosition.vue'
import Module5dControlBars from './Module5dControlBars.vue'

@Component({
  components: {
    Module5dPosition,
    Module5dControlBars,
  },
})
export default class Module5d extends Mixins(StateMixin, ToolheadMixin) {
  get getNeedCalibration (): boolean {
    return this.$typedGetters['module5d/getNeedCalibration']
  }
}
</script>

<style type="scss" scoped>
.controls-wrapper {
  min-width: 380px !important;
  max-width: 450px !important;
}
</style>
