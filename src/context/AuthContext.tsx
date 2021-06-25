
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";
//ReacNode is to pass a type to a React COmponent passed as props childen

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  }


type AuthContextProviderProps = {
    children: ReactNode;
}

//just the format here
export const AuthContext = createContext({} as AuthContextType);


export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
      // Everytime you subscribe to an Event Listener you must deal with the unsubscribe!
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const {displayName, photoURL, uid} = user;
  
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })   
        }
      })
  
      return () => {
        unsubscribe();
      }
    }, [])
  
    async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider);
  
      if (result.user) {
        const {displayName, photoURL, uid} = result.user;
  
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }        
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>

    );
};