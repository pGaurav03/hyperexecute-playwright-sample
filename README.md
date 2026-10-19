# HyperExecute + Playwright Sample

Playwright test suite orchestrated by LambdaTest **HyperExecute**. The browsers run
on the **LambdaTest cloud** (`wss://cdp.lambdatest.com/playwright`), not locally on
the HyperExecute VM. HyperExecute marks a scenario "skipped" unless it opens a real
LambdaTest session (same reason as the WDIO project).

| File | Purpose |
|---|---|
| `package.json` | `@playwright/test` 1.53.2 + `allure-playwright` 3.11.1. These versions are pinned together because newer allure-playwright needs Playwright 1.62 or later. |
| `playwright.config.js` | Reporters (list, junit, allure). Uses 1 worker because parallelism comes from HyperExecute. |
| `lambdatest-setup.js` | Overrides the `page` fixture to connect to LambdaTest (one session per test, named after the test) and sends pass/fail back to the session. |
| `tests/playwright-title.spec.js` | Opens playwright.dev, checks the title, then goes to Get started |
| `tests/the-internet-login.spec.js` | Wrong login shows an error, then the correct login succeeds |
| `yaml/hyperexecute.yaml` | HyperExecute job on a **Linux** VM: autosplit, concurrency 2, Allure via `partialReports` |
| `yaml/hyperexecute-win.yaml` | Same job on a **Windows** VM (`runson: win`). Uses PowerShell-safe `pre`/`post` commands. |
| `yaml/hyperexecute-win11.yaml` | **Windows 11** VM (`runson: win11`). The browser also runs on Windows 11 because `env: LT_PLATFORM` is set. |
| `yaml/hyperexecute-mac.yaml` | **macOS** VM (`runson: mac`). The Linux `post` commands failed the "postrun" step here, so its `post` is just `ls reports/junit`. |

## Running it

```bash
npm install

# set your LambdaTest credentials (from https://accounts.lambdatest.com/security)
export LT_USERNAME="<your-username>"
export LT_ACCESS_KEY="<your-access-key>"

# download the HyperExecute CLI (it is not committed to this repo)
curl -O https://downloads.lambdatest.com/hyperexecute/darwin/hyperexecute   # macOS
# curl -O https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute  # Linux
# Windows: https://downloads.lambdatest.com/hyperexecute/windows/hyperexecute.exe
chmod +x hyperexecute

# local sanity check (real LambdaTest sessions, no HyperExecute)
npx playwright test

# the HyperExecute run
./hyperexecute --user "$LT_USERNAME" --key "$LT_ACCESS_KEY" --config yaml/hyperexecute.yaml

# same job on a Windows VM
./hyperexecute --user "$LT_USERNAME" --key "$LT_ACCESS_KEY" --config yaml/hyperexecute-win.yaml
```

The browser OS and the HyperExecute VM OS are separate settings:
- **VM OS:** set it with `runson` (`linux`, `win`, `win11`, `mac`).
- **Browser:** set it with the yaml `env:` block, which `lambdatest-setup.js` reads. If you leave these out, the defaults are Chrome latest on Windows 10:
  ```yaml
  env:
    LT_PLATFORM: "macOS Sonoma"   # or "Windows 11"
    LT_BROWSER: "Chrome"
    LT_BROWSER_VERSION: "latest"
  ```

To change the browser or OS, edit `capabilities` in `lambdatest-setup.js`. When you
upgrade Playwright, check that LambdaTest supports that client version.

## Verified

HyperExecute job `f3fe0615-4497-40fe-903a-c973e4d69d03`: **COMPLETED**, 2/2 tasks,
100% pass on the pre, test and post stages, 0 failed tasks.
Windows job `a9f70398-b881-4e6a-9369-5f695994c6cf`, Windows 11 job `e62f6fff-a37e-4bc2-beef-905fbe10f704`
and macOS job `decd5e22-e6cf-4bcc-a7d9-ec362e754b84`: all **COMPLETED**, 2/2 tasks, 0 failed.
