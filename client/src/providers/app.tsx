import React, { useState } from 'react';

export interface AppUser {
  name: string;
}

export type answeredPollData = {
  selectedOptionId: string;
  answeredAt: Date;
};

export type answeredPolls = {
  [pollId: string]: answeredPollData;
};

export interface AppContextType {
  user: AppUser;
  handleAnswerSelection: (
    pollId: string,
    optionId: string,
    timestamp: Date,
  ) => void;
  answeredPolls: answeredPolls;
}

export const AppContext = React.createContext<AppContextType>({
  user: { name: '' },
  handleAnswerSelection: () => undefined,
  answeredPolls: {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(
    JSON.parse(localStorage.getItem('user')),
  );
  const [answeredPolls, setAnsweredPolls] = useState<answeredPolls>(
    JSON.parse(localStorage.getItem('answeredPolls')) || {},
  );

  const handleAnswerSelection = (
    pollId: string,
    optionId: string,
    timestamp: Date,
  ) => {
    const updatedAnsweredPolls = {
      ...answeredPolls,
      [pollId]: {
        selectedOptionId: optionId,
        answeredAt: timestamp,
      },
    };

    localStorage.setItem('answeredPolls', JSON.stringify(updatedAnsweredPolls));

    setAnsweredPolls(updatedAnsweredPolls);
  };

  const value = { user, handleAnswerSelection, answeredPolls };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return React.useContext(AppContext);
}
