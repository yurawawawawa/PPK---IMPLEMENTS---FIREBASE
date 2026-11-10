import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export default function AppButton({
  title,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (pressed || disabled || loading) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? "#18312d" : "#fff"} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: "#18312d",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: "#dceadf" },
  label: { color: "#fff", fontWeight: "600", fontSize: 15 },
  secondaryLabel: { color: "#18312d" },
  dimmed: { opacity: 0.6 },
});
