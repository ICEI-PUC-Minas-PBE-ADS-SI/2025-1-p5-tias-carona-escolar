import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { lightTheme, Theme } from "@/src/constants/theme";
import { fonts } from "@/src/constants/fonts";
import { AppImages } from "@/src/assets";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
// --- MODIFICAÇÃO: A interface de credenciais agora inclui um objeto de endereço
import { ICreadentials, IAddress } from "@/src/interfaces/credentials.interface";
import { getAccessToken } from "@/src/services/auth.service";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

// --- MODIFICAÇÃO: Adicionado o novo passo 'register-step-3'
type ActionType =
  | "login"
  | "register-step-1"
  | "register-step-2"
  | "register-step-3" // Novo passo
  | "password-recovery";

// --- MODIFICAÇÃO: O InputField agora aceita 'value' e 'editable' para campos controlados
const InputField: React.FC<{
  iconName: string;
  iconLibrary: "Ionicons" | "SimpleLineIcons";
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  theme: Theme;
  value?: string; // Adicionado
  editable?: boolean; // Adicionado
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
      value={value} // Adicionado
      editable={editable} // Adicionado
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
    username: "",
    password: "",
    // --- MODIFICAÇÃO: Inicializa o estado do endereço
    address: {
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });
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
    });

  // --- NOVO: Hook para buscar o CEP quando ele for alterado e tiver 8 dígitos
  useEffect(() => {
    const fetchAddress = async () => {
      if (credentials.address?.cep?.replace(/\D/g, "").length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${credentials.address.cep}/json/`
          );
          const data = await response.json();
          if (!data.erro) {
            setCredentials((prev) => ({
              ...prev,
              address: {
                ...prev.address!,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
              },
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    };
    fetchAddress();
  }, [credentials.address?.cep]);

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
    (key: keyof Omit<ICreadentials, 'address'>, value: string) => {
      setCredentials((prev) => ({ ...prev, [key]: value }));
    },
    [setCredentials]
  );

  // --- NOVO: Handler para atualizar os campos de endereço
  const handleAddressChange = useCallback(
    (key: keyof IAddress, value: string) => {
      setCredentials((prev) => ({
        ...prev,
        address: { ...prev.address!, [key]: value },
      }));
    },
    [setCredentials]
  );

  // --- MODIFICAÇÃO: Atualizada a lógica de navegação para incluir o step 3
  const handleSignup = useCallback(() => {
    if (actionType === "login") {
      return animateSlideTransition("register-step-1", "left");
    }
    if (actionType === "register-step-1") {
      return animateSlideTransition("register-step-2", "left");
    }
    if (actionType === "register-step-2") {
      return animateSlideTransition("register-step-3", "left"); // Vai para o passo 3
    }
    if (actionType === "register-step-3") {
      // Finaliza o cadastro
      console.log("Dados finais do cadastro:", credentials);
      return router.push("/home");
    }
  }, [actionType, animateSlideTransition, credentials, router]);

  const handleLogin = useCallback(
    (type: "local" | "github" | "google") => {
      if (type === "local") {
        getAccessToken(credentials)
          .then((tokens) => {
            console.log("Login com sucesso", tokens);
            router.replace("/home");
          })
          .catch((error) => {
            console.error("Erro no login:", error);
          });
        return;
      }
      animateSlideTransition("login", "left");
      router.push(`/social-auth/${type}`);
    },
    [credentials, animateSlideTransition]
  );

  // --- MODIFICAÇÃO: Atualizada a lógica de "voltar"
  const handleGoBack = useCallback(() => {
    if (
      actionType === "register-step-1" ||
      actionType === "password-recovery"
    ) {
      animateSlideTransition("login", "right");
    } else if (actionType === "register-step-2") {
      animateSlideTransition("register-step-1", "right");
    } else if (actionType === "register-step-3") {
      animateSlideTransition("register-step-2", "right"); // Volta do passo 3 para o 2
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
            placeholder="Seu nome"
            theme={theme}
            styles={styles}
          />
          <InputField
            iconName="person-outline"
            iconLibrary="Ionicons"
            placeholder="Seu nome de usuario"
            theme={theme}
            styles={styles}
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
            onChangeText={(text) => handleTextChange("username", text)}
            styles={styles}
          />
          <InputField
            iconName="lock"
            iconLibrary="SimpleLineIcons"
            placeholder="Sua senha"
            secureTextEntry={secureEntry}
            theme={theme}
            styles={styles}
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
      {/* --- NOVO: Formulário para a etapa 3 (Endereço) --- */}
      {actionType === "register-step-3" && (
        <>
          <InputField
            iconName="map-outline"
            iconLibrary="Ionicons"
            placeholder="CEP"
            keyboardType="numeric"
            theme={theme}
            styles={styles}
            value={credentials.address?.cep}
            onChangeText={(text) => handleAddressChange("cep", text)}
          />
          <InputField
            iconName="location-outline"
            iconLibrary="Ionicons"
            placeholder="Rua"
            theme={theme}
            styles={styles}
            value={credentials.address?.street}
            onChangeText={(text) => handleAddressChange("street", text)}
            editable={false} // Desabilita edição
          />
           <InputField
            iconName="location-outline"
            iconLibrary="Ionicons"
            placeholder="Bairro"
            theme={theme}
            styles={styles}
            value={credentials.address?.neighborhood}
            onChangeText={(text) => handleAddressChange("neighborhood", text)}
            editable={false} // Desabilita edição
          />
          <InputField
            iconName="business-outline"
            iconLibrary="Ionicons"
            placeholder="Cidade"
            theme={theme}
            styles={styles}
            value={credentials.address?.city}
            onChangeText={(text) => handleAddressChange("city", text)}
            editable={false} // Desabilita edição
          />
          <InputField
            iconName="flag-outline"
            iconLibrary="Ionicons"
            placeholder="Estado"
            theme={theme}
            styles={styles}
            value={credentials.address?.state}
            onChangeText={(text) => handleAddressChange("state", text)}
            editable={false} // Desabilita edição
          />
          <InputField
            iconName="home-outline"
            iconLibrary="Ionicons"
            placeholder="Número"
            keyboardType="numeric"
            theme={theme}
            styles={styles}
            value={credentials.address?.number}
            onChangeText={(text) => handleAddressChange("number", text)}
          />
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.forgotPasswordText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Sign Up</Text>
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
            onChangeText={(text) => handleTextChange("username", text)}
            styles={styles}
          />
          <InputField
            iconName="lock"
            iconLibrary="SimpleLineIcons"
            placeholder="Sua senha"
            secureTextEntry={secureEntry}
            theme={theme}
            styles={styles}
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
              <Text style={styles.accountText}>Ja tem uma conta? Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default LoginScreen;

// Os estilos permanecem os mesmos
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
      color: theme.blue, // Adicionado para melhor visualização do texto
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