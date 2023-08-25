// © Copyright 2023 HP Development Company, L.P.
import type { ReactSetState } from "@core/types";
import { useCallback, useState } from "react";
import "./App.css";
import { ObfuscatorPanel } from "./ObfuscatorPanel";
import { MainContainer } from "./basic/MainContainer";
import { SpawnArea } from "./dragging/SpawnArea/SpawArea";
import { Recipe } from "./recipe-builder/recipe/Recipe/Recipe";
import { Sandbox } from "./sandbox";

function App() {
  const loadingState = useState<boolean>(false);

  const [code, setCode] = useState("");

  const [obfCode, setObfCode] = useState("");

  const [mappings, setMappings] = useState<number[][]>([]);

  const [isOutDated, setIsOutDated] = useState(false);

  const [loading] = loadingState;

  /**
   * When recipe sets mappings, the mappings will no longer be outdated
   */
  const _setMappings: ReactSetState<number[][]> = useCallback((...args) => {
    setIsOutDated(false);
    return setMappings(...args);
  }, []);

  return (
    <MainContainer>
      <SpawnArea />
      <Recipe
        obfCode={obfCode}
        setCode={setCode}
        setMappings={_setMappings}
        loadingState={loadingState}
      />
      <ObfuscatorPanel
        codeState={[code, setCode]}
        mappingsState={[mappings, setMappings]}
        loading={loading}
        setObfCode={setObfCode}
        isOutdatedState={[isOutDated, setIsOutDated]}
      />
      <Sandbox />
    </MainContainer>
  );
}

export default App;
