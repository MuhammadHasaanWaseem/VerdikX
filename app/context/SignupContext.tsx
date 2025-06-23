import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SignupData {
  email: string;
  password: string;
  username: string;
  game_uid: string;
  user_level: number | null;
  playstyle: string;
  avatar?: string;
}

interface SignupContextType {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
}

const defaultSignupData: SignupData = {
  email: '',
  password: '',
  username: '',
  game_uid: '',
  user_level: null,
  playstyle: '',
  avatar: '',
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export default SignupProvider;
