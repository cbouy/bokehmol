# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.2.0] - 2025/07/15

### Added

- Support for displaying list of SMILES as a grid (PR#5, @LucaChiesa).
- Exposed the version of the package in Python through `bokehmol.__version__`.

### Fixed

- Failure to load the RDKit/SmilesDrawer JS in time would result in the plot
  not displaying in notebooks or returning errors in the console. This will
  now display a blank SVG on hover until the library is loaded.

### Changed

- Updated the build system.

---

## [0.1.1] - 2024/03/21

### Changed

- Made `IPython` an optional dependency (in case one only wants to save the
  HTML file instead of displaying it in a notebook)

---

## [0.1.0] - 2023/07/21

### Added

- Initial release: support for RDKit and SmilesDrawer hover tools.