// © Copyright 2023 HP Development Company, L.P.
/**
 * Props for the Recipe component
 */
export interface RecipeProps {
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  obfCode: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setMappings: React.Dispatch<React.SetStateAction<number[][]>>;
}

/**
 * Enum for the current state of the modal
 */
export enum SHOW_MODAL {
  SAVE, // The save modal is open
  OPEN, // The open modal is open
  NONE, // No modal is open
}
