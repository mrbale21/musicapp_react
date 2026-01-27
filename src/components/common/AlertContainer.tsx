// components/common/AlertContainer.tsx
import React from "react";
import { useAlert } from "../../context/AlertContext";
import AlertItem from "./AlertItem";

const AlertContainer: React.FC = () => {
  const { alerts } = useAlert();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertContainer;
