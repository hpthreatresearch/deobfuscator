// © Copyright 2023 HP Development Company, L.P.
import { MODULES } from "@core/config/modules";
import type { ModuleComponentPropType, ModuleComponentType } from "@core/types";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import "./BaseModule.css";
import { useParamGenerator } from "./useParamGenerator";

/**
 * The default component to render a module.
 *
 * The module's initial parameters are used to infer the parameters types and render the proper input components
 */
export const BaseModule: ModuleComponentType = ({
  item: { name: moduleName, params },
  setParams,
}: ModuleComponentPropType) => {
  /**
   * Is the component expanded ?
   *
   * When it is expanded the user can see and modify the module's parameters
   */
  const [expanded, setExpanded] = useState(false);

  /**
   * Toggles the expanded state
   */
  const toggleExpanded = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, [setExpanded]);

  /**
   * The module's initial parameters
   *
   * TODO:
   *  - How expensive is access from `MODULE` ? is useMemo good ?
   */
  const initialParams = useMemo(
    () => MODULES[moduleName].initialParams || {},
    [moduleName]
  );

  /**
   * Helper function
   */
  const isEmpty = (obj: object) => Object.keys(obj).length === 0;

  /**
   * The input components to update this module's params
   */
  const paramViews = useParamGenerator({ initialParams, setParams, params });

  return (
    <div className="base-module">
      <div className="base-module-title">
        {moduleName}
        <div className="icon" onClick={toggleExpanded}>
          {!isEmpty(initialParams) && (
            <FontAwesomeIcon
              className="ms-auto"
              icon={expanded ? faChevronUp : faChevronDown}
            />
          )}
        </div>
      </div>
      {expanded && <div className="base-module-content">{paramViews}</div>}
    </div>
  );
};
