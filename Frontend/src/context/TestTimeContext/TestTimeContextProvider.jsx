import React from "react";
import TestTimeContext from "./TestTimeContext";
import PropTypes from "prop-types";

const TestTimeContextProvider = ({ children }) => {
  const [testTime, setTestTime] = React.useState(60);

  return (
    <TestTimeContext.Provider value={{ testTime, setTestTime }}>
      {children}
    </TestTimeContext.Provider>
  );
};

TestTimeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TestTimeContextProvider;
