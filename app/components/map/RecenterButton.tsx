import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type RecenterButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export const RecenterButton: React.FC<RecenterButtonProps> = ({
  visible,
  onPress,
}) => {
  if (!visible) return null;

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>現在地</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    bottom: 32,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonText: {
    fontWeight: "600",
    color: "#333",
  },
});
