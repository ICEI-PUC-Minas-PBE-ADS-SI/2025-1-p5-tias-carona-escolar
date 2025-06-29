import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { lightTheme, Theme } from "@/src/constants/theme";
import { fonts } from "@/src/constants/fonts";
import { AppImages } from "@/src/assets";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ICreadentials } from "@/src/interfaces/credentials.interface";
import { getAccessToken } from "@/src/services/auth.service";
import { IUserRequest } from "@/src/interfaces/user-request.interface";
import { createUser } from "@/src/services/user.service";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

type ActionType =
  | "login"
  | "register-step-1"
  | "register-step-2"
  | "register-step-3"
  | "password-recovery";

const InputField: React.FC<{
  iconName: string;
  iconLibrary: "Ionicons" | "SimpleLineIcons";
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  theme: Theme;
  value?: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  styles: ReturnType<typeof createStyles>;
  toggleSecure?: () => void;
}> = ({
  iconName,
  iconLibrary,
  placeholder,
  secureTextEntry,
  keyboardType,
  theme,
  styles,
  value,
  editable,
  toggleSecure,
  onChangeText,
}) => (
  <View style={styles.inputContainer}>
    {iconLibrary === "Ionicons" ? (
      <Ionicons name={iconName} size={30} color={theme.blue} />
    ) : (
      <SimpleLineIcons name={iconName} size={30} color={theme.blue} />
    )}
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor={theme.blue}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType ?? "default"}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
    />
    {toggleSecure && (
      <TouchableOpacity onPress={toggleSecure}>
        <SimpleLineIcons name="eye" size={20} color={theme.blue} />
      </TouchableOpacity>
    )}
  </View>
);

