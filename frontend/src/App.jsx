import React from "react";
import AppRouter from "./routes/AppRouter.jsx";
import Toast from "./components/common/Toast.jsx";
import { useApp } from "./context/AppContext.jsx";

const App = () => {
  const { toast } = useApp();
  return (
    <>
      <AppRouter />
      <Toast toast={toast} />
    </>
  );
};

export default App;

