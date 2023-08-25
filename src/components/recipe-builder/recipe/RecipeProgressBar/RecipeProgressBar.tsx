// © Copyright 2023 HP Development Company, L.P.
import { createPortal } from "react-dom";
import type { RecipeProgressBarProps } from "./types";
import { ProgressBar } from "react-bootstrap";

export const RecipeProgressBar = ({ progress }: RecipeProgressBarProps) => {
  return createPortal(
    <ProgressBar animated now={progress * 100} className="my-progress-bar" />,
    document.body
  );
};
