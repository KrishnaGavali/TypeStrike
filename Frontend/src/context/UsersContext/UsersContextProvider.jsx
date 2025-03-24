import React, { useState } from "react";
import UsersContext from "./UsersContext";
import PropTypes from "prop-types";

const UsersContextProvider = ({ children }) => {
  const [users, setUsers] = useState({});

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

UsersContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UsersContextProvider;
