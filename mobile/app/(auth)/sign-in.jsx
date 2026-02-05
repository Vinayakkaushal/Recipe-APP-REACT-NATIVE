import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from "expo-router"
import React, { useState } from 'react'
import { useSignIn } from "@clerk/clerk-expo"
import {authStyles} from "../../assets/styles/auth.styles.js"
import {Image} from "expo-image"
import { COLORS } from '../../constants/colors.js'
import {Ionicons} from "@expo/vector-icons"
const SignIn = () => {
  const router = useRouter();
  const { signIn: clerkSignIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Sign in failed. Please try again.");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
     <KeyboardAvoidingView style ={authStyles.keyboardView}
      behavior={ Platform.OS==="ios" ? "padding" : "height"}
     > 
      <ScrollView
        contentContainerStyle ={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}> 
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
             />
            <Text style={authStyles.title}> Welcome Back</Text>

            <View style={authStyles.formContainer}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput }
                  placeholder='Enter email'
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChange={setEmail}
                  keyboardType='email-addresss'
                  autoCapitalize="none"
                /> 
              </View>



              <View style={authStyles.inputContainer}>
                <TextInput 
                  style={authStyles.textInput}
                  placeholder='Enter Password'
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChange={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={()=>setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size ={20}
                    color = {COLORS.textLight}
                  >

                  </Ionicons>
                </TouchableOpacity>
              </View>

            </View>

          </View>

      </ScrollView>
     </KeyboardAvoidingView>

    </View>
  );
};

export default SignIn;
