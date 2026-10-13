import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";

// jsdom does not load stylesheets; React 19 otherwise waits for their load event.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...actual, HeadContent: () => null, Scripts: () => null };
});

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  // TanStack Start renders a full HTML document, rather than a div subtree.
  return render(<RouterProvider router={router} />, {
    container: document as unknown as HTMLElement,
    baseElement: document.documentElement,
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Verify the store route and the fallback route render their expected content.
describe("App routing", () => {
  it("renders the index route", async () => {
    renderAt("/");

    await waitFor(() => expect(document.querySelector("#catalogo")).not.toBeNull());
  });

  it("renders the not-found route", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    renderAt("/this-route-does-not-exist");

    await waitFor(() => expect(document.body.textContent).toContain("404"));
  });
});
