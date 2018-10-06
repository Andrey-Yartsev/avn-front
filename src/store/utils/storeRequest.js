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
  { resultKey, localError }
) => {
  return new Promise(accept => {
    commit(prefix + "ResetError");
    commit(prefix + "Request");
    commit(prefix + "Success", false);
    const requests = {
      any: anyRequest,
      token: tokenRequest,
      "no-token": request
    };
    const Request = requests[requestType];
    Request(apiPath, options)
      .then(async response => {
        commit(prefix + "Requested");
        if (response.status === 200) {
          commit(prefix + "Success", true);
          setTimeout(() => {
            commit(prefix + "Success", null);
          }, 5000);
          const r = await response.json();
          commit(resultKey, r);
          accept(r);
        } else {
          const r = await response.json();
          commit(prefix + "Error", r.error);
          dispatch("global/setError", r.error, { root: true });
          commit(prefix + "Success", false);
        }
      })
      .catch(error => {
        if (error.name === "TypeError") {
          error = { message: "Internal Server Error" };
        }
        if (localError) {
          commit(prefix + "Error", error);
        } else {
          dispatch("global/setError", error, { root: true });
        }
      });
  });
};

const buildInitState = (prefix, state, resultKey) => {
  state[prefix + "Error"] = null;
  state[prefix + "Loading"] = false;
  state[prefix + "Success"] = null;
  state[resultKey] = null;
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
  mutations[resultKey] = (state, value) => {
    state[resultKey] = value;
  };
};

const createRequestAction = ({
  prefix,
  apiPath,
  state,
  mutations,
  actions,
  options,
  localError,
  resultKey
}) => {
  if (!resultKey) {
    resultKey = prefix + "Result";
  }

  actions[prefix] = ({ commit, dispatch }) => {
    return storeRequest("token", prefix, commit, dispatch, apiPath, options, {
      localError,
      resultKey
    });
  };

  buildInitState(prefix, state, resultKey);
  buildMutations(prefix, mutations, resultKey);
};

export { createRequestAction, storeRequest, buildMutations, buildInitState };
