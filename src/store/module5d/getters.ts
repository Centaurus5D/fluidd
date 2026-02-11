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
} satisfies GetterTree<Module5dState, RootState>;
