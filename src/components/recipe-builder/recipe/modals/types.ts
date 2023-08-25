// © Copyright 2023 HP Development Company, L.P.
/**
 * Props required by all modal components
 */
export interface BaseModalProps {
  /**
   *  A method to close the modal
   */
  handleClose: () => void;
}

/**
 * The storage of local recipes
 */
export interface RecipeBook {
  [name: string]: string;
}

/**
 * Type alias
 */
export type SetRecipeBook = React.Dispatch<React.SetStateAction<RecipeBook>>;
