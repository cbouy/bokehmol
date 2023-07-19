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

    @property
    def rdkitjs_src(self) -> str:
        return self.rdkitjs_url.format(self.rdkitjs_version)

    @property
    def smilesdrawer_src(self) -> str:
        return self.smilesdrawer_url.format(self.smilesdrawer_version)


settings = Settings()
