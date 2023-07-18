RDKIT_JS = {"version": "rdkit@2023.3.2-1.0.0"}


def get_minimal_lib(version: str = RDKIT_JS["version"]) -> str:
    return f"https://unpkg.com/@rdkit/{RDKIT_JS['version']}/Code/MinimalLib/dist/RDKit_minimal.js"