const LoginScreen: React.FC<Props> = ({ animationController }) => {
  const [actionType, setActionType] = useState<ActionType>("login");
  const [credentials, setCredentials] = useState<ICreadentials>({
    name: "",
    username: "",
    email: "",
    password: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [slideAnim] = useState(new Animated.Value(0));
  const theme = lightTheme;
  const styles = createStyles(theme);
  const window = useWindowDimensions();
  const router = useRouter();

  const slideContainerAnim =
    animationController?.current?.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [window.width, window.width, 0],
    }) ?? new Animated.Value(0);

  const titleTextAnim =
    animationController?.current?.interpolate({
      inputRange: [0, 0.6, 0.8, 1],
      outputRange: [26 * 10, 26 * 10, 26 * 10, 0],
    }) ?? new Animated.Value(0);

  useEffect(() => {
    const fetchAddress = async () => {
      const cep = credentials.cep?.replace(/\D/g, "");
      if (cep?.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          if (!response.ok) {
            console.error(`Erro na API do ViaCEP. Status: ${response.status}.`);
            return;
          }
          const data = await response.json();
          if (!data.erro) {
            setCredentials((prev) => ({
              ...prev,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    };
    fetchAddress();
  }, [credentials.cep]);

  const animateSlideTransition = useCallback(
    (newActionType: ActionType, direction: "left" | "right") => {
      const endValue = direction === "left" ? -window.width : window.width;
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: endValue,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction === "left" ? window.width : -window.width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => setActionType(newActionType), 300);
    },
    [slideAnim, window.width]
  );

  const handleTextChange = useCallback(
    (key: keyof ICreadentials, value: string) => {
      setCredentials((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSignup = useCallback(async () => {
    if (actionType === "login") {
      return animateSlideTransition("register-step-1", "left");
    }
    if (actionType === "register-step-1") {
      return animateSlideTransition("register-step-2", "left");
    }
    if (actionType === "register-step-2") {
      return animateSlideTransition("register-step-3", "left");
    }
    if (actionType === "register-step-3") {
      setIsCreatingUser(true);

      const userData: IUserRequest = {
        name: credentials.name,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        imgUrl: "",
        address: `${credentials.street}, ${credentials.number}`,
        cep: credentials.cep,
        city: credentials.city,
        state: credentials.state,
      };

      try {
        await createUser(userData);
        Alert.alert("Sucesso!", "Seu cadastro foi realizado com sucesso.", [
          { text: "OK", onPress: () => animateSlideTransition("login", "right") }
        ]);
      } catch (error) {
        Alert.alert("Erro no Cadastro", "Não foi possível criar seu usuário. Por favor, tente novamente.");
      } finally {
        setIsCreatingUser(false);
      }
    }
  }, [actionType, animateSlideTransition, credentials]);

  const handleLogin = useCallback(
    (type: "local" | "github" | "google") => {
      if (type === "local") {
        const loginCredentials = { username: credentials.email!, password: credentials.password! };
        getAccessToken(loginCredentials)
          .then((tokens) => {
            console.log("Login com sucesso", tokens);
            router.replace("/home");
          })
          .catch((error) => {
            console.error("Erro no login:", error);
            Alert.alert("Erro de Login", "Email ou senha inválidos.");
          });
        return;
      }
      animateSlideTransition("login", "left");
      router.push(`/social-auth/${type}`);
    },
    [credentials.email, credentials.password, animateSlideTransition, router]
  );

  const handleGoBack = useCallback(() => {
    if (
      actionType === "register-step-1" ||
      actionType === "password-recovery"
    ) {
      animateSlideTransition("login", "right");
    } else if (actionType === "register-step-2") {
      animateSlideTransition("register-step-1", "right");
    } else if (actionType === "register-step-3") {
      animateSlideTransition("register-step-2", "right");
    } else {
      router.back();
    }
  }, [actionType, router, animateSlideTransition]);

  const renderForm = () => (
    <Animated.View
      style={[
        styles.formContainerInner,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      {actionType === "register-step-1" && (
        <>
          <InputField
            iconName="person-outline"
            iconLibrary="Ionicons"
            placeholder="Seu nome completo"
            theme={theme}
            styles={styles}
            value={credentials.name}
            onChangeText={(text) => handleTextChange("name", text)}
          />
          <InputField
            iconName="person-outline"
            iconLibrary="Ionicons"
            placeholder="Seu nome de usuário"
            theme={theme}
            styles={styles}
            value={credentials.username}
            onChangeText={(text) => handleTextChange("username", text)}
          />
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.forgotPasswordText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignup}
            style={[styles.loginButtonWrapper, { marginTop: 20 }]}
          >
            <Icon
              name="arrow-forward-ios"
              size={24}
              color={theme.background}
              style={styles.loginText}
            />
          </TouchableOpacity>
        </>
      )}

      {actionType === "register-step-2" && (
        <>
          <InputField
            iconName="mail-outline"
            iconLibrary="Ionicons"
            placeholder="Seu email"
            keyboardType="email-address"
            theme={theme}
            styles={styles}
            value={credentials.email}
            onChangeText={(text) => handleTextChange("email", text)}
          />
          <InputField
            iconName="lock"
            iconLibrary="SimpleLineIcons"
            placeholder="Sua senha"
            secureTextEntry={secureEntry}
            theme={theme}
            styles={styles}
            value={credentials.password}
            onChangeText={(text) => handleTextChange("password", text)}
            toggleSecure={() => setSecureEntry((prev) => !prev)}
          />
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.forgotPasswordText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Avançar</Text>
          </TouchableOpacity>
        </>
      )}

      {actionType === "register-step-3" && (
        <>
          <InputField
            iconName="map-outline"
            iconLibrary="Ionicons"
            placeholder="CEP"
            keyboardType="numeric"
            theme={theme}
            styles={styles}
            value={credentials.cep}
            onChangeText={(text) => handleTextChange("cep", text)}
          />
          <InputField
            iconName="location-outline"
            iconLibrary="Ionicons"
            placeholder="Rua"
            theme={theme}
            styles={styles}
            value={credentials.street}
            editable={false}
          />
          <InputField
            iconName="location-outline"
            iconLibrary="Ionicons"
            placeholder="Bairro"
            theme={theme}
            styles={styles}
            value={credentials.neighborhood}
            editable={false}
          />
          <InputField
            iconName="business-outline"
            iconLibrary="Ionicons"
            placeholder="Cidade"
            theme={theme}
            styles={styles}
            value={credentials.city}
            editable={false}
          />
          <InputField
            iconName="flag-outline"
            iconLibrary="Ionicons"
            placeholder="Estado"
            theme={theme}
            styles={styles}
            value={credentials.state}
            editable={false}
          />
          <InputField
            iconName="home-outline"
            iconLibrary="Ionicons"
            placeholder="Número"
            keyboardType="numeric"
            theme={theme}
            styles={styles}
            value={credentials.number}
            onChangeText={(text) => handleTextChange("number", text)}
          />
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.forgotPasswordText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignup}
            style={[styles.loginButtonWrapper, isCreatingUser && styles.disabledButton]}
            disabled={isCreatingUser}
          >
            {isCreatingUser ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text style={styles.loginText}>Finalizar Cadastro</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {actionType === "login" && (
        <>
          <InputField
            iconName="mail-outline"
            iconLibrary="Ionicons"
            placeholder="Seu email"
            keyboardType="email-address"
            theme={theme}
            styles={styles}
            value={credentials.email}
            onChangeText={(text) => handleTextChange("email", text)}
          />
          <InputField
            iconName="lock"
            iconLibrary="SimpleLineIcons"
            placeholder="Sua senha"
            secureTextEntry={secureEntry}
            theme={theme}
            styles={styles}
            value={credentials.password}
            onChangeText={(text) => handleTextChange("password", text)}
            toggleSecure={() => setSecureEntry((prev) => !prev)}
          />
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButtonWrapper}
            onPress={() => handleLogin("local")}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: slideContainerAnim }] },
      ]}
    >
      <Animated.View
        style={[
          styles.greetingContainer,
          { transform: [{ translateX: titleTextAnim }] },
        ]}
      >
        {actionType === "login" ? (
          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Olá,</Text>
            <Text style={styles.headingText}>Bem Vindo</Text>
            <Text style={styles.headingText}>de volta</Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Vamos,</Text>
            <Text style={styles.headingText}>Começar</Text>
          </View>
        )}
      </Animated.View>
      <View style={styles.formContainer}>
        {renderForm()}
        <Text style={styles.continueText}>or continue with</Text>
        <View style={styles.socialButtonContainer}>
          <TouchableOpacity
            style={styles.googleButtonContainer}
            onPress={() => handleLogin("google")}
          >
            <Image source={AppImages.google} style={styles.socialImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.googleButtonContainer}
            onPress={() => handleLogin("github")}
          >
            <Image source={AppImages.github} style={styles.socialImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          {actionType === "login" ? (
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.accountText}>Não tem uma conta? Sign up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => animateSlideTransition("login", "right")}>
              <Text style={styles.accountText}>Já tem uma conta? Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default LoginScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 50,
      bottom: 0,
      padding: 20,
    },
    greetingContainer: {
      marginTop: 30,
      minHeight: 230,
    },
    textContainer: {
      marginVertical: 20,
    },
    headingText: {
      fontSize: 32,
      color: theme.blue,
      fontFamily: fonts.SemiBold,
    },
    formContainer: {
      marginTop: 20,
      flex: 1,
    },
    formContainerInner: {
      minHeight: 250,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: theme.blue,
      borderRadius: 100,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      padding: 2,
      marginVertical: 10,
    },
    textInput: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: fonts.Light,
      color: theme.blue,
    },
    forgotPasswordText: {
      textAlign: "right",
      color: theme.blue,
      fontFamily: fonts.SemiBold,
      marginVertical: 10,
    },
    loginButtonWrapper: {
      minHeight: 45,
      backgroundColor: theme.blue,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      marginTop: 20,
    },
    disabledButton: {
      backgroundColor: "#a9a9a9", // Um cinza para o botão desabilitado
    },
    loginText: {
      color: theme.background,
      fontSize: 20,
      fontFamily: fonts.SemiBold,
      textAlign: "center",
      padding: 10,
    },
    continueText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: 14,
      fontFamily: fonts.Regular,
      color: theme.blue,
    },
    googleButtonContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.blue,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      gap: 10,
    },
    socialImage: {
      height: 30,
      width: 30,
    },
    socialButtonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    footerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
      gap: 5,
    },
    accountText: {
      color: theme.blue,
      fontFamily: fonts.Regular,
    },
  });