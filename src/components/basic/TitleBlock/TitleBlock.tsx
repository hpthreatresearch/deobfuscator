// © Copyright 2023 HP Development Company, L.P.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./TitleBlock.css";
import type { TitleBlockProps } from "./types";

/**
 * A title with some icons
 */
export const TitleBlock = ({ children, icons, ...rest }: TitleBlockProps) => (
  <div className="title-block" {...rest}>
    <h3>{children}</h3>
    <div className="d-flex flex-row">
      {icons &&
        icons.map(({ onClick, icon, description, label }, idx) => (
          <OverlayTrigger
            key={idx}
            placement="bottom"
            overlay={<Tooltip>{description}</Tooltip>}
          >
            <div onClick={onClick} aria-label={label} data-testid={label}>
              <FontAwesomeIcon icon={icon} />
            </div>
          </OverlayTrigger>
        ))}
    </div>
  </div>
);
