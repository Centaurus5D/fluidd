<template>
  <div class="mb-2">
    <!-- <div style="line-height: 32px; padding: 0 12px;"> -->
    <v-row justify="space-between" no-gutters>
      <v-col cols="4" class="pr-1">
        <app-text-field
          :color="forceMoveEnabled ? 'error' : 'primary'"
          :label="`A [ ${livePosition[0].toFixed(2)} ]`"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady || (!xHomed && !xForceMove)"
          :readonly="printerPrinting"
          :value="useGcodeCoords ? gcodePosition[0].toFixed(2) : toolheadPosition[0].toFixed(2)"
          @submit="moveAxisTo('A', +$event)"
        />
      </v-col>
      <v-col cols="4" class="pr-1 pl-1">
        <app-text-field
          :color="forceMoveEnabled ? 'error' : 'primary'"
          :label="`C [ ${livePosition[1].toFixed(2)} ]`"
          :rules="[$rules.required, $rules.numberValid]"
          outlined
          persistent-placeholder
          hide-details
          dense
          small
          type="number"
          :disabled="!klippyReady || (!yHomed && !yForceMove)"
          :readonly="printerPrinting"
          :value="useGcodeCoords ? gcodePosition[1].toFixed(2) : toolheadPosition[1].toFixed(2)"
          @submit="moveAxisTo('C', +$event)"
        />
      </v-col>
      <v-col cols="4" class="pl-1">
        <app-btn-toggle
          v-model="positioning"
          mandatory
          dense
          class="d-flex"
          :disabled="!klippyReady || printerPrinting"
        >
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <app-btn
                v-bind="attrs"
                class="positioning-toggle-button"
                :disabled="!klippyReady || printerPrinting"
                v-on="on"
              >
                <v-icon small> $absolutePositioning </v-icon>
              </app-btn>
            </template>
            <span>{{ $t("app.tool.tooltip.absolute_positioning") }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <app-btn
                v-bind="attrs"
                class="positioning-toggle-button"
                :disabled="!klippyReady || printerPrinting"
                v-on="on"
              >
                <v-icon small> $relativePositioning </v-icon>
              </app-btn>
            </template>
            <span>{{ $t("app.tool.tooltip.relative_positioning") }}</span>
          </v-tooltip>
        </app-btn-toggle>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";

type Axis = "A" | "C";

const axisIndexMap: Record<Axis, number> = {
  A: 0,
  C: 1,
};

@Component({})
export default class Module5dPosition extends Mixins(StateMixin, ToolheadMixin) {
  get gcodePosition(): [number, number] {
    return this.$typedState.printer.printer.module_5d?.gcode_position ?? [0, 0];
  }

  get toolheadPosition(): [number, number] {
    return this.$typedState.printer.printer.module_5d?.toolhead.position ?? [0, 0];
  }

  get livePosition(): [number, number] {
    return this.$typedState.printer.printer.module_5d?.position ?? [0, 0];
  }

  get useGcodeCoords(): boolean {
    return this.$typedState.config.uiSettings.general.useGcodeCoords;
  }

  get xForceMove(): boolean {
    return this.forceMoveEnabled && !this.xHasMultipleSteppers;
  }

  get yForceMove(): boolean {
    return this.forceMoveEnabled && !this.yHasMultipleSteppers;
  }

  get zForceMove(): boolean {
    return this.forceMoveEnabled && !this.zHasMultipleSteppers;
  }

  get usesAbsolutePositioning(): boolean {
    return this.$typedState.printer.printer.gcode_move.absolute_coordinates;
  }

  get positioning() {
    return this.usesAbsolutePositioning ? 0 : 1;
  }

  set positioning(value: number) {
    this.sendGcode(`G9${value}`);
  }

  get printerSettings(): Klipper.SettingsState {
    return this.$typedGetters["printer/getPrinterSettings"];
  }

  moveAxisTo(axis: Axis, pos: number) {
    const axisIndex = axisIndexMap[axis];
    const currentPos = this.useGcodeCoords
      ? this.gcodePosition[axisIndex]
      : this.toolheadPosition[axisIndex];

    if (currentPos !== pos) {
      const rate: number = this.$typedState.config.uiSettings.general.defaultToolheadXYSpeed;

      if (this.forceMoveEnabled) {
        const accel: number = this.$typedState.printer.printer.toolhead.max_accel;
        this.sendGcode(
          `FORCE_MOVE STEPPER=stepper_${axis.toLowerCase()} DISTANCE=${pos} VELOCITY=${rate} ACCEL=${accel}`
        );
      } else {
        this.sendMoveGcode(
          {
            [axis]: pos,
          },
          rate,
          true
        );
      }
    }
  }
}
</script>

<style type="scss" scoped>
.positioning-toggle-button {
  min-width: 20px !important;
  width: 50%;
}
</style>
