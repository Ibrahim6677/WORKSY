import pdfIcon from "../../../assets/images/files.svg";
import screenshotIcon from "../../../assets/images/gallery.svg";
import docxIcon from "../../../assets/images/documentcode.svg";
import xxlIcon from "../../../assets/images/documenttext.svg";
const files = [
  { name: "I9.pdf", type: "PDF", size: "9mb", date: "TODAY", icon: pdfIcon },
  {
    name: "Screenshot-3817.png",
    type: "PNG",
    size: "4mb",
    date: "May 4",
    icon: screenshotIcon,
  },
  {
    name: "sharefile.docx",
    type: "DOC",
    size: "595kb",
    date: "Jan 12",
    icon: docxIcon,
  },
  {
    name: "Jerry-2020-I-9_Form.xxl",
    type: "XXL",
    size: "24mb",
    date: "Jan 6",
    icon: xxlIcon,
  },
  { name: "I9.pdf", type: "PDF", size: "9mb", date: "TODAY", icon: pdfIcon },
];

export default function MainFiles() {
  return (
    <div className="max-w-full mx-auto p-4">
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select className="border px-4 py-1 rounded text-sm">
          <option>All</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Date</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Type</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Size</option>
        </select>
      </div>

      {/* Files List */}
      <div className="bg-white shadow rounded-md border border-[#A1A1A1] border-b-0">
        <div className="p-4 flex items-center space-x-3">
          <h4 className="font-semibold text-lg text-inter">Files</h4>
          <span className="text-sm bg-[#6629DE] text-white text-inter py-1 px-2 rounded-full">125</span>
        </div>
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-[#A1A1A1] p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                <img
                  src={file.icon}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-semibold">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {file.type} · {file.size} · {file.date}
                </div>
              </div>
            </div>
            <button className="text-[#6629DE] hover:text-[#6629DE] text-xl cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
              >
                <path
                  d="M4 6.00977L7 9.00977L10 6.00977M7 9.00977V1.00977M1 11.0098C4.89 12.3098 9.11 12.3098 13 11.0098"
                  stroke="#6629DE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
