import { useRouterState } from "@tanstack/react-router";

function Spinner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-100 overflow-hidden">
        <div className="h-full bg-blue-700 animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>
      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return <>{isLoading && <Spinner />}</>;
}
