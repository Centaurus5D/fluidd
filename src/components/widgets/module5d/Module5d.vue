<template>
  <div>
    <v-card-text>
      <tool-change-commands />

      <v-row justify="space-between" align="start">
        <v-col class="controls-wrapper">
          <template v-if="!printerPrinting">
            <toolhead-control-bars />
          </template>
        </v-col>

        <v-col class="controls-wrapper">
          <toolhead-position />
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";
import type { ToolheadControlStyle } from "@/store/config/types";

@Component({
  components: {},
})
export default class Module5d extends Mixins(StateMixin, ToolheadMixin) {
  get showPressureAdvance(): boolean {
    return this.activeExtruder?.pressure_advance !== undefined;
  }

  get toolheadControlStyle(): ToolheadControlStyle {
    return this.$typedState.config.uiSettings.general.toolheadControlStyle;
  }
}
</script>

<style type="scss" scoped>
.controls-wrapper {
  min-width: 380px !important;
  max-width: 450px !important;
}
</style>
