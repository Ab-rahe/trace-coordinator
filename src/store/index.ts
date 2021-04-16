import default_state from "configs/state.default";
import { Store, MaintainerManager, Maintainer as GenericMaintainer } from "lib/Stato";
import { UpdateType } from "./UpdateType";

export type Maintainer = GenericMaintainer<typeof default_state, UpdateType>;
export const store = new Store(default_state);
export const maintainer_manager = new MaintainerManager<typeof default_state, UpdateType>(store);
