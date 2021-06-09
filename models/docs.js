import { SYNC_DOCS } from "/utils/sync.js";
import { defaultDocument } from "/utils/mutations/docs.js";
import createConnect from "/models/generic.js"

export default createConnect({
  name: "files",
  getDefaultItem: defaultDocument,
  syncMutation: SYNC_DOCS,
})
