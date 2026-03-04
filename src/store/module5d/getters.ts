import type { GetterTree } from "vuex";
import type { Module5dState } from "./types";
import type { RootState } from "../types";

export const getters = {
  /**
   * Has this printer been configured for bed meshes?
   */
  getSupports5dModule: (state, getters, rootState, rootGetters) => {
    const printerSettings: Klipper.SettingsState = rootGetters["printer/getPrinterSettings"];

    return printerSettings.module_5d != null;
  },

  getNeedOffsetsCalibration: (state, getters, rootState) => {
    if (!getters.getSupports5dModule) return false;
    const probeOffsets = rootState.printer.printer.module_5d_probe?.offsets ?? [0, 0, 0];
    return probeOffsets.some((o) => o !== 0);
  },

  getNeedCalibration: (state, getters, rootState) => {
    const baseWcs1 = Object.values(
      rootState.printer.printer.configfile.settings["wcs_1"] ?? {}
    ) ?? [0, 0, 0];
    const baseWcs2 = Object.values(
      rootState.printer.printer.configfile.settings["wcs_2"] ?? {}
    ) ?? [0, 0, 0];
    const wcsOffsets = rootState.printer.printer.module_5d?.wcs_offsets ?? [
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
    ];
    return (
      baseWcs1.every((v, i) => v === wcsOffsets[1][i]) ||
      baseWcs2.every((v, i) => v === wcsOffsets[2][i])
    );
  },
} satisfies GetterTree<Module5dState, RootState>;
