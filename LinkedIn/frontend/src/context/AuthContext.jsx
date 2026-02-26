import React, { createContext } from "react"

export const authDataContext = createContext()

function AuthContext({ children }) {
  const serverUrl = "https://linkedinnew-backend.onrender.com"

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  )
}

export default AuthContext
