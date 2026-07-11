import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StoryPage from "./StoryPage";

function renderStory(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/story/:lessonId" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("StoryPage", () => {
  beforeEach(() => localStorage.clear());

  it("renders an authored Lesson v2 route", async () => {
    renderStory("/story/2.3");

    expect(await screen.findByRole("heading", { name: "When directions agree" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Lesson progress" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Exit lesson" })).toHaveAttribute("href", "/lesson/2.3");
  });

  it("offers the standard lesson when no guided lesson exists", () => {
    renderStory("/story/9.9");

    expect(screen.getByText("No guided lesson has been authored for lesson 9.9 yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open the standard lesson/ })).toHaveAttribute("href", "/lesson/9.9");
  });
});
