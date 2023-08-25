// © Copyright 2023 HP Development Company, L.P.
import type { BakerIn, BakerOut } from "@core/baker";
import { BakerOutTypes } from "@core/baker";
import { getBakerWorker } from "@core/baker/baker-worker";
import { tagNextCard } from "@core/baker/steps";
import type { ModuleWithID } from "@core/types";
import {
  faFolderOpen,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { Col, Modal } from "react-bootstrap";
import type { FunctionalIcon } from "../../../basic/TitleBlock";
import { TitleBlock } from "../../../basic/TitleBlock";
import { DropArea } from "../../../dragging/DropArea/DropArea";
import { ButtonBar } from "../ButtonBar";
import { RecipeProgressBar } from "../RecipeProgressBar";
import { OpenModal, SaveModal } from "../modals";
import "./Recipe.css";
import type { RecipeProps } from "./types";
import { SHOW_MODAL } from "./types";

/**
 * A component responsible for creating, editing, saving and running recipes
 */
export const Recipe = ({
  loadingState,
  obfCode,
  setCode,
  setMappings,
}: RecipeProps) => {
  /**
   * Is the baker currently running ?
   */
  const [loading, setLoading] = loadingState;

  /**
   * The cards contained in the recipe
   */
  const [cards, setCards] = useState<ModuleWithID[]>([]);

  /**
   * Is the `Save` or `Open` modal open
   */
  const [showModal, setShowModal] = useState<SHOW_MODAL>(SHOW_MODAL.NONE);

  /**
   * State for the progress bar
   *
   * progress should always be between 0 and 1
   */
  const [progress, setProgress] = useState(0);

  /**
   * How many steps have been run
   * TODO:
   *  - When stepping, use previously deobfuscated code
   */
  const [steps, setSteps] = useState<number>(0);

  /**
   * Webworker responsible for running the modules
   */
  const baker: Worker = useMemo(() => getBakerWorker(), []);

  /**
   * Handler for the webworker
   * TODO:
   *  - Add an enum for different messages
   *  - Add an error message
   *  - Add a progress indicator
   */
  useEffect(() => {
    baker.onmessage = (ev: MessageEvent<BakerOut>) => {
      if (ev.data.type === BakerOutTypes.BAKER_SUCCESS) {
        const { code, mappings, steps } = ev.data;
        setCode(code);
        setMappings(mappings);
        setLoading(false);
        setSteps(steps);
        setProgress(0);

        tagNextCard(
          steps,
          cards.map(({ module }) => module)
        );
        setCards([...cards]);
      } else if (ev.data.type === BakerOutTypes.BAKER_ERROR) {
        const { error } = ev.data;

        // Clear everything
        setCode(
          "/**\n * AN ERROR OCCURRED\n * View console for more details\n */"
        );
        setMappings([]);
        setLoading(false);
        setSteps(0); // TODO:
        setProgress(0);

        console.error(error);
        // TODO: Tag the card that caused an error
      } else if (ev.data.type === BakerOutTypes.BAKER_PROGRESS) {
        const { progress } = ev.data;
        setProgress(progress);
      }
    };
  }, [baker, setCode, setMappings, setLoading, setSteps, setProgress, cards]);

  /**
   * Handler for when the `Bake` button is pressed
   */
  const bake = (steps?: number) => () => {
    setLoading(true);

    const items = cards.map((c) => c.module);

    const message: BakerIn = {
      items,
      obfCode,
      steps,
    };

    baker.postMessage(message);
  };

  /**
   * Handler for when the `Step` button is pressed
   */
  const step = bake(steps);

  /**
   * Icons for the `TitleBlock`
   */
  const icons: FunctionalIcon[] = useMemo(
    () => [
      {
        icon: faSave,
        onClick: () => {
          setShowModal(SHOW_MODAL.SAVE);
        },
        description: "Save recipe",
      },
      {
        icon: faFolderOpen,
        onClick: () => {
          setShowModal(SHOW_MODAL.OPEN);
        },
        description: "Load recipe",
        label: "load-recipe",
      },
      {
        icon: faTrash,
        onClick: () => {
          setCards([]);
        },
        description: "Clear recipe",
      },
    ],
    [setShowModal, setCards]
  );

  /**
   * Closes the currently open module
   */
  const handleClose = () => setShowModal(SHOW_MODAL.NONE);

  return (
    <Col xl={2} className="h-100 mh-100 background-white p-0 m-0">
      <TitleBlock icons={icons}>Recipe</TitleBlock>

      <div className="drop-area">
        <DropArea cardsState={[cards, setCards]} steps={steps - 1} />
      </div>

      <ButtonBar loading={loading} handleStep={step} handleBake={bake()} />

      <Modal show={showModal !== SHOW_MODAL.NONE} onHide={handleClose}>
        {showModal === SHOW_MODAL.SAVE ? (
          <SaveModal handleClose={handleClose} cards={cards} />
        ) : (
          <OpenModal handleClose={handleClose} setCards={setCards} />
        )}
      </Modal>

      {loading && <RecipeProgressBar progress={progress} />}
    </Col>
  );
};
