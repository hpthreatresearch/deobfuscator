// © Copyright 2023 HP Development Company, L.P.
import { stripComments } from "@core/modules/readability/strip-comments/strip-comments";
import { removeAlias } from "@core/modules/proxy/remove-alias/remove-alias";
import { inlineFunction } from "@core/modules/simplify/inline-function/inline-function";
import { inlineEval } from "@core/modules/simplify/inline-eval/inline-eval";
/**
 * This file contains a record linking every module name to a module
 *
 * This file gets generated through the `new` script
 */
import { removeProxyFunction } from "@core/modules/proxy/remove-proxy-functions/remove-proxy-functions";
import { removeProxyObject } from "@core/modules/proxy/remove-proxy-objects/remove-proxy-objects";
import { removeCommaOperator } from "@core/modules/readability/remove-comma-operator/remove-comma-operator";
import { removeIntHex } from "@core/modules/readability/remove-int-hex/remove-int-hex";
import { removeStringHex } from "@core/modules/readability/remove-string-hex/remove-string-hex";
import { removeMemberAccess } from "@core/modules/readability/rename-member-access/rename-member-access";
import { separateDeclarators } from "@core/modules/readability/separate-declarators/separate-declarators";
import { constantFolding } from "@core/modules/simplify/constant-folding/constant-folding";
import { removeSingleArgs } from "@core/modules/simplify/remove-single-args/remove-single-args";
import { obfuscatorIoRc4 } from "@core/modules/target/obfuscator.io/obfuscator-io";
import { replaceExpression } from "@core/modules/target/replace-expression/replace-expression";
import { comment } from "@core/modules/control-flow/comment/comment";
import { loop } from "@core/modules/control-flow/loop/loop";
import { removeDeadBranches } from "@core/modules/trim/remove-dead-branches/remove-dead-branches";
import { removeUnusedVars } from "@core/modules/trim/remove-unused-vars/remove-unused-vars";
import type { DeobfuscatorModule } from "../types";
import { MODULE_NAMES } from "./module-names";
export const MODULES: Readonly<Record<MODULE_NAMES, DeobfuscatorModule>> = {
  [MODULE_NAMES.CONSTANT_FOLDING]: constantFolding,
  [MODULE_NAMES.REMOVE_DEAD_BRANCHES]: removeDeadBranches,
  [MODULE_NAMES.REMOVE_UNUSED_VARS]: removeUnusedVars,
  [MODULE_NAMES.REMOVE_MEMBER_ACCESS]: removeMemberAccess,
  [MODULE_NAMES.SEPARATE_DECLARATORS]: separateDeclarators,
  [MODULE_NAMES.REPLACE_EXPRESSION_WITH]: replaceExpression,
  [MODULE_NAMES.REMOVE_HEX_IN_STRING]: removeStringHex,
  [MODULE_NAMES.REMOVE_HEX_IN_INT]: removeIntHex,
  [MODULE_NAMES.REMOVE_PROXY_FUNCTION]: removeProxyFunction,
  [MODULE_NAMES.REMOVE_SINGLE_ARGS]: removeSingleArgs,
  [MODULE_NAMES.REMOVE_COMMA_OPERATOR]: removeCommaOperator,
  [MODULE_NAMES.OBFUSCATOR_IO]: obfuscatorIoRc4,
  [MODULE_NAMES.REMOVE_PROXY_OBJECTS]: removeProxyObject,
  [MODULE_NAMES.COMMENT]: comment,
  [MODULE_NAMES.LOOP]: loop,
  [MODULE_NAMES.INLINE_EVAL]: inlineEval,
  [MODULE_NAMES.INLINE_FUNCTION]: inlineFunction,
  [MODULE_NAMES.REMOVE_ALIAS]: removeAlias,
  [MODULE_NAMES.STRIP_COMMENTS]: stripComments,
};
