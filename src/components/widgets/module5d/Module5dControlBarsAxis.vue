<template>
  <v-row
    no-gutters
    class="mb-2"
  >
    <v-col>
      <app-up-down-btn-group
        :values="values"
        color="primary"
        :disabled="!klippyReady || printerPrinting || !homed"
        class="d-flex"
        @click="moveBy($event)"
      >
        <app-btn
          :color="!homed ? 'primary' : undefined"
          :disabled="!klippyReady || printerPrinting"
          :loading="hasWait(wait)"
          class="flex-grow-1"
          @click="home"
        >
          <v-icon
            small-icon
            class="mr-1"
          >
            $home
          </v-icon>
          {{ axis }}
        </app-btn>
      </app-up-down-btn-group>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'

type Axis = 'A' | 'C'

@Component({})
export default class Module5dControlBarsAxis extends Mixins(StateMixin, ToolheadMixin) {
  @Prop({ type: String })
  readonly axis!: Axis

  get values (): number[] {
    return [1, 15, 90]
  }

  get aHomed (): boolean {
    return this.$typedState.printer.printer.module_5d?.toolhead.homed_axes.includes('a') ?? false
  }

  get cHomed (): boolean {
    return this.$typedState.printer.printer.module_5d?.toolhead.homed_axes.includes('c') ?? false
  }

  get homed (): boolean {
    switch (this.axis) {
      case 'A':
        return this.aHomed
      case 'C':
        return this.cHomed
    }
  }

  get wait (): string {
    switch (this.axis) {
      case 'A':
        return this.$waits.onHomeA
      case 'C':
        return this.$waits.onHomeC
    }
  }

  get rate (): number {
    return this.$typedState.config.uiSettings.general.defaultToolheadXYSpeed
  }

  moveBy (distance: number) {
    this.sendMoveGcode(
      {
        [this.axis]: distance,
      },
      this.rate
    )
  }

  home () {
    this.sendGcode(`HOME_MODULE ${this.axis}=1`, this.wait)
  }
}
</script>
