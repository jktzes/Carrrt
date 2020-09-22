import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { ItemInCart, useStores } from "../../models"
import { t } from "react-native-tailwindcss"
import { uniqBy } from 'lodash'

const ROOT: ViewStyle = {
  flex: 1,
}

export interface IAddItemPromptProps {
  itemId: string
  itemInfo: ItemInCart | null
}

const AddItemPrompt = (props: IAddItemPromptProps) => {
  const {itemId, itemInfo} = props
  if (itemInfo) {
    return ( <Text text={`✅ Added item ${itemInfo.meta.name}, item price: ${itemInfo.meta.price}, latest quantity: ${itemInfo.quantity}.`} />
    )
  } else {
    return (
      <Text text={`❗️ Could not find item by id ${itemId}.`} />
    )
  }
}

export const AddItemScreen = observer(function AddItemScreen() {
  const { cartItemStore } = useStores()
  const [itemId, setItemId] = useState<string>('')
  const [addItemPrompts, setAddItemPrompts] = useState<Array<IAddItemPromptProps>>([])
  const navigation = useNavigation()

  const navigateToCartScreen = () => {
    navigation.navigate('cart')
  }

  const addItemToCart = () => {
    const res = cartItemStore.incrementItemById(itemId)

    setAddItemPrompts((existingPrompts) => {
      return [...existingPrompts, { itemId: itemId, itemInfo: res }]
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
      <View style={[t.flexGrow0, t.flexShrink0, t.pX4, t.pT4]} >
        <Text preset="header" text="Add Item By Id" />
      </View>

      <View style={[t.flexGrow, t.pX4]}>
        <TextField
          onChangeText={(value) => setItemId(value)}
          value={itemId}
          placeholder="Please Type Item Id"
        />
        {
          uniqBy(addItemPrompts, 'itemId').map((singlePrompt) => {
            return (
              <AddItemPrompt itemId={singlePrompt.itemId} itemInfo={singlePrompt.itemInfo} key={singlePrompt.itemId} />
            )
          })
        }
      </View>

      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        <Button text="Add" onPress={addItemToCart} style={t.mY2} />
        <Button text="Done" onPress={navigateToCartScreen} style={t.mY2} />
      </View>
    </Screen>
  )
})
