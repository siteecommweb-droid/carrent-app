type LoaderProps = {
  label?: string;
};

type ErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function PageLoader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
      <p className="text-sm text-white/70">{label}</p>
    </div>
  );
}

export function PageError({
  message = "Something went wrong.",
  onRetry,
}: ErrorProps) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-red-300">Error</h3>
      <p className="mt-2 text-sm text-red-200/90">{message}</p>

      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}








