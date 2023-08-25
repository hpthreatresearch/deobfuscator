// © Copyright 2023 HP Development Company, L.P.
import {
  faArrowsUpDown,
  faBookOpen,
  faBullseye,
  faClone,
  faCropSimple,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { MODULE_LIBRARY_NAME } from "./library-names";
import { MODULE_NAMES } from "./module-names";
import type { ModuleLibrary } from "../types";
export const MODULE_LIBRARIES: Record<MODULE_LIBRARY_NAME, ModuleLibrary> = {
  [MODULE_LIBRARY_NAME.CONTROL_FLOW]: {
    name: "Control flow",
    icon: faArrowsUpDown,
    modules: [MODULE_NAMES.COMMENT, MODULE_NAMES.LOOP],
  },
  [MODULE_LIBRARY_NAME.PROXY]: {
    name: "Remove proxies",
    icon: faClone,
    modules: [
      MODULE_NAMES.REMOVE_PROXY_FUNCTION,
      MODULE_NAMES.REMOVE_PROXY_OBJECTS,
      MODULE_NAMES.REMOVE_ALIAS,
    ],
  },
  [MODULE_LIBRARY_NAME.READABILITY]: {
    name: "Improve readability",
    icon: faBookOpen,
    modules: [
      MODULE_NAMES.REMOVE_COMMA_OPERATOR,
      MODULE_NAMES.REMOVE_HEX_IN_INT,
      MODULE_NAMES.REMOVE_HEX_IN_STRING,
      MODULE_NAMES.REMOVE_MEMBER_ACCESS,
      MODULE_NAMES.SEPARATE_DECLARATORS,
      MODULE_NAMES.STRIP_COMMENTS,
    ],
  },
  [MODULE_LIBRARY_NAME.SIMPLIFY]: {
    name: "Simplify code",
    icon: faFilter,
    modules: [
      MODULE_NAMES.CONSTANT_FOLDING,
      MODULE_NAMES.REMOVE_SINGLE_ARGS,
      MODULE_NAMES.INLINE_EVAL,
      MODULE_NAMES.INLINE_FUNCTION,
    ],
  },
  [MODULE_LIBRARY_NAME.TARGET]: {
    name: "Target tool",
    icon: faBullseye,
    modules: [MODULE_NAMES.OBFUSCATOR_IO, MODULE_NAMES.REPLACE_EXPRESSION_WITH],
  },
  [MODULE_LIBRARY_NAME.TRIM]: {
    name: "Trim",
    icon: faCropSimple,
    modules: [
      MODULE_NAMES.REMOVE_UNUSED_VARS,
      MODULE_NAMES.REMOVE_DEAD_BRANCHES,
    ],
  },
};
