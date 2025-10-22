import AnimatedDots from "../loaders/AnimatedDots";
import AnimatedSpinner from "../loaders/AnimatedSpinner";

/**
 * Loading screen component shown while backend is starting up
 */

const BackendLoadingScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="w-full max-w-2xl z-10 bg-slate-950 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/60">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            ⚡ AI-Powered Healthcare Test Case Generator ⚡
          </h1>

          <div className="flex flex-col items-center space-y-4">
            <AnimatedSpinner />

            <div className="space-y-2">
              <p className="text-l text-neutral-300">
                Waiting for backend to be ready...
              </p>
              <p className="text-xs text-neutral-400">
                This may take a moment on first startup
              </p>
            </div>

            <AnimatedDots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendLoadingScreen;
