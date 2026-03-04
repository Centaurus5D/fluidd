<template>
  <v-row v-if="klippyReady" :dense="$vuetify.breakpoint.smAndDown">
    <v-col cols="12" md="8">
      <wcs-card v-if="supports5dModule" class="mb-2 mb-md-4" fullscreen />
      <probe-card v-if="needOffsetsCalibration" class="mb-2 mb-md-4" fullscreen />
      <bed-mesh-card v-if="supportsBedMesh" class="mb-2 mb-md-4" fullscreen />
    </v-col>
    <v-col cols="12" md="4">
      <module-5d-card v-if="supports5dModule" fullscreen class="mb-2 mb-md-4" />
      <bed-mesh-controls v-if="supportsBedMesh" class="mb-2 mb-md-4" />

      <end-stops-card v-if="supportsEndStops" class="mb-2 mb-md-4" />

      <runout-sensors-card v-if="supportsRunoutSensors" fullscreen class="mb-2 mb-md-4" />

      <beacon-card v-if="supportsBeacon" fullscreen class="mb-2 mb-md-4" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StateMixin from "@/mixins/state";

import BedMeshCard from "@/components/widgets/bedmesh/BedMeshCard.vue";
import BedMeshControls from "@/components/widgets/bedmesh/BedMeshControls.vue";
import WcsCard from "@/components/widgets/module5d/WcsCard.vue";
import ProbeCard from "@/components/widgets/module5d/ProbeCard.vue";
import Module5dCard from "@/components/widgets/module5d/Module5dCard.vue";
import EndStopsCard from "@/components/widgets/endstops/EndStopsCard.vue";
import RunoutSensorsCard from "@/components/widgets/runout-sensors/RunoutSensorsCard.vue";
import BeaconCard from "@/components/widgets/beacon/BeaconCard.vue";

@Component({
  components: {
    BedMeshCard,
    BedMeshControls,
    WcsCard,
    ProbeCard,
    Module5dCard,
    EndStopsCard,
    RunoutSensorsCard,
    BeaconCard,
  },
})
export default class Tune extends Mixins(StateMixin) {
  get supportsBedMesh(): boolean {
    return this.$typedGetters["mesh/getSupportsBedMesh"];
  }

  get supports5dModule(): boolean {
    return this.$typedGetters["module5d/getSupports5dModule"];
  }

  get needOffsetsCalibration(): boolean {
    return this.$typedGetters["module5d/getNeedOffsetsCalibration"];
  }

  get supportsEndStops() {
    return (
      this.$typedGetters["printer/getSteppers"].length > 0 ||
      this.$typedGetters["printer/getProbe"] != null
    );
  }

  get supportsRunoutSensors() {
    return this.$typedGetters["printer/getRunoutSensors"].length > 0;
  }

  get supportsBeacon(): boolean {
    return this.$typedGetters["printer/getSupportsBeacon"];
  }
}
</script>
