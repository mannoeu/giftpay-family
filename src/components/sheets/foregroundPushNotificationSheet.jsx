import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

/**
 * Sheet genérico exibido quando uma push chega em foreground e o registry
 * define `openAsGenericSheetWhenInForeground: true`.
 *
 * @param {{ notification: import('@/sdk/push-notification/presentation/foreground').PushNotificationPresentation, sheetButtons: { visibleButtons: Array, direction?: string }, onMarkAsRead: () => void }} props
 */
export function ForegroundPushNotificationSheet({
  notification,
  sheetButtons,
  onMarkAsRead,
}) {
  const { visibleButtons = [], direction = "row" } = sheetButtons ?? {};

  return (
    <View style={styles.container}>
      {!!notification?.title && (
        <Text style={styles.title}>{notification.title}</Text>
      )}
      {!!notification?.body && (
        <Text style={styles.body}>{notification.body}</Text>
      )}

      <View
        style={[
          styles.actions,
          direction === "column" ? styles.actionsColumn : styles.actionsRow,
        ]}
      >
        {visibleButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.button}
            onPress={button.onPress}
          >
            <Text style={styles.buttonText}>{button.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.dismissButton} onPress={onMarkAsRead}>
          <Text style={styles.dismissText}>Dispensar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#202020",
  },
  body: {
    fontSize: 15,
    color: "#6F6F6F",
  },
  actions: {
    marginTop: 16,
    gap: 8,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionsColumn: {
    flexDirection: "column",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2B6E61",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F6F5F0",
    fontWeight: "600",
    fontSize: 15,
  },
  dismissButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  dismissText: {
    color: "#6F6F6F",
    fontSize: 15,
  },
});
