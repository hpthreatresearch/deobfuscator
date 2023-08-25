// © Copyright 2023 HP Development Company, L.P.
import { TitleBlock } from "@components/basic/TitleBlock";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SandboxOutputProps } from "./types";

export const SandboxOutput = ({
  consoleOutput,
  consoleReturn,
}: SandboxOutputProps) => {
  return (
    <div className="d-flex flex-column background-white h-50 mh-50">
      <TitleBlock>Output</TitleBlock>
      <div className="fill-under-title">
        <div className="output background-white mb-3 p-2 overflow-auto overflow-none-100">
          {consoleOutput.map((l, index) => (
            <pre key={index}>{l}</pre>
          ))}
          <div className="d-flex align-items-center mt-3">
            <FontAwesomeIcon icon={faChevronLeft} opacity={0.2} />
            <pre className="ms-2 mb-0">{consoleReturn}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
