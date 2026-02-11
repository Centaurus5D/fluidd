<template>
  <div class="mb-2">
    <v-row no-gutters>
      <v-col cols="12" class="pr-1">
        <app-text-field
          :color="'primary'"
          :label="$t(`app.general.label.a_offset`)"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady"
          :readonly="printerPrinting"
          :value="homingOffsets[0].toFixed(3)"
          @submit="sendOffset(+$event)"
        />
      </v-col>
    </v-row>
    <template v-for="wcs in [1, 2]">
      <v-card-subtitle :key="`${wcs}-title`" class="py-2"> WCS{{ wcs }} </v-card-subtitle>
      <v-row :key="`${wcs}-input`" justify="space-between" no-gutters>
        <v-col cols="4" class="pr-1">
          <app-text-field
            :color="'primary'"
            :label="`X [ ${wcsOffsets[wcs][0].toFixed(3)} ]`"
            :rules="[$rules.required, $rules.numberValid]"
            outlined
            persistent-placeholder
            hide-details
            dense
            small
            type="number"
            :disabled="!klippyReady"
            :readonly="printerPrinting"
            :value="wcsOffsets[wcs][0].toFixed(3)"
            @submit="setWcsOffset(wcs, 'X', +$event)"
            @focus="onFocus(wcs, 0)"
            @blur="onBlur"
          />
        </v-col>
        <v-col cols="4" class="pr-1 pl-1">
          <app-text-field
            :color="'primary'"
            :label="`Y [ ${wcsOffsets[wcs][1].toFixed(3)} ]`"
            :rules="[$rules.required, $rules.numberValid]"
            outlined
            persistent-placeholder
            hide-details
            dense
            small
            type="number"
            :disabled="!klippyReady"
            :readonly="printerPrinting"
            :value="wcsOffsets[wcs][1].toFixed(3)"
            @submit="setWcsOffset(wcs, 'Y', +$event)"
            @focus="onFocus(wcs, 1)"
            @blur="onBlur"
          />
        </v-col>
        <v-col cols="4" class="pr-1 pl-1">
          <app-text-field
            :color="'primary'"
            :label="`Z [ ${wcsOffsets[wcs][2].toFixed(3)} ]`"
            :rules="[$rules.required, $rules.numberValid]"
            outlined
            persistent-placeholder
            hide-details
            dense
            small
            type="number"
            :disabled="!klippyReady"
            :readonly="printerPrinting"
            :value="wcsOffsets[wcs][2].toFixed(3)"
            @submit="setWcsOffset(wcs, 'Z', +$event)"
            @focus="onFocus(wcs, 2)"
            @blur="onBlur"
          />
        </v-col>
      </v-row>
    </template>
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
export default class WcsInput extends Mixins(StateMixin, ToolheadMixin) {
  get wcsOffsets() {
    return (
      this.$typedState.printer.printer.module_5d?.wcs_offsets ?? [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]
    );
  }

  onFocus(wcs: number, axis: number) {
    this.$emit("focus", wcs, axis);
  }

  onBlur() {
    this.$emit("blur");
  }

  setWcsOffset(wcs: number, axis: Axis, pos: number) {
    const axisIndex = axisIndexMap[axis];
    const currentWcsOffset = this.wcsOffsets[wcs][axisIndex];
    if (currentWcsOffset !== pos) {
      this.sendGcode(`G10 L2 P${wcs + 1} ${axis}${pos}`);
    }
  }

  get homingOffsets() {
    return this.$typedState.printer.printer.module_5d?.homing_origin ?? [0, 0];
  }

  sendOffset(pos: number) {
    if (pos !== this.homingOffsets[0]) {
      this.sendGcode(`SET_GCODE_OFFSET A=${pos}`);
    }
  }
}
</script>
