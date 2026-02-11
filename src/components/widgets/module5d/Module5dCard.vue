<template>
  <collapsable-card
    :title="$t('app.general.title.module5d')"
    icon="$module5d"
    draggable
    layout-path="dashboard.module-5d-card"
    menu-breakpoint="lg"
  >
    <template #menu>
      <app-btn-collapse-group :collapsed="narrow">
        <app-btn
          v-if="hasSteppersEnabled"
          :disabled="!klippyReady || printerPrinting"
          small
          class="me-1 my-1"
          @click="sendGcode('M84')"
        >
          {{ $t("app.tool.tooltip.motors_off") }}
        </app-btn>
      </app-btn-collapse-group>

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

    <template v-if="fullscreen">
      <div>
        <v-card-text>
          <v-row
            justify="space-between"
            align="start"
          >
            <v-col class="controls-wrapper">
              <template v-if="!printerPrinting">
                <toolhead-control-cross v-if="toolheadControlStyle === 'cross'" />
                <toolhead-control-bars v-else-if="toolheadControlStyle === 'bars'" />
                <toolhead-control-circle v-else-if="toolheadControlStyle === 'circle'" />
              </template>
            </v-col>
            <v-col class="controls-wrapper">
              <toolhead-position />
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </template>

    <module-5d />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import Module5d from './Module5d.vue'
import ToolheadControlCross from '../toolhead/ToolheadControlCross.vue'
import ToolheadControlBars from '../toolhead/ToolheadControlBars.vue'
import ToolheadControlCircle from '../toolhead/ToolheadControlCircle.vue'
import ToolheadPosition from '../toolhead/ToolheadPosition.vue'
import type { ToolheadControlStyle } from '@/store/config/types'

@Component({
  components: {
    Module5d,
    ToolheadControlCross,
    ToolheadControlBars,
    ToolheadControlCircle,
    ToolheadPosition,
  },
})
export default class Module5dCard extends Mixins(StateMixin, ToolheadMixin) {
  @Prop({ type: Boolean })
  readonly narrow?: boolean

  @Prop({ type: Boolean })
  readonly fullscreen?: boolean

  get printerSettings (): Klipper.SettingsState {
    return this.$typedGetters['printer/getPrinterSettings']
  }

  get hasSteppersEnabled (): boolean {
    return this.$typedGetters['printer/getHasSteppersEnabled']
  }

  get toolheadControlStyle (): ToolheadControlStyle {
    return this.$typedState.config.uiSettings.general.toolheadControlStyle
  }
}
</script>

<style type="scss" scoped>
.controls-wrapper {
  min-width: 380px !important;
  max-width: 450px !important;
}
</style>
