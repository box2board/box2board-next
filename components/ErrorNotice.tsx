type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorNotice({ message, onRetry }: Props) {
  return (
    <div className="error-box">
      <p className="font-semibold">Unable to load data</p>
      <p className="text-gray-300">{message}</p>
      {onRetry ? (
        <button className="button" onClick={onRetry} type="button">
          Retry
        </button>
      ) : null}
    </div>
  );
}
