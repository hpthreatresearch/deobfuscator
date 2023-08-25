// © Copyright 2023 HP Development Company, L.P.
import { TitleBlock } from "@components/basic/TitleBlock";
import { MODULE_LIBRARY_NAME, MODULE_NAMES } from "@core/config";
import { useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { DocumentationModal } from "../../module-library/DocumentationModal";
import { ModuleLibraryView } from "../../module-library/ModuleLibraryView";
import { SpawnCard } from "../SpawnCard/SpawnCard";

/**
 * A component to render the modules that can be added to the recipe
 */
export const SpawnArea = () => {
  /**
   * The value of the search query
   */
  const [searchQuery, setSearchQuery] = useState("");

  const [documentationModuleName, setDocumentationModuleName] = useState<
    undefined | MODULE_NAMES
  >(undefined);

  return (
    <Col xl={2} className="d-flex flex-column overflow-none-100">
      <TitleBlock>Modules</TitleBlock>
      <div className="p-2 mb-2 h-100 mh-100 overflow-auto">
        <Form.Control
          as="input"
          placeholder="Search..."
          className="mb-3"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        {searchQuery &&
          Object.values(MODULE_NAMES)
            .filter(
              (moduleName) =>
                moduleName.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
            )
            .map((moduleName) => (
              <SpawnCard
                key={moduleName}
                name={moduleName}
                openDocumentation={setDocumentationModuleName}
              />
            ))}

        {Object.values(MODULE_LIBRARY_NAME).map((libraryName) => (
          <ModuleLibraryView
            key={libraryName}
            libraryName={libraryName}
            openDocumentation={setDocumentationModuleName}
          />
        ))}
        <Modal
          className="documentation-modal"
          show={documentationModuleName !== undefined}
          onHide={() => setDocumentationModuleName(undefined)}
        >
          {documentationModuleName && (
            <DocumentationModal moduleName={documentationModuleName} />
          )}
        </Modal>
      </div>
    </Col>
  );
};
