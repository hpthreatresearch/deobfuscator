// © Copyright 2023 HP Development Company, L.P.
import renderer from "react-test-renderer";
import App from "./App";

describe(App, () => {
  it("", () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
