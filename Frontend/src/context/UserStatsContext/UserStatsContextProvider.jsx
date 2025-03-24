import React from "react";
import UserStatsContext from "./UserStatsContext";
import PropTypes from "prop-types";

const UserStatsContextProvider = ({ children }) => {
  const [userStats, setUserStats] = React.useState({
    typedWords: 1,
    typedLetters: 1,
    correctLetters: 1,
    wrongLetters: 1,
  });

  return (
    <UserStatsContext.Provider value={{ userStats, setUserStats }}>
      {children}
    </UserStatsContext.Provider>
  );
};

UserStatsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserStatsContextProvider;
