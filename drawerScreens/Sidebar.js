import React, {useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

const Sidebar = () => {
    const [sidebarState, setSidebarState] = useState({
        routes: [
            {
                name: "Meditionstyle",
                icon: "ios-home"
            },
            {
                name: "CoeficienteScreen",
                icon: "ios-contact"
            },
            {
                name: "PaginationScreen",
                icon: "ios-settings"
            },
        ]
    });
    return (
        <View>
            <Image source={require("../assets/images/splash/Logo_AlbertoGarel_texto.png")} style={styles.profileImg}/>
            <Text style={{fontWeight: "bold", fontSize: 16, marginTop: 10}}>Janna Doe</Text>
            <Text style={{color: "gray", marginBottom: 10}}>janna@doe.com</Text>
            <View style={styles.sidebarDivider}></View>
        </View>
    )

}
const styles = StyleSheet.create({
    profileImg:{
        width:80,
        height:80,
        borderRadius:40,
        marginTop:20
    },
    sidebarDivider:{
        height:1,
        width:"100%",
        backgroundColor:"lightgray",
        marginVertical:10
    }
})
export default Sidebar;
