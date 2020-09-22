import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { t } from "react-native-tailwindcss"

const ROOT: ViewStyle = {
  flex: 1,
}

export const AddItemScreen = observer(function AddItemScreen() {
  const [itemIdToSearch, setItemIdToSearch] = useState<string>('')
  const navigation = useNavigation()

  const navigateToCartScreen = () => {
    navigation.navigate('cart')
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
          onChangeText={(value) => setItemIdToSearch(value)}
          value={itemIdToSearch}
          placeholder="Please Type Item Id"
        />
      </View>

      <View style={[t.flexGrow0, t.flexShrink0, t.p4]} >
        <Button text="Done" onPress={navigateToCartScreen} />
      </View>
    </Screen>
  )
})
