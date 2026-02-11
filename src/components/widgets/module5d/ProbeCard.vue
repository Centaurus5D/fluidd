<template>
  <collapsable-card
    :title="$t('app.general.title.probe_offsets')"
    :lazy="false"
    icon="$probeChart"
    :draggable="!fullscreen"
    :collapsable="!fullscreen"
    layout-path="dashboard.probe-card"
  >
    <template #menu>
      <app-btn v-if="!fullscreen" icon @click="$filters.routeTo({ name: 'tune' })">
        <v-icon dense> $fullScreen </v-icon>
      </app-btn>
    </template>

    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <probe-chart ref="chart" :hovered="hoveredOffset" />
        </v-col>
        <v-col cols="12" sm="8">
          <probe-input @focus="onFocus" @blur="onBlur" />
        </v-col>
      </v-row>
    </v-card-text>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Ref } from "vue-property-decorator";
import ProbeChart from "./ProbeChart.vue";
import ProbeInput from "./ProbeInput.vue";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";
import BrowserMixin from "@/mixins/browser";
import ToolCalibrateDialog from "./ToolCalibrateDialog.vue";

@Component({
  components: {
    ProbeChart,
    ProbeInput,
    ToolCalibrateDialog,
  },
})
export default class ProbeCard extends Mixins(StateMixin, ToolheadMixin, BrowserMixin) {
  @Prop({ type: Boolean })
  readonly fullscreen?: boolean;

  @Ref("chart")
  readonly probeChart!: ProbeChart;

  toolCalibrateDialogOpen = false;

  hoveredOffset: number = -1;

  onFocus(axis: number) {
    this.hoveredOffset = axis;
  }

  onBlur() {
    this.hoveredOffset = -1;
  }
}
</script>
