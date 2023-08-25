// © Copyright 2023 HP Development Company, L.P.
import { Container, Row } from "react-bootstrap";
import type { MainContainerProps } from "./types";

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <Container className="overflow-none-100 p-1 mb-2 background-gray" fluid>
      <Row className="overflow-none-100 gx-1">{children}</Row>
    </Container>
  );
};
