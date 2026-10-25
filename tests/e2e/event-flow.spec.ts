import { expect, test } from "@playwright/test";

test("auth flow moves between login and signup forms", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("form", { name: "Log in" })).toBeVisible();
  await page.getByRole("link", { name: "Create account" }).click();
  await expect(page).toHaveURL(/signup/);
  await expect(
    page.getByRole("form", { name: "Create account" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole("form", { name: "Log in" })).toBeVisible();
});

test("auth pages fit desktop and Windows zoom-equivalent viewports", async ({
  page,
}) => {
  const viewports: Array<[number, number]> = [
    [1366, 768],
    [1440, 900],
    [1920, 1080],
    [1024, 768],
    [1242, 698],
    [1093, 614],
  ];

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    for (const route of ["/login", "/signup"]) {
      await page.goto(route);
      await expect(page.locator(".auth-shell")).toBeVisible();
      await page.waitForTimeout(250);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollHeight >
            document.documentElement.clientHeight ||
          document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflow at ${width}x${height}`).toBe(false);
    }
  }
});

test("runs one complete mock quiz", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  test.skip(!email || !password, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD.");

  await page.goto("/login");
  await page.getByLabel("College Email").fill(email!);
  await page.getByRole("textbox", { name: "Password" }).fill(password!);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/team");
  if (await page.getByRole("heading", { name: "Charter New Agency" }).count()) {
    await page.getByLabel("Agency Moniker").fill(`E2E Agency ${Date.now()}`);
    await page.getByRole("button", { name: "Charter Agency" }).click();
  }
  await page.getByRole("button", { name: "Mark me ready" }).click();
  await page.getByRole("button", { name: "Start investigation" }).click();
  await expect(page).toHaveURL(/quiz/);
  await expect(
    page.getByText(/The transmission reads AOT221B after decoding/),
  ).toBeVisible();
  await expect(page.getByRole("radio").first()).toBeVisible();
  await expect(page.locator('[aria-label$="seconds remaining"]')).toBeVisible();
  const quizOverflows = await page.evaluate(
    () =>
      document.documentElement.scrollHeight >
        document.documentElement.clientHeight ||
      document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
  );
  expect(quizOverflows).toBe(false);

  for (let question = 0; question < 3; question += 1) {
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Lock in answer" }).click();
    const next = page.getByRole("button", {
      name: /Continue investigation|View case results/,
    });
    await next.click();
  }

  await expect(page).toHaveURL(/results/);
  await expect(page.getByText("CASE CLOSED")).toBeVisible();
});
