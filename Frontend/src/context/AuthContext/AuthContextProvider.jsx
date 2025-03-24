import React from "react";
import AuthContext from "./AuthContext";
import PropTypes from "prop-types";

const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    userId: "",
  });

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContextProvider;
