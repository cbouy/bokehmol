import * as bokehmol from "./models"
export {bokehmol}

import {register_models} from "@bokehjs/base"
register_models(bokehmol as any)