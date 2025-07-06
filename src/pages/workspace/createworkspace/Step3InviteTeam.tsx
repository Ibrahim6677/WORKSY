import {BottomLink} from "../../../components/atoms/Bottom/BottomLink";

export default function Step3InviteTeam({ prevStep }: { prevStep: () => void }) {
  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">invite your team</h3>
      <div className="flex items-center gap-2 mb-6 mt-2">
        <span className="text-xs text-gray-500">EX.Sara@gmail.com</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-500 cursor-pointer"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-4-4m4 4l-4 4" /></svg>Add From Google</span>
      </div>
      <textarea
        placeholder="EX.Sara@gmail.com"
        rows={4}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 resize-none"
      />
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={prevStep}
          className="border px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          back
        </button>
        <BottomLink
          to="/workspace"
          variant="filled"
          className="bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 transition text-sm font-semibold"
        >
          next
        </BottomLink>
        <button className="ml-2 text-gray-500 text-sm hover:underline bg-transparent border-none shadow-none">skip this step</button>
        <button className="ml-auto flex items-center gap-1 border border-purple-200 text-purple-700 px-3 py-1 rounded text-xs"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" /></svg>copy link invite</button>
      </div>
    </div>
  );
}
