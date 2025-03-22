import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: true,
  error: null,
  initialized: false
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        initialized: true
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        initialized: true
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    default:
      return state;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;
    let unsubscribe;

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (mounted) {
            dispatch({ type: 'AUTH_STATE_CHANGED', payload: user });
          }
        },
        (error) => {
          if (mounted) {
            console.error('Auth state change error:', error);
            dispatch({ type: 'AUTH_ERROR', payload: error });
          }
        }
      );
    } catch (error) {
      if (mounted) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_ERROR', payload: error });
      }
    }

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      dispatch({ type: 'LOADING' });
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error });
      throw error;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'LOADING' });
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error });
      throw error;
    }
  };

  const value = useMemo(() => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    signInWithGoogle,
    logout
  }), [state.user, state.loading, state.error, state.initialized]);

  if (!state.initialized) {
    return (
      <div className="loading-container">
        <div className="loading-message">
          <h3>Initializing...</h3>
          <p>Please wait while we set up the application.</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="loading-container">
        <div className="loading-message error">
          <h3>Error</h3>
          <p>{state.error.message}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 