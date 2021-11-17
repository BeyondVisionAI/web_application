import React, { useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  async function forceRefresh() {
    try {
        var res = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_API_URL}/me`,
        })
        setCurrentUser(res.data)
        setPending(false)
    } catch (err) {
        setPending(false)
    }
  }

  useEffect(() => {
      forceRefresh()
  }, []);

  if(pending){
    return <h1>Loading...</h1>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        refreshUser: forceRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};