"""Runoff analysis (const.analyze_runoff) without a Home Assistant install.

const.py has no Home Assistant imports, so it is loaded straight from its file.
Run: python3 -m pytest tests/  (or python3 tests/test_runoff.py)
"""
from __future__ import annotations

import importlib.util
from pathlib import Path

_CONST = Path(__file__).parents[1] / "custom_components" / "precision_grow" / "const.py"
_spec = importlib.util.spec_from_file_location("pg_const", _CONST)
const = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(const)
analyze_runoff = const.analyze_runoff


def test_stacking_below_target_keeps_ec():
    # Runoff 2.3 above feed 1.9 (salts build up), still below target 2.4:
    # raising the feed would make it worse.
    r = analyze_runoff(runoff_ec=2.3, input_ec=1.9, target_ec=2.4, runoff_ph=6.1, input_ph=5.9)
    assert r["ec_trend"] == "ec_stacking"
    assert r["recommendation"] == "keep_ec"


def test_balanced_below_target_increases_ec():
    r = analyze_runoff(runoff_ec=1.95, input_ec=1.9, target_ec=2.4, runoff_ph=6.1, input_ph=5.9)
    assert r["ec_trend"] == "balanced"
    assert r["recommendation"] == "increase_ec"


def test_falling_below_target_increases_ec():
    r = analyze_runoff(runoff_ec=1.5, input_ec=1.9, target_ec=2.4, runoff_ph=6.1, input_ph=5.9)
    assert r["ec_trend"] == "substrate_ec_falling"
    assert r["recommendation"] == "increase_ec"


def test_far_above_target_reduces_or_flushes():
    assert analyze_runoff(3.6, 2.0, 2.4, 6.1, 5.9)["recommendation"] == "reduce_ec"
    assert analyze_runoff(4.6, 2.0, 2.4, 6.1, 5.9)["recommendation"] == "flush"


def test_ph_drop_checks_roots():
    assert analyze_runoff(2.0, 1.9, 2.4, 5.5, 5.9)["recommendation"] == "check_roots"


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
