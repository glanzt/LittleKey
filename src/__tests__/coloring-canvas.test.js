import React from "react";
import { render, screen } from "@testing-library/react";
import ColoringCanvas from "@/components/coloring-canvas";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("next/link", () => {
  return function MockLink(props) {
    return <a href={props.href} {...props}>{props.children}</a>;
  };
});

function mockMatchMedia(config) {
  window.matchMedia = jest.fn().mockImplementation(function(query) {
    var matches = false;
    if (query === "(max-width: 900px) and (pointer: coarse)") matches = !!config.isPhone;
    if (query === "(orientation: portrait)") matches = !!config.isPortrait;
    return {
      matches: matches,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
}

describe("ColoringCanvas", function() {
  beforeEach(function() {
    window.localStorage.clear();
    mockMatchMedia({ isPhone: false, isPortrait: false });
  });

  it("loads persisted local progress for the artwork", async function() {
    window.localStorage.setItem("may-coloring:progress:cat:free", JSON.stringify({ bg: 1 }));

    render(<ColoringCanvas artworkId="cat" />);

    expect(await screen.findByText("1 מתוך 12 אזורים מלאים")).toBeTruthy();
  });

  it("shows the landscape overlay on a portrait phone", async function() {
    mockMatchMedia({ isPhone: true, isPortrait: true });

    render(<ColoringCanvas artworkId="cat" />);

    expect(await screen.findByText("הכי נוח לצבוע לרוחב")).toBeTruthy();
    expect(screen.getByText("נסו לעבור למסך רוחב")).toBeTruthy();
  });
});
