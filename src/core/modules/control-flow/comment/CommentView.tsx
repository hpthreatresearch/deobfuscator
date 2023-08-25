// © Copyright 2023 HP Development Company, L.P.
import type { ModuleComponentPropType, ModuleComponentType } from "@core/types";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export const CommentView: ModuleComponentType = ({
  setParams,
  item: { params },
}: ModuleComponentPropType) => {
  const [comment, setComment] = useState("// I'm a comment");
  useEffect(() => setParams({ comment }), [comment]);

  useEffect(() => {
    if ("comment" in params && typeof params.comment === "string") {
      setComment(params.comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="module base-module-content">
      <Form.Control
        as="textarea"
        rows={3}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
    </div>
  );
};
