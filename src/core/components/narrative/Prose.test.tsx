import { render } from "@testing-library/react";

jest.mock("katex", () => ({
  renderToString: (tex: string) => `<span class="katex">${tex}</span>`,
}));

import { parseInline, Prose } from "./Prose";

describe("parseInline", () => {
  it("renders bold", () => {
    const { container } = render(<>{parseInline("the **dot product**")}</>);
    expect(container.querySelector("strong")?.textContent).toBe("dot product");
  });

  it("renders italic", () => {
    const { container } = render(<>{parseInline("something *adds up*")}</>);
    expect(container.querySelector("em")?.textContent).toBe("adds up");
  });

  it("renders code", () => {
    const { container } = render(<>{parseInline("use `u · v`")}</>);
    expect(container.querySelector("code")?.textContent).toBe("u · v");
  });

  it("renders inline math via katex", () => {
    const { container } = render(<>{parseInline("the **dot product** $u \\cdot v$")}</>);
    const math = container.querySelector(".katex-inline");
    expect(math).toBeTruthy();
    expect(math?.innerHTML).toContain("katex");
  });
});

describe("Prose", () => {
  it("splits blank lines into paragraphs", () => {
    const { container } = render(<Prose md={"first paragraph\n\nsecond paragraph"} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("renders $$ display math as a centered block", () => {
    const { container } = render(<Prose md={"intro\n\n$$u \\cdot v = |u||v|\\cos\\theta$$\n\nafter"} />);
    const block = container.querySelector(".text-center");
    expect(block?.innerHTML).toContain("katex");
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});
