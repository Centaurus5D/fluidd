<template>
  <app-dialog
    v-model="open"
    :title="$t('app.module_5d.label.tool_calibrate')"
    max-width="450"
    :save-button-text="$t('app.general.btn.calibrate')"
    @save="handleSubmit()"
  >
    <v-card-text>
      <v-text-field
        v-model="radius"
        autofocus
        filled
        required
        type="number"
        class="mb-4"
        :rules="[$rules.required, $rules.numberValid, $rules.numberGreaterThanOrEqual(1)]"
        hide-details="auto"
        :label="$t('app.module_5d.label.tool_radius')"
      />
    </v-card-text>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Mixins, VModel } from "vue-property-decorator";
import StateMixin from "@/mixins/state";
import ToolheadMixin from "@/mixins/toolhead";

@Component({})
export default class ToolCalibrateDialog extends Mixins(StateMixin, ToolheadMixin) {
  @VModel({ type: Boolean })
  open?: boolean;

  mounted() {
    this.radius = 3.0;
  }

  radius = 0.0;

  handleSubmit() {
    this.$emit("calibrate", this.radius);
    this.open = false;
  }
}
</script>
