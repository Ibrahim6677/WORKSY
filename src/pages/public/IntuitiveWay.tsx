import Iconsax from "../../assets/images/Iconsax.svg";
import Clipboard from "../../assets/images/clipboardtext.svg";
import Gallery from "../../assets/images/gallery.svg";
import DocumentText from "../../assets/images/documenttext.svg";
import DocumentCode from "../../assets/images/documentcode.svg";

const fileList = [
  { name: "i9.pdf", type: "PDF", size: "9mb", icon: Clipboard },
  { name: "Screenshot 3401.png", type: "PNG", size: "2.1mb", icon: Gallery },
  { name: "graph.docx", type: "DOCX", size: "1.4mb", icon: DocumentText },
  { name: "Jerry-10.22_UI-Form.excl", type: "XLSX", size: "3.6mb", icon: DocumentCode },
];

const IntuitiveWay = () => {
  return (
    <div className="max-w-[1380px] mx-auto lg:pl-18 px-4 relative lg:h-[800px] bg-white py-20 lg:py-30 overflow-hidden">
      {/* SVG blob background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="702"
          height="638"
          viewBox="0 0 702 698"
          fill="none"
          className="absolute -left-5 top-80 -translate-y-1/2 z-0 hidden lg:block max-w-none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M459.579 19.8458C542.749 48.4193 615.723 101.589 657.109 179.168C701.342 262.084 714.203 358.228 688.272 448.536C660.033 546.88 607.199 648.263 511.786 685.267C418.985 721.257 320.767 668.369 230.681 626.003C150.075 588.096 72.6149 540.79 33.962 460.556C-5.57935 378.478 -10.5628 281.955 24.4164 197.85C58.398 116.143 132.347 60.5369 214.267 27.0276C292.97 -5.16598 379.147 -7.78714 459.579 19.8458Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="470.48"
              y1="23.7514"
              x2="239.008"
              y2="636.722"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.2" stopColor="#917CBA" />
              <stop offset="0.89" stopColor="#413854" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-16">
        {/* File List Box */}
        <div className="bg-white shadow-lg rounded-xl z-10 p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-black">Files</h2>
            <span className="bg-[#6629DE] text-white text-xs font-medium px-2 py-1 rounded-full">125</span>
          </div>
          <ul className="flex flex-col gap-4 pb-6">
            {fileList.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between px-3 py-2 border border-gray-100 rounded-md hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <img src={file.icon} alt="file-icon" className="w-5 h-5" />
                  <div>
                    <h3 className="text-sm font-semibold text-black">{file.name}</h3>
                    <p className="text-xs text-gray-500">
                      {file.type} {file.size}
                    </p>
                  </div>
                </div>
                <img src={Iconsax} alt="options" className="w-4 h-4" />
              </li>
            ))}
          </ul>
        </div>

        {/* Text + CTA */}
        <div className="w-full max-w-xl text-center lg:text-left">
          <h2 className="text-[32px] font-bold text-black mb-4 leading-tight">
            <span className="text-[#6629DE]">manage</span> files in intuitive way
          </h2>
          <p className="text-lg text-black leading-relaxed w-full max-w-md mx-auto lg:mx-0">
            <span className="text-[#6629DE] font-medium">
              Share Anything, Find Everything, Instantly
            </span>{" "}
            — Drag, Drop, And Access All Your Files In One Place. No More Hunting Through Email Attachments Or Outdated Versions.
          </p>
          <button className="mt-6 bg-[#6629DE] text-white text-sm lg:text-center font-medium px-30 py-2 rounded-2xl hover:bg-[#4e23b4] transition">
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntuitiveWay;
