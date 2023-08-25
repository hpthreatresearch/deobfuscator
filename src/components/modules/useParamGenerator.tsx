// © Copyright 2023 HP Development Company, L.P.
import type { ParamType, SupportedParams } from "@core/types";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  LabeledArray,
  LabeledCheckbox,
  LabeledInput,
  LabeledNumericInput,
} from "./params";

export interface ParamGeneratorProps {
  initialParams: SupportedParams;
  setParams: (params: SupportedParams) => void;
  params: ParamType;
}

/**
 * A hook to generate the proper input components for a module
 */
export const useParamGenerator = ({
  initialParams,
  setParams,
  params,
}: ParamGeneratorProps): JSX.Element[] => {
  /**
   * The parameters of the module.
   *
   * Initial param is set in the module definition and used to infer the parameter types.
   */
  const [state, setState] = useState<SupportedParams>(initialParams);

  /**
   * Used when opening a locally saved recipe
   *
   * If the module already has set params, update the state to match.
   */
  useEffect(() => {
    // HACK:
    if (Object.keys(params).length > 0) {
      setState(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Whenever the state changes modify the module's params to match
   *
   * HACK: fix these 2 states being different
   */
  useEffect(() => {
    setParams(state);
  }, [state]);

  /**
   * The list of parameters supported by this module
   *
   * Inferred from initial params
   */
  const keys = useMemo(() => Object.keys(initialParams), [initialParams]);

  /**
   * Creates a facade of a state for an individual parameter component.
   *
   * The components do not have an internal state and directly modify the `state`
   * object.
   */
  const localState = <T extends number | string | boolean | string[]>(
    key: string
  ): [T, Dispatch<SetStateAction<T>>] => {
    const setLocalState = (setStateAction: SetStateAction<T>) => {
      let newLocalState: T;
      if (setStateAction instanceof Function) {
        const previousState = state[key] as T;
        newLocalState = setStateAction(previousState);
      } else {
        newLocalState = setStateAction;
      }
      setState((previousState) => ({ ...previousState, [key]: newLocalState }));
    };
    return [state[key] as T, setLocalState];
  };

  /**
   * Gets the correct component for each parameter based on the initial parameter's constructor
   */
  const getLabeledInput = (key: string, index: number) => {
    switch (initialParams[key].constructor) {
      case String:
        return (
          <LabeledInput key={index} state={localState<string>(key)}>
            {key}
          </LabeledInput>
        );
      case Boolean:
        return (
          <LabeledCheckbox key={index} state={localState(key)}>
            {key}
          </LabeledCheckbox>
        );
      case Array:
        return (
          <LabeledArray key={index} state={localState(key)}>
            {key}
          </LabeledArray>
        );
      case Number:
        return (
          <LabeledNumericInput key={index} state={localState(key)}>
            {key}
          </LabeledNumericInput>
        );
      default:
        //TODO: Better error handler
        return <></>;
    }
  };

  return keys.map(getLabeledInput);
};
