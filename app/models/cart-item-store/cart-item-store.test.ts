import { CartItemStoreModel, CartItemStore } from "./cart-item-store"

test("can be created", () => {
  const instance: CartItemStore = CartItemStoreModel.create({})

  expect(instance).toBeTruthy()
})