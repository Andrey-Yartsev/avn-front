import anyRequest from "@/utils/anyRequest";
import tokenRequest from "../../utils/tokenRequest";
import request from "../../utils/request";

const storeRequest = (
  requestType,
  prefix,
  commit,
  dispatch,
  apiPath,
  options,
  { state, localError, resultKey, resultConvert }
) => {
  return new Promise((accept, reject) => {
    commit(prefix + "ResetError");
    commit(prefix + "Request");
    commit(prefix + "Success", false);
    commit(prefix + "Success", false);
    const requests = {
      any: anyRequest,
      token: tokenRequest,
      "no-token": request
    };
    const Request = requests[requestType];
    Request(apiPath, options)
      .then(async response => {
        if (response.status === 200) {
          commit(prefix + "Success", true);
          let r = await response.json();
          accept(r);
          if (resultConvert) {
            r = resultConvert(r, state);
          }
          commit(resultKey, r);
          commit(prefix + "Requested");
        } else {
          const r = await response.json();
          if (localError) {
            commit(prefix + "Error", r.error);
          } else {
            dispatch("global/setError", r.error, { root: true });
          }
          commit(prefix + "Success", false);
          commit(prefix + "Requested");
          reject(r.error);
        }
      })
      .catch(error => {
        if (error.name === "TypeError") {
          // console.error(error);
          error = { message: "Internal Server Error" };
        }
        if (localError) {
          commit(prefix + "Error", error);
        } else {
          dispatch("global/setError", error, { root: true });
        }
        reject(error);
      });
  });
};

const buildInitState = (prefix, state, resultKey, defaultResultValue) => {
  state[prefix + "Error"] = null;
  state[prefix + "Loading"] = false;
  state[prefix + "Success"] = null;
  if (resultKey && !state[resultKey]) {
    state[resultKey] = defaultResultValue;
  }
};

const buildMutations = (prefix, mutations, resultKey) => {
  mutations[prefix + "Error"] = (state, error) => {
    state[prefix + "Error"] = error;
  };
  mutations[prefix + "ResetError"] = state => {
    state[prefix + "Error"] = null;
  };
  mutations[prefix + "Request"] = state => {
    state[prefix + "Loading"] = true;
  };
  mutations[prefix + "Requested"] = state => {
    state[prefix + "Loading"] = false;
  };
  mutations[prefix + "Success"] = (state, value) => {
    state[prefix + "Success"] = value;
  };
  mutations[prefix + "Reset"] = (state, value) => {
    state[prefix + "Error"] = null;
    state[prefix + "Loading"] = false;
    state[prefix + "Success"] = null;
    if (resultKey) {
      state[resultKey] = value;
    }
  };
  if (resultKey) {
    mutations[resultKey] = (state, value) => {
      state[resultKey] = value;
    };
  }
};

const createRequestAction = ({
  requestType,
  prefix,
  apiPath,
  state,
  mutations,
  actions,
  options,
  localError,
  resultKey,
  resultConvert,
  defaultResultValue,
  paramsToOptions,
  paramsToPath
}) => {
  if (!resultKey) {
    resultKey = prefix + "Result";
  }

  actions[prefix] = function({ commit, dispatch, state }, params) {
    if (params !== undefined && paramsToOptions) {
      options = paramsToOptions(params, options);
    }
    let _apiPath = null;
    if (params !== undefined && paramsToPath) {
      _apiPath = paramsToPath(params, apiPath);
    }
    if (!requestType) {
      requestType = "token";
    }
    return storeRequest(
      requestType,
      prefix,
      commit,
      dispatch,
      _apiPath || apiPath,
      options,
      {
        state,
        localError,
        resultKey,
        resultConvert
      }
    );
  };

  actions[prefix + "Reset"] = function({ commit }) {
    commit(prefix + "Reset");
  };

  if (!defaultResultValue) {
    defaultResultValue = null;
  }

  buildInitState(prefix, state, resultKey, defaultResultValue);
  buildMutations(prefix, mutations, resultKey);
};

export { createRequestAction, storeRequest, buildMutations, buildInitState };
