// Pass this exported function as code to the configured Playwright MCP
// browser_run_code_unsafe tool (strip the export keyword). It uses the supplied
// page and never starts a browser or shared context.
export async function checkAccessibility(page) {
  const assert = (condition, message = "Assertion failed") => {
    if (!condition) throw new Error(message);
  };
  assert.equal = (actual, expected, message) =>
    assert(actual === expected, `${message}: expected ${expected}, received ${actual}`);
  assert.deepEqual = (actual, expected, message) =>
    assert(JSON.stringify(actual) === JSON.stringify(expected), message);

  const results = [];
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  const focused = async (locator) => {
    const handle = await locator.elementHandle();
    try {
      await page.waitForFunction((element) => element === document.activeElement, handle, {
        timeout: 1500,
      });
      return true;
    } finally {
      await handle.dispose();
    }
  };
  const settled = () => page.locator('[data-testid="arcade-modal"]').waitFor({ state: "detached" });
  try {
    for (const mode of ["css", "png"]) {
      await page.setViewportSize(
        mode === "css" ? { width: 1280, height: 1000 } : { width: 390, height: 844 },
      );
      await page.goto(`http://localhost:5175/${mode === "png" ? "?render=png" : ""}`);
      await page.getByRole("button", { name: "SETTINGS", exact: true }).click();
      const tab = (name) => page.getByRole("tab", { name, exact: true });
      const checkbox = page.getByRole("checkbox", { name: "Reduce Motion", exact: true });
      const before = await checkbox.isChecked();
      await checkbox.focus();
      await page.keyboard.press("Space");
      assert.equal(await checkbox.isChecked(), !before, "Space toggles checkbox once");
      await page.locator("label").filter({ hasText: "Reduce Motion" }).click();
      assert.equal(await checkbox.isChecked(), before, "Visible label toggles checkbox once");
      // Reduce animations for the rest of this run without depending on saved preferences.
      if (!before) {
        await checkbox.focus();
        await page.keyboard.press("Space");
      }

      const language = page.getByRole("button", { name: "English Language", exact: true });
      await language.focus();
      await page.keyboard.press("Space");
      await page.getByRole("listbox", { name: "Language", exact: true }).waitFor();
      await page.keyboard.press("End");
      assert(
        await focused(page.getByRole("option", { name: "Deutsch", exact: true })),
        "End focuses last option",
      );
      await page.keyboard.press("Home");
      await page.keyboard.type("fr");
      assert(
        await focused(page.getByRole("option", { name: "Français", exact: true })),
        "Typeahead focuses matching option",
      );
      await page.keyboard.press("Enter");
      const french = page.getByRole("button", { name: "Français Language", exact: true });
      await french.waitFor();
      await page.getByRole("listbox", { includeHidden: true }).waitFor({ state: "detached" });
      assert(await focused(french), "Select restores trigger focus");
      await french.click();
      await page.keyboard.press("Escape");
      await page.getByRole("listbox", { includeHidden: true }).waitFor({ state: "detached" });
      assert(await focused(french), "Escape restores trigger focus");
      await french.click();
      const headingBox = await page
        .getByRole("heading", { name: "Settings", exact: true })
        .boundingBox();
      await page.mouse.click(
        headingBox.x + headingBox.width / 2,
        headingBox.y + headingBox.height / 2,
      );
      await page.getByRole("listbox", { includeHidden: true }).waitFor({ state: "detached" });

      const upload = page.getByRole("checkbox", { name: "Upload Crash Reports", exact: true });
      const uploadBefore = await upload.isChecked();
      const info = page.getByRole("button", { name: "About crash report uploads", exact: true });
      await info.click();
      await page.getByRole("dialog", { name: "Crash report upload information" }).waitFor();
      assert.equal(await upload.isChecked(), uploadBefore, "Info button does not toggle checkbox");
      assert(
        await page
          .getByRole("tab", { name: "Gameplay", exact: true, includeHidden: true })
          .evaluate((el) => !!el.closest('[inert],[aria-hidden="true"]')),
        "Modal hides background controls",
      );
      await page.keyboard.press("Escape");
      await settled();
      assert(await focused(info), "Dialog restores trigger focus");
      const erase = page.getByRole("button", { name: "Erase Saved Data", exact: true });
      await erase.click();
      const cancel = page.getByRole("button", { name: "Cancel", exact: true });
      await cancel.waitFor();
      assert(await focused(cancel), "Destructive dialog initially focuses Cancel");
      await page.keyboard.press("Shift+Tab");
      assert(
        await focused(page.getByRole("button", { name: "Erase", exact: true })),
        "Reverse Tab stays in dialog",
      );
      await page.keyboard.press("Tab");
      assert(await focused(cancel), "Forward Tab wraps inside dialog");
      await page.keyboard.press("Enter");
      await settled();
      assert(await focused(erase), "Cancel restores trigger focus");

      await tab("Gameplay").focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(await tab("Graphics").getAttribute("aria-selected"), "true");
      assert.deepEqual(
        await page.getByRole("tab").evaluateAll((els) => els.map((el) => el.tabIndex)),
        [-1, 0, -1, -1],
        "Only the selected tab is in the tab order",
      );
      const panel = page.getByRole("tabpanel", { name: "Graphics", exact: true });
      assert.equal(
        await tab("Graphics").getAttribute("aria-controls"),
        await panel.getAttribute("id"),
        "Tab and panel are associated",
      );
      await page.keyboard.press("ArrowRight");
      const volume = page.getByRole("slider", { name: "Master Volume", exact: true });
      await volume.focus();
      for (const [key, value] of [
        ["Home", "0"],
        ["ArrowRight", "5"],
        ["PageUp", "15"],
        ["End", "100"],
        ["ArrowLeft", "95"],
      ]) {
        await page.keyboard.press(key);
        assert.equal(await volume.inputValue(), value, `Slider ${key}`);
      }
      const track = volume.locator("xpath=../../..");
      const box = await track.boundingBox();
      await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
      assert.equal(await volume.inputValue(), "25", "Scaled track click sets value");
      const thumbBox = await volume.locator("xpath=../..").boundingBox();
      assert(
        Math.abs(thumbBox.y + thumbBox.height / 2 - (box.y + box.height / 2)) < 1,
        "Touch target is centered on visible slider",
      );
      await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 6 });
      await page.mouse.up();
      assert.equal(await volume.inputValue(), "75", "Scaled thumb drag sets value");

      await tab("Input").click();
      const left = page.getByRole("button", {
        name: "Change Left keyboard shortcut. Current key: Left arrow",
        exact: true,
      });
      await left.click();
      const capture = page.getByRole("group", { name: "Keyboard shortcut capture" });
      await capture.waitFor();
      assert(await focused(capture), "Shortcut capture receives initial focus");
      await page.keyboard.press("Tab");
      assert(
        await focused(page.getByRole("button", { name: "Cancel", exact: true })),
        "Tab reaches Cancel without rebinding",
      );
      await page.keyboard.press("Enter");
      await settled();
      await left.click();
      await page.keyboard.press("ArrowRight");
      await page.getByText("Already used by Right", { exact: true }).waitFor();
      await page.keyboard.press("k");
      await settled();
      await page
        .getByRole("button", { name: "Change Left keyboard shortcut. Current key: K", exact: true })
        .click();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      assert(
        await focused(page.getByRole("button", { name: "Reset", exact: true })),
        "Tab reaches Reset",
      );
      await page.keyboard.press("Enter");
      await settled();
      await left.waitFor();
      results.push(`${mode}: checkbox, select, dialogs, tabs, sliders, shortcut capture passed`);
    }
    assert.deepEqual(errors, [], "No runtime errors");
    return results;
  } finally {
    page.off("pageerror", onError);
  }
}
