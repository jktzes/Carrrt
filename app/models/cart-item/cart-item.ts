import { Instance, SnapshotOut, types as t } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const CartItemModel = t.model({
    id: t.identifier,
    qrUrl: t.string,
    thumbnail: t.string,
    name: t.string,
    price: t.string
  })
  .props({})
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type CartItemType = Instance<typeof CartItemModel>
export interface CartItem extends CartItemType { }
type CartItemSnapshotType = SnapshotOut<typeof CartItemModel>
export interface CartItemSnapshot extends CartItemSnapshotType { }
