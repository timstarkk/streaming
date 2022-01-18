import React, { useState } from 'react';
const AuthContext = React.createContext({})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('');

    const setCurrentUser = userInfo => {
        setUser(userInfo);
    };

    return (
        <AuthContext.Provider value={{
            user, 
            setCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }