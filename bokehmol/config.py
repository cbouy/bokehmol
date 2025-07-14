from dataclasses import dataclass


@dataclass()
class Settings:
    """Settings for bokehmol.

    Attributes
    ----------
    use_packaged_js: bool
        Use the packaged JavaScript file directly instead of the version distributed
        on NPM. Meant for debugging/development work and requires installing the package
        in editable mode.
    *_url: str
        Template URL string used to load JS dependencies.
    *_version: str
        Version of the package injected in the corresponding template string.
    """

    use_packaged_js: bool = True
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
