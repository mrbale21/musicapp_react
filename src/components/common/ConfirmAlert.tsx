import React from "react";
import { X, AlertCircle, LogOut } from "lucide-react";

interface ConfirmAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm">
        {/* Animated linear background */}
        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>

        {/* Main modal */}
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/30 overflow-hidden">
          {/* Animated linear line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500"></div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-50"></div>
                  <div className="relative p-2 bg-linear-to-r from-purple-600 to-pink-500 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </button>
            </div>

            {/* Message with linear border */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 to-pink-500/20 rounded-xl blur"></div>
              <p className="relative text-gray-200 p-3 text-center">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all duration-200 active:scale-[0.98] border border-gray-700 hover:border-purple-500/30"
              >
                Batal
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 relative overflow-hidden group py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {/* Animated linear background */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-purple-400 to-pink-400 blur-xl transition-opacity duration-300"></div>

                {/* Button content */}
                <div className="relative flex items-center justify-center gap-2 text-white font-semibold">
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
