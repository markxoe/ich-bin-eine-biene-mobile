import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

import packageJSON from "../package.json";
import releaseNotesJSON from "./other/release-notes.json";

test("renders without crashing", () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
test("Release Notes Header includes latest Version", () => {
  expect(releaseNotesJSON.header).toContain(packageJSON.version);
});
