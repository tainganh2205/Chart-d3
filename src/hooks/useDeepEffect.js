import { useEffect, useRef } from "react";
import _ from "lodash";

export const useDeepEffect = (effectFunc, deps) => {
  const isFirstRender = useRef(true);
  const prepDeps = useRef(deps);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const isChangedDeps = deps.some(
      (dep, index) => !_.isEqual(dep, prepDeps.current[index])
    );
    if (isChangedDeps) {
      effectFunc();
      prepDeps.current = deps;
    }
  }, deps);
};
