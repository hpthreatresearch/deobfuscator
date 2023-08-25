// © Copyright 2023 HP Development Company, L.P.
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

// An icon that can be clicked
export interface FunctionalIcon {
  /**
   *  Method for when the icon gets clicked
   */
  onClick: () => void;

  /**
   * FontAwesome icon
   */
  icon: IconDefinition;

  /**
   * Brief description for a tooltip
   */
  description: string;

  /**
   * Accessibility label
   */
  label?: string;
}

export interface TitleBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title
   */
  children: string | string[];

  /**
   *  A list of clickable icons that will be rendered next to the title
   */
  icons?: FunctionalIcon[];
}
