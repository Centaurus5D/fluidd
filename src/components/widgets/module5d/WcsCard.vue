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
        :loading="hasWait($waits.onToolCalibrate)"
        :disabled="printerBusy"
        @click="() => (toolCalibrateDialogOpen = true)"
      >
        {{ $t("app.general.btn.calibrate") }}
      </app-btn>

      <app-btn
        v-if="!fullscreen"
        icon
        @click="$filters.routeTo({ name: 'tune' })"
      >
        <v-icon dense>
          $fullScreen
        </v-icon>
      </app-btn>
    </template>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-alert
            v-if="getNeedCalibration"
            type="warning"
            text
            class="mt-4 mb-0"
          >
            {{ $t("app.module_5d.msg.hint") }}
          </v-alert>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <wcs-chart
            ref="chart"
            :hovered="hoveredOffset"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <wcs-input
            @focus="onFocus"
            @blur="onBlur"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <tool-calibrate-dialog
      v-if="toolCalibrateDialogOpen"
      v-model="toolCalibrateDialogOpen"
      @calibrate="calibrate"
    />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Ref } from 'vue-property-decorator'
import WcsChart from './WcsChart.vue'
import WcsInput from './WcsInput.vue'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import BrowserMixin from '@/mixins/browser'
import ToolCalibrateDialog from './ToolCalibrateDialog.vue'

@Component({
  components: {
    WcsChart,
    WcsInput,
    ToolCalibrateDialog,
  },
})
export default class WcsCard extends Mixins(StateMixin, ToolheadMixin, BrowserMixin) {
  @Prop({ type: Boolean })
  readonly fullscreen?: boolean

  @Ref('chart')
  readonly wcsChart!: WcsChart

  calibrate (radius: number) {
    this.sendGcode(`TOOL_CALIBRATE TOOL_RADIUS=${radius}`, this.$waits.onToolCalibrate)
  }

  toolCalibrateDialogOpen = false

  hoveredOffset: { wcs: number; axis: number } = {
    wcs: -1,
    axis: -1,
  }

  onFocus (wcs: number, axis: number) {
    this.hoveredOffset.wcs = wcs
    this.hoveredOffset.axis = axis
  }

  onBlur () {
    this.hoveredOffset.wcs = -1
    this.hoveredOffset.axis = -1
  }

  get getNeedCalibration (): boolean {
    return this.$typedGetters['module5d/getNeedCalibration']
  }
}
</script>
