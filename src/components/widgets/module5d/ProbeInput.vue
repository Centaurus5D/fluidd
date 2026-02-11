<template>
  <div class="mb-2">
    <v-row justify="space-between" no-gutters>
      <v-col cols="4" class="pr-1">
        <app-text-field
          :color="'primary'"
          :label="`X`"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady"
          :readonly="printerPrinting"
          :value="probeOffsets[0].toFixed(3)"
          @submit="setProbeOffset('X', +$event)"
          @focus="onFocus(0)"
          @blur="onBlur"
        />
      </v-col>
      <v-col cols="4" class="pr-1 pl-1">
        <app-text-field
          :color="'primary'"
          :label="`Y`"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady"
          :readonly="printerPrinting"
          :value="probeOffsets[1].toFixed(3)"
          @submit="setProbeOffset('Y', +$event)"
          @focus="onFocus(1)"
          @blur="onBlur"
        />
      </v-col>
      <v-col cols="4" class="pr-1 pl-1">
        <app-text-field
          :color="'primary'"
          :label="`Z`"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady"
          :readonly="printerPrinting"
          :value="probeOffsets[2].toFixed(3)"
          @submit="setProbeOffset('Z', +$event)"
          @focus="onFocus(2)"
          @blur="onBlur"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";

type Axis = "X" | "Y" | "Z";

const axisIndexMap: Record<Axis, number> = {
  X: 0,
  Y: 1,
  Z: 2,
};

@Component({})
export default class ProbeInput extends Mixins(StateMixin, ToolheadMixin) {
  get probeOffsets() {
    return this.$typedState.printer.printer.module_5d_probe?.offsets ?? [0, 0, 0];
  }

  onFocus(axis: number) {
    this.$emit("focus", axis);
  }

  onBlur() {
    this.$emit("blur");
  }

  setProbeOffset(axis: Axis, pos: number) {
    const axisIndex = axisIndexMap[axis];
    const currentProbeOffset = this.probeOffsets[axisIndex];
    if (currentProbeOffset !== pos) {
      this.sendGcode(`SET_PROBE_OFFSET ${axis}=${pos}`);
    }
  }
}
</script>
