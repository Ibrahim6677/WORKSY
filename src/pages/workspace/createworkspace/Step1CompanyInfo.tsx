export default function Step1CompanyInfo({ nextStep }: { nextStep: () => void }) {
  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">what is your company name or team?<span className='font-normal'></span></h3>
      <p className="text-gray-500 mb-6 text-sm">
        this will be the name of your workspace chose<br />
        something your team will recognize
      </p>
      <div className="relative w-full mb-8">
        <input
          type="text"
          placeholder="EX:Acme Marketing Team"
          maxLength={50}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">50</span>
      </div>
      <button
        onClick={nextStep}
        className="bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 transition text-sm font-semibold"
      >
        next  
      </button>
    </div>
  );
}
