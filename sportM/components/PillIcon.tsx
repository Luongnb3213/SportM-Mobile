import { Entypo, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

const PillIcon = ({ typeName }: { typeName: string }) => {
    switch (typeName) {
        case "Bóng rổ":
            return <FontAwesome5 name="basketball-ball" size={14} color="black" />;
        case "Bóng đá":
            return <MaterialCommunityIcons name="soccer" size={14} color="black" />;
        case "Bóng bàn":
            return <FontAwesome6 name="ping-pong-paddle-ball" size={14} color="black" />;
        default:
            return <Entypo name="sports-club" size={14} color="black" />;
    }
};


export default PillIcon;