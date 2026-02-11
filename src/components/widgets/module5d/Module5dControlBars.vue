<template>
  <div>
    <module-5d-control-bars-axis axis="A" />
    <module-5d-control-bars-axis axis="C" />

    <v-row
      no-gutters
      class="mb-2"
    >
      <v-col class="text-center">
        <app-btn
          :disabled="!klippyReady || printerPrinting"
          :loading="hasWait($waits.onHomeAC)"
          :color="!acHomed ? 'primary' : undefined"
          class="px-2 mr-2"
          @click="sendGcode('HOME_MODULE A=1 C=1', $waits.onHomeAC)"
        >
          <v-icon
            small
            class="mr-1"
          >
            $home
          </v-icon>
          {{ $t("app.tool.btn.home_all") }}
        </app-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Module5dControlBarsAxis from './Module5dControlBarsAxis.vue'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'

@Component({
  components: {
    Module5dControlBarsAxis,
  },
})
export default class Module5dControlBars extends Mixins(StateMixin, ToolheadMixin) {
  get acHomed (): boolean {
    return this.$typedState.printer.printer.module_5d?.toolhead.homed_axes.includes('ac') ?? false
  }
}
</script>
