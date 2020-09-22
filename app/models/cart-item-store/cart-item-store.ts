import { Instance, SnapshotOut, types as t } from "mobx-state-tree"
import { CartItem, CartItemModel } from "../cart-item/cart-item"

const calculateSubTotalByPriceAndQuantity = (priceString, quantity) => {
  return {
    currencyString: priceString[0],
    currencyQuantity: parseInt(priceString.split(priceString[0])[1]) * quantity
  }
}

export const sampleCatalog =
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

const defaultCartState = []

export interface ItemInCart {
  quantity: number,
  meta: CartItem,
  lastUpdatedAt: Date,
  subTotal: {
    currencyString: string,
    currencyQuantity: number
  }
}

/**
 * Model description here for TypeScript hints.
 */
export const CartItemStoreModel = t.model({
  cartItems: t.optional(t.array(t.model({
    quantity: t.number,
    meta: CartItemModel,
    lastUpdatedAt: t.Date,
    subTotal: t.optional(t.model({
      currencyString: t.string,
      currencyQuantity: t.number
    }), {
      currencyString: '$',
      currencyQuantity: 0
    })
  })), defaultCartState)
})
  .props({})
  .views(self => ({
    get total() {
      let totalCounter = 0
      self.cartItems.map((item) => {
        totalCounter = totalCounter + item.subTotal.currencyQuantity
      })
      return {
        currencyString: self.cartItems.length > 0 ? self.cartItems[0].subTotal.currencyString : '$',
        currencyQuantity: totalCounter
      }
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    incrementItemById: (id: string) => {
      const existingItem = self.cartItems.find((item => item.meta.id === id))
      const calculateItemSubTotal = () => {
        existingItem.subTotal = calculateSubTotalByPriceAndQuantity(existingItem.meta.price, existingItem.quantity)
      }
      if (existingItem) {
        existingItem.quantity++
        calculateItemSubTotal()
        return existingItem
      } else {
        const itemInCatalog = sampleCatalog.find((item => item.id === id))
        if (itemInCatalog) {
          const itemToAdd = {
            quantity: 1,
            meta: itemInCatalog,
            lastUpdatedAt: new Date()
          }
          itemToAdd.subTotal = calculateSubTotalByPriceAndQuantity(itemToAdd.meta.price, 1)
          self.cartItems.push(itemToAdd)
          return itemToAdd
        } else {
          return null
        }
      }
    },
    decrementItemById: (id: string) => {
      const existingItem = self.cartItems.find((item => item.meta.id === id))
      const calculateItemSubTotal = () => {
        existingItem.subTotal = calculateSubTotalByPriceAndQuantity(existingItem.meta.price, existingItem.quantity)
      }
      if (existingItem) {
        if (existingItem.quantity === 1) {
          self.cartItems = self.cartItems.filter(item => item.meta.id !== id)
        } else {
          existingItem.quantity--
          calculateItemSubTotal()
        }
        return existingItem
      } else {
        return null
      }
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

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
