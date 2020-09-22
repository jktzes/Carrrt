import React from "react"
import { observer } from "mobx-react-lite"
import { Image, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { CartItem, useStores } from "../../models"
import { t } from 'react-native-tailwindcss'

const ROOT: ViewStyle = {
  flex: 1,
}

interface ICartItemProps {
  quantity: number
  meta: CartItem
  subTotal: {
    currencyString: string
    currencyQuantity: number
  }
}

const CartItemBlock = observer((props: ICartItemProps) => {
  const { quantity, meta, subTotal } = props
  const { cartItemStore } = useStores()

  const incrementItem = () => {
    cartItemStore.incrementItemById(meta.id)
  }

  const decrementItem = () => {
    cartItemStore.decrementItemById(meta.id)
  }

  return (
    <View style={[t.flex, t.flexRow, t.justifyBetween, t.p4]}>
      <View style={[t.flex, t.flexRow, t.justifyStart, t.itemsCenter, t.flexGrow]}>
        <Image source={{ uri: meta.thumbnail }} style={[t.w10, t.h10, t.mR4]} />
        <Text text={meta.name} />
      </View>
      <View style={[t.flex, t.flexRow, t.justifyBetween, t.itemsCenter, t.w24, t.flexGrow0, t.flexShrink0]}>
        <Button
          style={[t.flex, t.flexRow, t.justifyCenter, t.itemsCenter, t.w8, t.h8, t.flexGrow0, t.flexShrink0, t.roundedFull, t.bgTeal]}
          onPress={decrementItem}
        >
          <Text text={`－`} style={[t.textWhite]} />
        </Button>
        <View style={[t.flexGrow, t.flex, t.flexRow, t.justifyCenter]} >
          <Text text={`${quantity.toString()}`} />
        </View>
        <Button
          style={[t.flex, t.flexRow, t.justifyCenter, t.itemsCenter, t.w8, t.h8, t.flexGrow0, t.flexShrink0, t.roundedFull, t.bgTeal]}
          onPress={incrementItem}
        >
          <Text text={`+`} style={[t.textWhite]} />
        </Button>
      </View>
      <View style={[t.flex, t.flexRow, t.justifyEnd, t.itemsCenter, t.w24, t.flexGrow0, t.flexShrink0]}>
        <Text text={`${subTotal.currencyString} ${subTotal.currencyQuantity.toFixed(2)}`} />
      </View>
    </View>
  )
})

export const CartScreen = observer(function CartScreen() {
  const { cartItemStore: { cartItems, total } } = useStores()
  const navigation = useNavigation()
  const navigateToAddItemScreen = (mode: 'qr-code' | 'keyboard' = 'qr-code') => {
    navigation.navigate('add-item', {
      mode: mode
    })
  }

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  return (
    <Screen style={[ROOT, t.flex, t.flexCol, t.justifyBetween]} preset="scroll">
      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        <Text preset="header" text="Shopping Cart" />
      </View>

      <View style={[t.flexGrow, t.itemsStart]}>
        {
          cartItems.map((item) => {
            return (
              <CartItemBlock quantity={item.quantity} meta={item.meta} subTotal={item.subTotal} key={item.meta.id} />
            )
          })
        }
        {
          cartItems.length === 0 &&
          <View style={[t.flex, t.flexRow, t.flexGrow, t.wFull, t.justifyCenter, t.itemsCenter]}>
            <Text> No Items Added Yet </Text>
          </View>
        }
      </View>

      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        <Text style={[t.mY2]}>Total: {total.currencyString} {total.currencyQuantity.toFixed(2)} </Text>
        <Button style={[t.mY2]} text="Add Item via QR Code" onPress={() => { navigateToAddItemScreen('qr-code') }} />
        <Button text="Add Item via Keyboard" onPress={() => { navigateToAddItemScreen('keyboard') }} />
      </View>
    </Screen>
  )
})
