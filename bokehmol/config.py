from dataclasses import dataclass


@dataclass()
class Settings:
    rdkitjs_url: str = (
        "https://unpkg.com/@rdkit/{}/Code/MinimalLib/dist/RDKit_minimal.js"
    )
    rdkitjs_version: str = "rdkit@2023.3.2-1.0.0"

    @property
    def rdkitjs_src(self) -> str:
        return self.rdkitjs_url.format(self.rdkitjs_version)


settings = Settings()
