import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";
import OtpVerificationModal from "../components/OtpVerificationModal";
import { toast } from "sonner";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otpModalState, setOtpModalState] = useState({
    isOpen: false,
    email: "",
    deviceHash: "",
    pendingUser: null,
  });

  const login = (userdata) => {
    setUser(userdata);
    try {
      localStorage.setItem("user", JSON.stringify(userdata));
    } catch (e) {}
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
      await signOut(auth);
    } catch (error) {
      console.log("Sign out status:", error?.message || error);
    }
  };

  // Hydrate user from localStorage on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const processUserSecurityCheck = async (firebaseuser) => {
    const payload = {
      email: firebaseuser.email,
      name: firebaseuser.displayName,
      image: firebaseuser.photoURL || "https://github.com/shadcn.png",
    };
    const response = await axiosInstance.post("/user/login", payload);
    const loggedUser = response.data.result;

    try {
      const devCheck = await axiosInstance.post("/security/device-check", {
        email: loggedUser.email,
        deviceIdentifier: typeof navigator !== "undefined" ? navigator.userAgent : "web-browser",
        locationInfo: { city: "New Delhi", state: "Delhi" },
      });

      if (devCheck.data?.requireOtp) {
        setOtpModalState({
          isOpen: true,
          email: loggedUser.email,
          deviceHash: devCheck.data.deviceHash,
          pendingUser: loggedUser,
        });
        if (devCheck.data.debugOtp) {
          toast.info(`[Security OTP Code]: ${devCheck.data.debugOtp}`, { duration: 10000 });
        }
        return;
      }
    } catch (secErr) {
      console.log("Device security notice:", secErr?.message);
    }

    login(loggedUser);
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        await processUserSecurityCheck(result.user);
      }
    } catch (error) {
      const errStr = String(error?.code || error?.message || error || "");
      if (
        errStr.includes("popup-closed-by-user") ||
        errStr.includes("cancelled-popup-request") ||
        errStr.includes("popup-blocked")
      ) {
        // User intentionally closed popup or browser blocked it
        console.log("Popup cancelled or blocked");
        return;
      }
      console.log("Sign in status:", error?.message || error);
      // Fallback to guest login if popup environment issue
      toast.info("Signing in with Demo Account for testing...");
      await loginAsGuest();
    }
  };

  const loginAsGuest = async () => {
    try {
      const demoUser = {
        email: "demo.student@yourtube.com",
        displayName: "Student Demo Account",
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=StudentDemo",
      };
      await processUserSecurityCheck(demoUser);
    } catch (err) {
      console.log("Guest sign-in error:", err);
    }
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
      if (firebaseuser) {
        try {
          await processUserSecurityCheck(firebaseuser);
        } catch (error) {
          const errStr = String(error?.code || error?.message || error || "");
          if (!errStr.includes("popup-closed-by-user")) {
            console.log("Auth session notice:", error?.message || error);
          }
        }
      }
    });
    return () => unsubcribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin, loginAsGuest }}>
      {children}
      <OtpVerificationModal
        isOpen={otpModalState.isOpen}
        onClose={() => setOtpModalState((prev) => ({ ...prev, isOpen: false }))}
        email={otpModalState.email}
        deviceHash={otpModalState.deviceHash}
        onSuccess={(verifiedUser) => {
          login(verifiedUser || otpModalState.pendingUser);
          setOtpModalState({ isOpen: false, email: "", deviceHash: "", pendingUser: null });
        }}
      />
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
