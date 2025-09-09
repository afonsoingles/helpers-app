import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unregisterPushDevice } from "./NotificationsManager";
import axios from "axios";

async function signIn(email, password) {
  try {
    const response = await axios
      .post(`${API_URL}/v2/accounts/login`, {
        email: email,
        password: password,
      })
      .catch((error) => {
        const response = error.response;
        return response;
      });

    if (response.status === 200) {
      AsyncStorage.setItem("isLoggedIn", "true");
      AsyncStorage.setItem("authToken", response.data.token);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("[signIn] Unable to login: ", error.message);
    throw error;
  }
}

async function logOff() {
  try {
    await unregisterPushDevice();
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error("[signIn] Unable to logoff: ", error.message);
    throw error;
  }
}

async function signUp(name, username, email, password) {
  try {
    const response = await axios
      .post(`${API_URL}/v2/accounts/signup`, {
        name: name,
        username: username,
        email: email,
        password: password,
      })
      .catch((error) => {
        const response = error.response;
        return response;
      });

    if (response.status === 201) {
      await signIn(email, password);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("[signUp] Unable to register: ", error.message);
    throw error;
  }
}

async function DeleteAccount(password) {
  try {
    const authToken = await AsyncStorage.getItem("authToken");
    const response = await axios
      .delete(`${API_URL}/v2/accounts/delete`, {
        data: {
          password: password,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .catch((error) => {
        const response = error.response;
        return response;
      });

    if (response.status === 200) {
      logOff();
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(
      "[Delete Account] Unable to delete the account: ",
      error.message
    );
    throw error;
  }
}

async function getAccountData() {
  try {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("User is not authenticated");
    }
    const response = await axios
      .get(`${API_URL}/v2/accounts/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .catch((error) => {
        const response = error.response;
        return response;
      });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

async function proccessAuthState(navigation) {
  const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  console.log("[authState] Checking authentication state:", isLoggedIn);
  if (isLoggedIn === "true") {
    try {
      const accountData = await getAccountData();
      const authToken = await AsyncStorage.getItem("authToken");
      const deviceID = await AsyncStorage.getItem("deviceID");
      if (accountData.status === "suspended") {
        console.log("suspended!")
        navigation.navigate("AuthRoutes", {
          screen: "Suspended",
          params: { accountData },
        });
        await axios.post(`${API_URL}/v2/notifications/devices/${deviceID}/checkIn`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        return;
      }
      navigation.navigate("MainRoutes", { screen: "Home" });
    } catch (error) {
      console.error("[authSate] Error getting account data:", error);
      AsyncStorage.removeItem("isLoggedIn");
      AsyncStorage.removeItem("authToken");
      navigation.navigate("AuthRoutes", { screen: "Login" });
    }
  } else {
    console.log("[authState] User is not logged in");
    navigation.navigate("MainRoutes", { screen: "Setup" });
  }
}

export {
  signIn,
  getAccountData,
  proccessAuthState,
  signUp,
  logOff,
  DeleteAccount,
};
