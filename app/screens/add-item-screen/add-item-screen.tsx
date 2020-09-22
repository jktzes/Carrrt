import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { ItemInCart, useStores } from "../../models"
import { t } from "react-native-tailwindcss"
import { uniqBy } from 'lodash'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'

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

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});


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

  const onSuccess = (e) => {
    console.log('e on qr code', e)
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


   <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />

      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        <Button text="Add" onPress={addItemToCart} style={t.mY2} />
        <Button text="Done" onPress={navigateToCartScreen} style={t.mY2} />
      </View>
    </Screen>
  )
})
