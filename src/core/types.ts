// © Copyright 2023 HP Development Company, L.P.
/**
 * This file gets generated through the `new` script
 */

import type { TraverseOptions } from "@babel/traverse";
import type * as t from "@babel/types";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { MODULE_NAMES } from "./config/module-names";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type ReactState<T> = [T, ReactSetState<T>];

//TODO: FIX THIS MESS
export type SupportedParams = {
  [k: string]: string | boolean | number | string[] | Item[];
};

export type ParamType = SupportedParams;

export interface Item {
  name: MODULE_NAMES;
  params: ParamType;
  elevation: number;
}

export interface ModuleComponentPropType {
  /**
   * Sets the params for your module
   */
  setParams: (params: ParamType) => void;
  item: Item;
}

export type ModuleComponentType = React.FC<ModuleComponentPropType>;

interface BaseModule {
  /**
   * An optional custom React component for your module
   */
  ModuleComponent?: ModuleComponentType;

  /**
   * The documentation markdown for your module
   */
  documentation?: string;

  /**
   * The initial params of your module, used only to create a React component.
   *
   * No need to use if defining a `ModuleComponent`
   */
  initialParams?: SupportedParams;
}

/**
 * A module for visiting the AST
 */
export interface VisitorModule extends BaseModule {
  kind: "visitor";
  /**
   * A visitor that will receive user submitted params
   * @param params user submitted. Same type as `initialParams` or whatever was last passed to `setParams` if using a custom component
   * @returns A visitor that will traverse the AST
   */
  visitor: (params?: ParamType) => TraverseOptions<t.Node>;
}

/**
 * A module for doing more than just visiting the AST
 */
export interface ControlFlowModule extends BaseModule {
  kind: "controlFlow";
  /**
   * A function that can mutate the AST
   * @param ast the current AST, mutable
   * @param steps  the maximum amount of steps that should be run
   * @param callback a function called after a step is executed
   * @param params user submitted. Same type as `initialParams` or whatever was last passed to `setParams` if using a custom component
   *
   * @returns the amount of steps run
   */
  operation: (
    ast: t.Node,
    steps: number,
    callback: (step: number) => void,
    params?: ParamType
  ) => number;

  /**
   * The maximum amount of steps this module can run
   * @param params user submitted. Same type as `initialParams` or whatever was last passed to `setParams` if using a custom component
   */
  steps: (params?: ParamType) => number;
}

export type DeobfuscatorModule = VisitorModule | ControlFlowModule;

export interface DeobfuscatorModuleWithParam {
  module: DeobfuscatorModule;
  params: ParamType;
}

/**
 * A library for grouping deobfuscator modules
 */
export interface ModuleLibrary {
  name: string;
  icon: IconDefinition;
  modules: MODULE_NAMES[];
}

/**
 * An alias to easily change id type
 */
export type UUID = string & { readonly "": unique symbol };

export interface ModuleWithID {
  module: Item;
  id: UUID;
}
