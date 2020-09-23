import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ItemInCart, useStores } from "../../models"
import { t } from "react-native-tailwindcss"
import { uniqBy, sortBy, reverse } from 'lodash'
import QRCodeScanner from 'react-native-qrcode-scanner'

const ROOT: ViewStyle = {
  flex: 1,
}

export interface IAddItemPromptProps {
  itemId: string
  itemInfo: ItemInCart | null
}

const AddItemPrompt = (props: IAddItemPromptProps) => {
  const { itemId, itemInfo } = props
  if (itemInfo) {
    return (<Text text={`✅ Added item ${itemInfo.meta.name}, item price: ${itemInfo.meta.price}, latest quantity: ${itemInfo.quantity}.`} />
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
  const routes = useRoute()
  const { params: { mode } } = routes

  const navigateToCartScreen = () => {
    navigation.navigate('cart')
  }

  const addItemToCartById = (id) => {
    const res = cartItemStore.incrementItemById(id)

    setAddItemPrompts((existingPrompts) => {
      return [...existingPrompts, JSON.parse(JSON.stringify({ itemId: id, itemInfo: res }))]
    })
  }

  const onScanSuccess = (e) => {
    const itemId = e.data
    setItemId(itemId)
    addItemToCartById(itemId)
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
          uniqBy(reverse(sortBy(addItemPrompts, item => item.itemInfo.lastUpdatedAt.valueOf())), 'itemId').map((singlePrompt) => {
            return (
              <AddItemPrompt itemId={singlePrompt.itemId} itemInfo={singlePrompt.itemInfo} key={singlePrompt.itemId + singlePrompt.itemInfo.lastUpdatedAt} />
            )
          })
        }
      </View>

      { mode === 'qr-code' && <QRCodeScanner
        cameraProps={{
          "style": [t.w36, t.h10]
        }}
        onRead={onScanSuccess}
        reactivateTimeout={1000}
        reactivate={true}
      />
      }

      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        { mode === 'keyboard' && <Button text="Add" onPress={() => { addItemToCartById(itemId) }} style={t.mY2} />}
        <Button text="Done" onPress={navigateToCartScreen} style={t.mY2} />
      </View>
    </Screen>
  )
})
