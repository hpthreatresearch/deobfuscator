// © Copyright 2023 HP Development Company, L.P.
import type { Item } from "@core/types";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export const ReplaceExpressionModule = (props: {
  setParams: (params: any) => void;
  item: Item;
}) => {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  useEffect(() => {
    if (props.item.params.find) {
      setFind(props.item.params.find as string);
    }

    if (props.item.params.replace) {
      setReplace(props.item.params.replace as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.setParams({
      find,
      replace,
    });
  }, [find, replace]);

  return (
    <div className="module">
      <div className="mb-3">Replace Expression</div>
      <Form.Control
        type="text"
        value={find}
        onChange={(e) => {
          setFind(e.target.value);
        }}
        placeholder="Find"
        className="mb-2"
      />
      <Form.Control
        type="text"
        value={replace}
        onChange={(e) => {
          setReplace(e.target.value);
        }}
        placeholder="Replace"
      />
    </div>
  );
};
