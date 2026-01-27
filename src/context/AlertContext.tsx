// context/AlertContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import AlertContainer from "../components/common/AlertContainer";

export type AlertType = "success" | "error" | "info" | "warning";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (
    type: AlertType,
    title: string,
    message: string,
    duration?: number
  ) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert: Alert = { id, type, title, message, duration };

    setAlerts((prev) => [...prev, newAlert]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};
