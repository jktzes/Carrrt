import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const CartScreen = observer(function CartScreen() {
  const navigation = useNavigation()

  const navigateToAddItemScreen = () => {
    navigation.navigate('add-item')
  }

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="cartScreen" />
      <Button text="Add Item" onPress={navigateToAddItemScreen} />
    </Screen>
  )
})
