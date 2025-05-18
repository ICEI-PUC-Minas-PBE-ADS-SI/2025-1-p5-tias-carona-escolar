import { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client, Versions } from "@stomp/stompjs";
import { useNavigation } from "@react-navigation/native";
import { lightTheme, Theme } from "@/src/constants/theme";
import { getStoredToken } from "@/src/services/token.service";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { getStoredUserID, getUser } from "@/src/services/user.service";
import { IUserRequest } from "@/src/interfaces/user-request.interface";

const API_BASE_URL = "wss://chat.strada.appbr.store";

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [userData, setUserData] = useState<IUserRequest | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const stompClient = useRef<Client | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = lightTheme;
  const styles = getStyles(theme);

  const connectWebSocket = async () => {
    try {
      const token = await getStoredToken();
      const currentUserId = await getStoredUserID();
      console.log(currentUserId);
      console.log(token);
      if (!token || !currentUserId || !id) {
        console.error("No token or user ID found");
        return;
      }
      setCurrentUserId(currentUserId);
      const url = `${API_BASE_URL}/connect?token=${token}`;
      const client = new Client({
        brokerURL: url,
        stompVersions: new Versions([Versions.V1_2]),
        reconnectDelay: 5000,
        forceBinaryWSFrames: true,
        debug: (msg) => console.log(msg),
      });

      client.onConnect = (frame) => {
        console.log("Connected to WebSocket:", frame);

        client.subscribe(
          `/app/${currentUserId.concat("_").concat(id)}/queue/messages`,
          (message) => {
            const newMessage: Message = JSON.parse(message.body);
            handleNewMessage(newMessage);
          }
        );
      };
      client.onStompError = (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      };
      client.onWebSocketError = (error) => {
        console.error("WebSocket error:", error);
      };
      client.onWebSocketClose = () => {
        console.log("WebSocket closed");
      };

      client.activate();
      stompClient.current = client;
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  };

  const handleNewMessage = useCallback((newMessage: Message | Team) => {
    if (!newMessage) return;
    if ("description" in newMessage) {
      setMessages(newMessage.messages);
      return;
    }
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      return updatedMessages.sort((a, b) => {
        return new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime();
      });
    });
  }, []);

  const getUserData = useCallback(async () => {
    try {
      if (!id) {
        console.error("No user ID found");
        return;
      }
      const response = await getUser(id);
      setUserData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [id]);

  useEffect(() => {
    connectWebSocket();
    getUserData();
  }, []);

  const sendMessage = () => {
    if (!messageText.trim() || !stompClient.current?.connected) return;

    try {
      const message: MessageSent = { content: messageText };

      const optimisticMsg: Message = {
        id: Date.now().toString(),
        sender: {
          id: "1",
          nickname: currentUserId,
        },
        content: messageText,
        sendAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, optimisticMsg]);

      stompClient.current.publish({
        destination: `/app/chat/${currentUserId.concat("_").concat(id)}`,
        body: JSON.stringify(message),
      });

      setMessageText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if ("description" in item) return null;
    const isMyMessage = item.sender.nickname === currentUserId;

    console.log("isMyMessage", item);

    if (isMyMessage) {
      return (
        <View style={styles.myMessageContainer}>
          <View style={styles.myMessageBubble}>
            <Text style={styles.myMessageText}>{item.content}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.sendAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.otherMessageContainer}>
        <View>
          <View style={styles.otherMessageBubble}>
            <Text style={styles.otherMessageText}>{item.content}</Text>
            <Text style={[styles.messageTime, { color: theme.blue }]}>
              {new Date(item.sendAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (false) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerInfo} activeOpacity={0.7}>
          <Image
            source={{
              uri:
                userData?.imgUrl ??
                "https://avatars.githubusercontent.com/u/124599?v=4",
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{userData?.username}</Text>
            <Text style={styles.headerSubtitle}>{userData?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            placeholderTextColor="#9E9E9E"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageText.trim() ? styles.sendButtonDisabled : {},
            ]}
            onPress={sendMessage}
            disabled={!messageText.trim() || !stompClient.current?.connected}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F6F5",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F6F5",
    },
    loadingText: {
      marginTop: 12,
      color: "#666",
      fontSize: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      paddingVertical: 12,
      paddingHorizontal: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    backButton: {
      padding: 4,
    },
    headerInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
    },
    headerImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    headerText: {
      marginLeft: 12,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    },
    headerSubtitle: {
      fontSize: 12,
      color: "#666",
      marginTop: 2,
    },
    membersButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F0F0F0",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      marginLeft: 12,
    },
    membersCount: {
      fontSize: 12,
      color: "#666",
      marginLeft: 4,
      fontWeight: "500",
    },
    connectingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF9C4",
      paddingVertical: 6,
    },
    connectingText: {
      fontSize: 12,
      color: "#7B6A00",
      marginLeft: 8,
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    myMessageContainer: {
      marginVertical: 4,
      alignSelf: "flex-end",
      maxWidth: "80%",
    },
    myMessageBubble: {
      backgroundColor: theme.primary,
      borderRadius: 18,
      borderBottomRightRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    myMessageText: {
      color: "#FFFFFF",
      fontSize: 15,
      alignSelf: "flex-end",
    },
    messageTime: {
      fontSize: 10,
      color: "#FFFFFF",
      alignSelf: "flex-end",
    },
    otherMessageContainer: {
      flexDirection: "row",
      marginVertical: 4,
      maxWidth: "80%",
      alignSelf: "flex-start",
    },
    senderImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    senderName: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 2,
    },
    otherMessageBubble: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
    },
    otherMessageText: {
      color: "#333333",
      fontSize: 15,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: "#EEEEEE",
    },
    input: {
      flex: 1,
      backgroundColor: "#F5F5F5",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      maxHeight: 100,
      fontSize: 15,
      color: "#333",
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonDisabled: {
      backgroundColor: "#CCCCCC",
    },
  });

export default ChatScreen;
