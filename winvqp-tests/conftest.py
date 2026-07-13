import pytest
import os
import subprocess
import pyautogui
from pywinauto import Desktop
from pages.base_page import launch_app, get_main_window, SCREENSHOT_DIR, APP_TITLE_CLASS


def pytest_configure(config):
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    pyautogui.FAILSAFE = True


@pytest.fixture(scope="session")
def app():
    main_proc = launch_app()
    yield None
    try:
        main_proc.terminate()
    except Exception:
        pass
    try:
        Desktop(backend="win32").window(class_name=APP_TITLE_CLASS).close()
    except Exception:
        pass


@pytest.fixture(scope="session")
def main_window(app):
    return get_main_window()


@pytest.fixture(autouse=True)
def screenshot_on_failure(request, app):
    yield
    if request.node.rep_call.failed if hasattr(request.node, "rep_call") else False:
        try:
            win = Desktop(backend="win32").window(class_name=APP_TITLE_CLASS)
            if win.exists():
                name = request.node.name
                win.capture_as_image().save(
                    os.path.join(SCREENSHOT_DIR, f"FAIL_{name}.png")
                )
        except Exception:
            pass


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)
