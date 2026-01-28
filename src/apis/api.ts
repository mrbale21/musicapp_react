import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

type FetcherParams<T, P> = {
  api: ({ ...props }: T) => Promise<P | null>;
  onSuccess?: ({ ...data }: Awaited<P> | null, { ...props }: T) => void;
  onFail?: (e: unknown, { ...data }: T) => void;
  initial?: P | null;
};

type ProcessParams = {
  reset: boolean;
  remember: boolean;
  concat: boolean | string;
};

const useApi = <T, P>({
  api,
  onSuccess = () => {},
  onFail = () => {},
  initial,
}: FetcherParams<T, P>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initial);
  const [savedProps, setSavedProps] = useState<T>();

  const withoutReset = (init: ProcessParams) => {
    return (before: ProcessParams = init) => {
      before.reset = false;
      const getProcess = process(before);

      return {
        process: getProcess.process,
        remember: remember(before),
        concat: concat(before),
      };
    };
  };

  const concat = (init: ProcessParams) => {
    return (
      keyToConcat: keyof P | null = null,
      before: ProcessParams = init
    ) => {
      before.concat = keyToConcat ? (keyToConcat as string) : "";
      const getProcess = process(before);

      return {
        process: getProcess.process,
        withoutReset: withoutReset(before),
        remember: remember(before),
      };
    };
  };

  const remember = (init: ProcessParams) => {
    return (before: ProcessParams = init) => {
      before.remember = true;
      const getProcess = process(before);

      return {
        process: getProcess.process,
        withoutReset: withoutReset(before),
        concat: concat(before),
      };
    };
  };

  const process = ({ reset, remember, concat }: ProcessParams) => {
    return {
      process: (...props: Parameters<typeof api>): Promise<void> =>
        new Promise((resolve, reject) => {
          (async () => {
            if (reset) {
              setData(null);
            }
            if (remember) {
              setSavedProps(...props);
            }
            setIsLoading(true);
            try {
              const data = await api(...props);
              setData((value) => {
                if (concat && value) {
                  if (
                    value[concat as keyof P] &&
                    Array.isArray(value[concat as keyof P])
                  ) {
                    return {
                      ...value,
                      [concat as keyof P]: (
                        value[concat as keyof P] as Array<unknown>
                      ).concat(data![concat as keyof P]),
                    };
                  }
                } else if (typeof concat === "string" && value) {
                  if (Array.isArray(value)) {
                    return value.concat(data) as P;
                  }
                }

                return data;
              });
              onSuccess(data, ...props);
            } catch (e) {
              setIsLoading(false);
              const error = e as AxiosError;
              const status = error.response?.status;
              const data = error.response?.data as {
                message?: string;
              };
              const msg = data?.message;

              // Handle 401 errors silently (will be handled by interceptor)
              if (status === 401) {
                onFail(e, ...props);
                reject(e);
                // Don't show toast for 401, interceptor will handle redirect
                return;
              }

              // Show error message for other errors
              if (msg && status !== 401) {
                toast.error(`${msg} - (${status ?? 500})`);
              } else if (!msg && status) {
                // Fallback error message
                if (status === 500) {
                  toast.error("Server error. Please try again later.");
                } else if (status === 404) {
                  toast.error("Resource not found.");
                } else if (status >= 400) {
                  toast.error(`Request failed (${status})`);
                }
              }

              onFail(e, ...props);
              reject(e);
              return;
            }

            setIsLoading(false);
            resolve();
          })();
        }),
      params: { reset, remember },
    };
  };

  return {
    data,
    withoutReset: withoutReset({ reset: true, remember: false, concat: false }),
    remember: remember({ reset: true, remember: false, concat: false }),
    concat: concat({ reset: true, remember: false, concat: false }),
    process: process({ remember: false, reset: true, concat: false }).process,
    isLoading,
    savedProps,
  };
};

export default useApi;
