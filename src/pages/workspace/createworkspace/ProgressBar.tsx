export default function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="relative flex items-center justify-between mb-12 px-2" style={{ minHeight: 56 }}>
      {/* الخط الأفقي */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-purple-100 z-0" style={{ height: 4 }} />
      {[...Array(totalSteps)].map((_, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;
        return (
          <div key={step} className="relative z-10 flex flex-col items-center w-1/3">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-base font-semibold transition-all duration-300
                ${isActive ? "bg-purple-600 border-purple-600 text-white" :
                  isCompleted ? "bg-purple-200 border-purple-200 text-purple-600" :
                  "bg-white border-purple-200 text-purple-400"}
              `}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
}
