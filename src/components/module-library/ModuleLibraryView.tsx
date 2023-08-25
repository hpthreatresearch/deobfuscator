// © Copyright 2023 HP Development Company, L.P.
import type { MODULE_LIBRARY_NAME, MODULE_NAMES } from "@core/config";
import { MODULE_LIBRARIES } from "@core/config";
import type { ModuleLibrary } from "@core/types";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import { SpawnCard } from "../dragging/SpawnCard/SpawnCard";
import "./ModuleLibraryView.css";

export interface ModuleLibraryViewProps {
  libraryName: MODULE_LIBRARY_NAME;
  openDocumentation: (moduleName: MODULE_NAMES) => void;
}

/**
 * A module library that can expand to reveal its modules
 */
export const ModuleLibraryView = ({
  libraryName,
  openDocumentation,
}: ModuleLibraryViewProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { icon, modules, name }: ModuleLibrary = useMemo(
    () => MODULE_LIBRARIES[libraryName],
    [libraryName]
  );

  const toggleExpanded = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, [setExpanded]);

  return (
    <div className="module-library">
      <div
        className={`module-library-title ${expanded ? "expanded" : ""}`}
        onClick={toggleExpanded}
      >
        <FontAwesomeIcon className="me-3" icon={icon} />
        {name}
        <FontAwesomeIcon
          className="chevron"
          icon={expanded ? faChevronUp : faChevronDown}
        />
      </div>
      {expanded &&
        modules.map((moduleName) => (
          <SpawnCard
            key={moduleName}
            name={moduleName}
            openDocumentation={openDocumentation}
          />
        ))}
    </div>
  );
};
