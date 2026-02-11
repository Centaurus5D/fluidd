import type { MutationTree } from "vuex";
import { defaultState } from "./state";
import type { Module5dState } from "./types";

export const mutations = {
  /**
   * Reset state
   */
  setReset(state) {
    Object.assign(state, defaultState());
  },
} satisfies MutationTree<Module5dState>;
