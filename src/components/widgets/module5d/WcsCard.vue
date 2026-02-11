<template>
  <collapsable-card
    :title="$t('app.general.title.wcs')"
    :lazy="false"
    icon="$wcsChart"
    :draggable="!fullscreen"
    :collapsable="!fullscreen"
    layout-path="dashboard.wcs-card"
  >
    <template #menu>
      <app-btn
        small
        class="me-1 my-1"
        :loading="hasWait($waits.onMeshCalibrate)"
        :disabled="printerBusy || !allHomed"
        @click="calibrate()"
      >
        {{ $t("app.general.btn.calibrate") }}
      </app-btn>

      <app-btn v-if="!fullscreen" icon @click="$filters.routeTo({ name: 'tune' })">
        <v-icon dense> $fullScreen </v-icon>
      </app-btn>
    </template>

    <v-card-text>
      <v-row>
        <v-col>
          <wcs-chart ref="chart" :hovered="hoveredOffset" />
        </v-col>
        <v-col>
          <wcs-input @focus="onFocus" @blur="onBlur" />
        </v-col>
      </v-row>
    </v-card-text>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Ref } from "vue-property-decorator";
import WcsChart from "./WcsChart.vue";
import WcsInput from "./WcsInput.vue";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";
import BrowserMixin from "@/mixins/browser";

@Component({
  components: {
    WcsChart,
    WcsInput,
  },
})
export default class WcsCard extends Mixins(StateMixin, ToolheadMixin, BrowserMixin) {
  @Prop({ type: Boolean })
  readonly fullscreen?: boolean;

  @Ref("chart")
  readonly wcsChart!: WcsChart;

  calibrate() {
    this.sendGcode("BED_MESH_CALIBRATE", this.$waits.onMeshCalibrate);
  }

  hoveredOffset: { wcs: number; axis: number } = {
    wcs: -1,
    axis: -1,
  };

  onFocus(wcs: number, axis: number) {
    this.hoveredOffset.wcs = wcs;
    this.hoveredOffset.axis = axis;
  }

  onBlur() {
    this.hoveredOffset.wcs = -1;
    this.hoveredOffset.axis = -1;
  }
}
</script>
