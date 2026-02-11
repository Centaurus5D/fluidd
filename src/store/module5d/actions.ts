import type { ActionTree } from "vuex";
import type { Module5dState } from "./types";
import type { RootState } from "../types";

export const actions = {
  /**
   * Reset our store
   */
  async reset({ commit }) {
    commit("setReset");
  },
} satisfies ActionTree<Module5dState, RootState>;
