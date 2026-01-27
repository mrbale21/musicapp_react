// components/common/AlertItem.tsx
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  X,
  Music,
  Volume2,
  Heart,
  ThumbsUp,
} from "lucide-react";
import { useAlert, type Alert } from "../../context/AlertContext";

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const { removeAlert } = useAlert();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (alert.duration && alert.duration > 0) {
      const interval = 50;
      const totalSteps = alert.duration / interval;
      const decrement = 100 / totalSteps;

      const timer = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - decrement));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [alert.duration]);

  const getAlertConfig = () => {
    switch (alert.type) {
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bg: "bg-linear-to-r from-emerald-500/20 to-green-500/10",
          border: "border-l-4 border-emerald-500",
          text: "text-emerald-100",
          iconColor: "text-emerald-400",
          progressColor: "bg-emerald-500",
          iconBg: "bg-emerald-500/20",
          accentIcon: <ThumbsUp className="w-4 h-4 text-emerald-300" />,
        };
      case "error":
        return {
          icon: <XCircle className="w-5 h-5" />,
          bg: "bg-linear-to-r from-rose-500/20 to-red-500/10",
          border: "border-l-4 border-rose-500",
          text: "text-rose-100",
          iconColor: "text-rose-400",
          progressColor: "bg-rose-500",
          iconBg: "bg-rose-500/20",
          accentIcon: <Volume2 className="w-4 h-4 text-rose-300" />,
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bg: "bg-linear-to-r from-amber-500/20 to-yellow-500/10",
          border: "border-l-4 border-amber-500",
          text: "text-amber-100",
          iconColor: "text-amber-400",
          progressColor: "bg-amber-500",
          iconBg: "bg-amber-500/20",
          accentIcon: <Music className="w-4 h-4 text-amber-300" />,
        };
      case "info":
        return {
          icon: <Info className="w-5 h-5" />,
          bg: "bg-linear-to-r from-blue-500/20 to-cyan-500/10",
          border: "border-l-4 border-blue-500",
          text: "text-blue-100",
          iconColor: "text-blue-400",
          progressColor: "bg-blue-500",
          iconBg: "bg-blue-500/20",
          accentIcon: <Heart className="w-4 h-4 text-blue-300" />,
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-lg
        ${config.bg} ${config.border} ${config.text}
        shadow-2xl shadow-black/30
        transform transition-all duration-300
        hover:scale-[1.02] hover:shadow-black/40
        animate-slideIn
      `}
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {/* Progress bar */}
      {alert.duration && alert.duration > 0 && (
        <div className="absolute top-0 left-0 w-full h-1">
          <div
            className={`h-full ${config.progressColor} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon container dengan glow effect */}
          <div
            className={`
            relative shrink-0
            ${config.iconBg} 
            rounded-lg p-2
            ring-1 ring-white/10
          `}
          >
            {config.icon}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-lg" />

            {/* Small accent icon */}
            <div className="absolute -top-1 -right-1">{config.accentIcon}</div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm tracking-wide">
                {alert.title}
              </h3>
              <button
                onClick={() => removeAlert(alert.id)}
                className={`
                  shrink-0 
                  ${config.iconColor}
                  hover:text-white
                  transition-colors duration-200
                  p-1 rounded-lg hover:bg-white/5
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>

        {/* Bottom wave decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-20">
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent"
            style={{
              backgroundSize: "200% 100%",
              animation: "wave 2s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
