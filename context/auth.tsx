import {
  FirebaseAuthTypes,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  User as GoogleUser,
  isErrorWithCode,
  SignInResponse,
  SignInSilentlyResponse,
} from '@react-native-google-signin/google-signin';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
];

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes,
});

const auth = getAuth();

function useProvideAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const [authToken, setAuthToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const hasCalendarPermission = useMemo(
    () => !!googleUser?.scopes.filter((scope) => scope.includes('calendar')),
    [googleUser]
  );

  const trySignInWithGoogle = async (silent = false) => {
    let result: SignInResponse | SignInSilentlyResponse;
    if (silent) {
      result = await GoogleSignin.signInSilently();
    } else {
      await GoogleSignin.hasPlayServices();
      result = await GoogleSignin.signIn();
    }

    if (result.type !== 'success') {
      throw new Error(
        silent ? 'No saved credentials found' : 'Google Sign-In was cancelled by the user'
      );
    }

    const { idToken, accessToken } = await GoogleSignin.getTokens();
    if (!idToken || !accessToken) {
      throw new Error('Failed to get tokens from Google Sign-In');
    }

    setGoogleUser(result.data);
    setAuthToken(accessToken);

    return GoogleAuthProvider.credential(idToken);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setGoogleUser(null);
        setAuthToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function rehydrate() {
      try {
        const credential = await trySignInWithGoogle(true);
        await signInWithCredential(auth, credential);
      } catch (error) {
        console.error('Error rehydrating auth state:', error);
        setGoogleUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }

    rehydrate();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const credential = await trySignInWithGoogle();
      await signInWithCredential(auth, credential);
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.error('Google Sign-In Error:', error.code, error.message);
      } else {
        console.error('Unexpected Error during Google Sign-In:', error);
      }
    }
  };

  const signOut = async () => {
    await GoogleSignin.signOut();
    await firebaseSignOut(auth);
  };

  const refreshAccessToken = async () => {
    await trySignInWithGoogle(true);
    return authToken as string;
  };

  return {
    firebaseUser,
    googleUser,
    accessToken: authToken,
    hasCalendarPermission,
    loading,
    signInWithGoogle,
    signOut,
    refreshAccessToken,
  };
}

type AuthContextType = ReturnType<typeof useProvideAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const value = useProvideAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
