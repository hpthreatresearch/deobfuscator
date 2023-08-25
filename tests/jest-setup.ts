// © Copyright 2023 HP Development Company, L.P.
import { UUID } from "@core/types";
import "@testing-library/jest-dom/extend-expect";


jest.mock("react-dnd", () => ({
  useDrag:jest.fn(() => [{}, jest.fn()]),
  useDrop: jest.fn(() => [{}, jest.fn()]),
  DndProvider: jest.fn(),
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: jest.fn(),
}));

jest.mock("@lewistg/base64-vlq-codec", () => ({
  base64VlqDecode: jest.fn(() => [])
}))

jest.mock("react-markdown", () => jest.fn());

jest.mock('@core/utils', () => ({
  ...(jest.requireActual('@core/utils')),
  getNewUUID: jest.fn(() => {return "TEST-ID" as UUID})
}))


export {};
