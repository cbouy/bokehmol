import importlib.resources
import os
import warnings
from dataclasses import dataclass


@dataclass()
class Settings:
    rdkitjs_url: str = (
        "https://unpkg.com/@rdkit/rdkit@{}/Code/MinimalLib/dist/RDKit_minimal.js"
    )
    rdkitjs_version: str = "2023.3.2-1.0.0"

    smilesdrawer_url: str = (
        "https://unpkg.com/smiles-drawer@{}/dist/smiles-drawer.min.js"
    )
    smilesdrawer_version: str = "2.0.1"

    dev_mode: bool = bool(os.environ.get("BOKEHMOL", None))

    @property
    def bokehmol_js(self) -> str:
        try:
            return importlib.resources.read_text("bokehmol", "bokehmol.min.js")
        except Exception as exc:
            if self.dev_mode:
                warnings.warn(
                    "Attempting to access pre-built bokehmol extension in development "
                    "mode. This should not be necessary."
                )
                return ""
            raise IOError("Could not load pre-built bokehmol extension") from exc

    @property
    def rdkitjs_src(self) -> str:
        return self.rdkitjs_url.format(self.rdkitjs_version)

    @property
    def smilesdrawer_src(self) -> str:
        return self.smilesdrawer_url.format(self.smilesdrawer_version)


settings = Settings()
