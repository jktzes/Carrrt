import { Instance, SnapshotOut, types as t } from "mobx-state-tree"
import { CartItemModel } from "../cart-item/cart-item"

const sampleCatalog =
  [
    {
      "id": "0001",
      "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0001",
      "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/banana_1f34c.png",
      "name": "Banana",
      "price": "$1.00"
    },
    {
      "id": "0002",
      "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0002",
      "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/red-apple_1f34e.png",
      "name": "Apple",
      "price": "$4.00"
    },
    {
      "id": "0003",
      "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0003",
      "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/sparkles_2728.png",
      "name": "Other Stuff",
      "price": "$10.00"
    }
  ]

const defaultCartState = [
  { quantity: 1, meta: sampleCatalog[0], lastUpdatedAt: new Date() },
  { quantity: 2, meta: sampleCatalog[1], lastUpdatedAt: new Date() },
  { quantity: 3, meta: sampleCatalog[2], lastUpdatedAt: new Date() },
]


/**
 * Model description here for TypeScript hints.
 */
export const CartItemStoreModel = t.model({
  cartItems: t.optional(t.array(t.model({
    quantity: t.number,
    meta: CartItemModel,
    lastUpdatedAt: t.Date
  })), defaultCartState)
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

type CartItemStoreType = Instance<typeof CartItemStoreModel>
export interface CartItemStore extends CartItemStoreType { }
type CartItemStoreSnapshotType = SnapshotOut<typeof CartItemStoreModel>
export interface CartItemStoreSnapshot extends CartItemStoreSnapshotType { }
