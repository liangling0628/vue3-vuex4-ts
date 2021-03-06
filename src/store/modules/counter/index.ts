//#region Imports
import {
  ActionContext,
  ActionTree,
  CommitOptions,
  DispatchOptions,
  GetterTree,
  Module,
  MutationTree,
  Store as VuexStore,
} from "vuex";
import { State as RootState } from "@/store";
import {
  GetterConstants,
  MutationConstants,
  ActionConstants,
} from "./constants";
//#endregion

//#region State
export type State = {
  count: number;
};

const state: State = {
  count: 0,
};
//#endregion

//#region Getters
type Getters = {
  [GetterConstants.GetDoubleCount](state: State): number;
};

const getters: GetterTree<State, RootState> & Getters = {
  [GetterConstants.GetDoubleCount]: state => state.count * 2,
};
//#endregion

//#region Mutations
interface Mutations {
  [MutationConstants.HandleResetCount](state: State): void;
  [MutationConstants.HandleIncrement](state: State, payload: number): void;
}

const mutations: MutationTree<State> & Mutations = {
  [MutationConstants.HandleResetCount](state: State) {
    state.count = 0;
  },
  [MutationConstants.HandleIncrement](state: State, payload: number) {
    state.count += payload;
  },
};
//#endregion

//#region Actions
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

interface Actions {
  [ActionConstants.HandleTimeoutIncrement](
    { commit }: AugmentedActionContext,
    payload: number,
  ): Promise<void>;
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionConstants.HandleTimeoutIncrement]({ commit }, payload: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        commit(MutationConstants.HandleIncrement, payload);
        resolve();
      }, 1000);
    });
  },
};
//#endregion

//#region Store Type & Module
export type CounterStore<S = State> = Omit<
  VuexStore<S>,
  "getters" | "commit" | "dispatch"
> & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions, P extends Parameters<Actions[K]>[1]>(
    key: K,
    payload: P,
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>;
};

export const CounterModule: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
//#endregion
