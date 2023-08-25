// © Copyright 2023 HP Development Company, L.P.
export interface LabeledArrayProps {
  children: string; // The display name of the input
  state: [string[], React.Dispatch<React.SetStateAction<string[]>>];
}
