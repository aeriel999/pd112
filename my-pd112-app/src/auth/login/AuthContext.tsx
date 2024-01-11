import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUser } from '../type.ts'; // Adjust the import path as needed

interface UserContextProps {
    user: IUser | null;
    loginUser: (userData: IUser) => void;
    logoutUser: () => void;
}

interface UserProviderProps {
    children: ReactNode;
}

const defaultUserContext: UserContextProps = {
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
};

const UserContext = createContext<UserContextProps>(defaultUserContext);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const loginUser = (userData: IUser) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
