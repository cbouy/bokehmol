"""This file is adapted from holoviz/geoviews and distributed under a BSD 3-Clause
License:

Copyright (c) 2019, HoloViz Developers
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of cube-explorer nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""

from __future__ import annotations

import json
import os
import sys
import typing as t
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface

PACKAGE = "bokehmol"
BASE_DIR = Path(__file__).parent
GREEN, RED, RESET = "\033[0;32m", "\033[0;31m", "\033[0m"


def build_models():
    from bokeh.ext import build

    print(f"{GREEN}[{PACKAGE}]{RESET} Starting building custom models", flush=True)
    src_dir = BASE_DIR / PACKAGE
    success = build(src_dir)
    if sys.platform != "win32":
        # npm can cause non-blocking stdout; so reset it just in case
        import fcntl

        flags = fcntl.fcntl(sys.stdout, fcntl.F_GETFL)
        fcntl.fcntl(sys.stdout, fcntl.F_SETFL, flags & ~os.O_NONBLOCK)

    if success:
        print(f"{GREEN}[{PACKAGE}]{RESET} Finished building custom models", flush=True)
    else:
        print(f"{RED}[{PACKAGE}]{RESET} Failed building custom models", flush=True)
        sys.exit(1)


def clean_js_version(version):
    version = version.replace("-", "")
    for dev in ("a", "b", "rc"):
        version = version.replace(f"{dev}.", dev)
    return version


def validate_js_version(version):
    # TODO: Double check the logic in this function
    version = version.split(".post")[0]
    with open(f"./{PACKAGE}/package.json") as f:
        package_json = json.load(f)
    js_version = package_json["version"]
    version = version.split("+")[0]
    if any(dev in version for dev in ("a", "b", "rc")) and "-" not in js_version:
        raise ValueError(
            f"{PACKAGE}.js dev versions ({js_version}) must separate dev suffix with a dash, e.g. v1.0.0rc1 should be v1.0.0-rc.1."
        )
    if version != "None" and version != clean_js_version(js_version):
        raise ValueError(
            f"{PACKAGE}.js version ({js_version}) does not match {PACKAGE} version ({version}). Cannot build release."
        )


class BuildHook(BuildHookInterface):
    """The hatch build hook."""

    PLUGIN_NAME = "install"

    def initialize(self, version: str, build_data: dict[str, t.Any]) -> None:
        """Initialize the plugin."""
        if self.target_name not in ["wheel", "sdist"]:
            return

        validate_js_version(self.metadata.version)
        build_models()
