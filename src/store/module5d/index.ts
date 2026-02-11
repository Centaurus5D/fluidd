import type { Module } from "vuex";
import { state } from "./state";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import type { Module5dState } from "./types";
import type { RootState } from "../types";

const namespaced = true;

export const module5d = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
} satisfies Module<Module5dState, RootState>;
