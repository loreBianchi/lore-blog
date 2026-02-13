interface CanvasLoaderProps {
  message?: string;
}

export default function CanvasLoader({ message = "Loading Canvas 🖼️" }: CanvasLoaderProps) {
  return (
    <div className="h-[480px] w-full rounded-3xl bg-black/5 flex flex-col items-center justify-center">
        <p className="text-xl text-indigo-400 font-medium mb-2">
          {message}
        </p>
        <div className="flex mt-2 space-x-1">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
        </div>
    </div>
  );
}