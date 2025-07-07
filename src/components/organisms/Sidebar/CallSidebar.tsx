import React, { useRef, useEffect, useState } from "react";

type CallSidebarProps = {
  showChatSidebar: boolean;
  setShowChatSidebar: (show: boolean) => void;
  dummyMembers: string[];
  dummyMessages: { id: number; user: string; text: string; avatar?: string; time?: string }[];
};

const defaultAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/46.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
  "https://randomuser.me/api/portraits/men/35.jpg",
  "https://randomuser.me/api/portraits/men/36.jpg",
];

const defaultUser = {
  name: "You",
  avatar: "https://randomuser.me/api/portraits/men/99.jpg",
};

const micOffSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M16 6.3V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.03906 14.19C9.76906 15 10.8291 15.5 11.9991 15.5C14.2091 15.5 15.9991 13.71 15.9991 11.5V11" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.7793 16.95C8.1493 18.22 9.9793 19 11.9993 19C16.2193 19 19.6493 15.57 19.6493 11.35V9.65002" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.34961 9.65002V11.35C4.34961 12.41 4.55961 13.41 4.94961 14.33" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.0697 2.83997L3.92969 18.99" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 3V6" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 19V22" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const camOffSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M16.63 7.57996C16.63 7.57996 16.66 6.62996 16.63 6.31996C16.46 4.27996 15.13 3.57996 12.52 3.57996H6.21C3.05 3.57996 2 4.62996 2 7.78996V16.21C2 17.47 2.38 18.74 3.37 19.55L4 20" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.7398 10.95V16.21C16.7398 19.37 15.6898 20.42 12.5298 20.42H7.25977" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22.0002 6.73999V15.81C22.0002 17.48 20.8802 18.06 19.5202 17.1L16.7402 15.15" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22.0195 2.18994L2.01953 22.1899" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const addIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#8F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#8F5BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CallSidebar: React.FC<CallSidebarProps> = ({ showChatSidebar, setShowChatSidebar, dummyMembers, dummyMessages }) => {
  const [messages, setMessages] = useState(
    dummyMessages.map((msg, idx) => ({
      ...msg,
      avatar: msg.avatar || defaultAvatars[idx % defaultAvatars.length],
      time: msg.time || "4:49 PM",
    }))
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChatSidebar]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: defaultUser.name,
        text: input,
        avatar: defaultUser.avatar,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className="hidden md:flex flex-col h-full bg-white border-l border-gray-200 p-4"
      style={{ width: "320px", minWidth: "220px", maxWidth: "400px", transition: "width 0.3s" }}
    >
      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[15px] text-gray-700">All Members <span className="text-gray-400">({dummyMembers.length})</span></span>
          <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F3EDFF] text-[#8F5BFF] text-sm font-medium hover:bg-[#e7dbff] transition">
            Add members {addIcon}
          </button>
        </div>
        <ul className="space-y-2 mb-2 overflow-y-auto" style={{ maxHeight: '260px' }}>
          {dummyMembers.map((name, idx) => {
            // افتراضي: صورة أو دائرة بحروف الاسم
            const avatarUrl = defaultAvatars[idx % defaultAvatars.length];
            const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2);
            return (
              <li key={idx} className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-gray-50 transition">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <span className="w-9 h-9 rounded-full flex items-center justify-center bg-[#E5E5E5] text-[#8F5BFF] font-bold text-base">{initials}</span>
                )}
                <span className="text-[15px] text-gray-900 flex-1">{name}</span>
                <span className="flex gap-1 items-center">
                  {micOffSvg}
                  {camOffSvg}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Chat */}
      {showChatSidebar && (
        <div className="flex flex-col flex-1 overflow-y-auto mt-2 border-t border-gray-100 pt-2">
          <div className="font-bold mb-2 flex items-center justify-between">
            <span>
              chat <span className="text-xs text-gray-400">#General</span>
            </span>
            <button
              onClick={() => setShowChatSidebar(false)}
              className="text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>
          </div>
          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex items-start gap-3 mb-6">
                <img
                  src={msg.avatar}
                  alt={msg.user}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-gray-900">
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <div className="text-[15px] text-gray-900 mt-1 whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input Bar */}
          <div
            className="bg-white px-2 py-2 border border-[#D1D5DB] rounded-md shadow-sm flex flex-col gap-2 mt-2"
            style={{ minHeight: 54 }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-transparent outline-none px-3 text-[15px] border-b border-[#E5E7EB] pb-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  {/* Plus icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11.25 12.75V16C11.25 16.2125 11.3219 16.3906 11.4658 16.5343C11.6096 16.6781 11.7878 16.75 12.0003 16.75C12.2129 16.75 12.391 16.6781 12.5345 16.5343C12.6782 16.3906 12.75 16.2125 12.75 16V12.75H16C16.2125 12.75 16.3906 12.6781 16.5343 12.5343C16.6781 12.3904 16.75 12.2122 16.75 11.9998C16.75 11.7871 16.6781 11.609 16.5343 11.4655C16.3906 11.3218 16.2125 11.25 16 11.25H12.75V8C12.75 7.7875 12.6781 7.60942 12.5343 7.46575C12.3904 7.32192 12.2122 7.25 11.9998 7.25C11.7871 7.25 11.609 7.32192 11.4655 7.46575C11.3218 7.60942 11.25 7.7875 11.25 8V11.25H8C7.7875 11.25 7.60942 11.3219 7.46575 11.4658C7.32192 11.6096 7.25 11.7878 7.25 12.0003C7.25 12.2129 7.32192 12.391 7.46575 12.5345C7.60942 12.6782 7.7875 12.75 8 12.75H11.25ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#888888"/>
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  {/* Mic icon */}
                  <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.9995 13.5335C11.2716 13.5335 10.6591 13.2722 10.162 12.7495C9.6648 12.2268 9.41622 11.5937 9.41622 10.8502V4.73349C9.41622 4.02066 9.66722 3.41466 10.1692 2.91549C10.6714 2.41649 11.2811 2.16699 11.9985 2.16699C12.7158 2.16699 13.3259 2.41649 13.8287 2.91549C14.3314 3.41466 14.5827 4.02066 14.5827 4.73349V10.8502C14.5827 11.5937 14.3341 12.2268 13.837 12.7495C13.3398 13.2722 12.7273 13.5335 11.9995 13.5335ZM11.212 20.071V17.5772C9.64813 17.4009 8.30022 16.7662 7.16822 15.6732C6.03622 14.5801 5.3758 13.2418 5.18697 11.6585C5.15363 11.4352 5.21055 11.2447 5.35772 11.087C5.50488 10.9292 5.6943 10.8502 5.92597 10.8502C6.14713 10.8502 6.33413 10.9273 6.48697 11.0815C6.6398 11.2357 6.73705 11.4267 6.77872 11.6545C6.98139 12.9462 7.5818 14.0017 8.57997 14.821C9.57813 15.6405 10.7174 16.0502 11.9977 16.0502C13.2961 16.0502 14.4404 15.6384 15.4307 14.8147C16.4211 13.9912 17.0204 12.9378 17.2287 11.6545C17.2656 11.4275 17.3611 11.2367 17.5155 11.082C17.6698 10.9275 17.8592 10.8502 18.0837 10.8502C18.3081 10.8502 18.4939 10.9292 18.6412 11.087C18.7884 11.2447 18.8481 11.4352 18.8202 11.6585C18.6259 13.2225 17.9672 14.5555 16.8442 15.6575C15.7214 16.7595 14.3717 17.4002 12.7952 17.5795V20.071C12.7952 20.2933 12.7179 20.4816 12.5632 20.6357C12.4086 20.7899 12.2196 20.867 11.9965 20.867C11.7735 20.867 11.587 20.7899 11.437 20.6357C11.287 20.4816 11.212 20.2933 11.212 20.071ZM11.9995 11.9502C12.2925 11.9502 12.5324 11.8433 12.7192 11.6295C12.9061 11.4155 12.9995 11.1557 12.9995 10.8502V4.74074C12.9995 4.46091 12.9038 4.22591 12.7125 4.03574C12.521 3.84541 12.2837 3.75024 12.0007 3.75024C11.7177 3.75024 11.4801 3.84449 11.288 4.03299C11.0956 4.22149 10.9995 4.45499 10.9995 4.73349V10.848C10.9995 11.155 11.0929 11.4155 11.2797 11.6295C11.4666 11.8433 11.7065 11.9502 11.9995 11.9502Z"
                  fill="#888888"
                />
              </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  {/* Emoji icon */}
                  <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.5492 10.767C15.9284 10.767 16.2513 10.6342 16.518 10.3687C16.7846 10.1034 16.918 9.78124 16.918 9.40224C16.918 9.02308 16.7853 8.70016 16.52 8.43349C16.2545 8.16683 15.9322 8.03349 15.5532 8.03349C15.1741 8.03349 14.8511 8.16616 14.5845 8.43149C14.3178 8.69699 14.1845 9.01924 14.1845 9.39824C14.1845 9.77741 14.3172 10.1003 14.5827 10.367C14.8481 10.6337 15.1702 10.767 15.5492 10.767ZM8.44922 10.767C8.82839 10.767 9.1513 10.6342 9.41797 10.3687C9.68464 10.1034 9.81797 9.78124 9.81797 9.40224C9.81797 9.02308 9.68522 8.70016 9.41972 8.43349C9.15439 8.16683 8.83222 8.03349 8.45322 8.03349C8.07405 8.03349 7.75114 8.16616 7.48447 8.43149C7.2178 8.69699 7.08447 9.01924 7.08447 9.39824C7.08447 9.77741 7.21714 10.1003 7.48247 10.367C7.74797 10.6337 8.07022 10.767 8.44922 10.767ZM12.0022 21.8335C10.6421 21.8335 9.36339 21.5751 8.16622 21.0582C6.96905 20.5416 5.92764 19.8402 5.04197 18.9542C4.15647 18.0682 3.45605 17.0277 2.94072 15.8325C2.42555 14.6373 2.16797 13.3602 2.16797 12.0012C2.16797 10.6411 2.42639 9.36241 2.94322 8.16524C3.45989 6.96808 4.16122 5.92666 5.04722 5.04099C5.93322 4.15549 6.9738 3.45508 8.16897 2.93974C9.36414 2.42458 10.6412 2.16699 12.0002 2.16699C13.3604 2.16699 14.6391 2.42541 15.8362 2.94224C17.0334 3.45891 18.0748 4.16024 18.9605 5.04624C19.846 5.93224 20.5464 6.97283 21.0617 8.16799C21.5769 9.36316 21.8345 10.6402 21.8345 11.9992C21.8345 13.3594 21.5761 14.6381 21.0592 15.8352C20.5426 17.0324 19.8412 18.0738 18.9552 18.9595C18.0692 19.845 17.0286 20.5454 15.8335 21.0607C14.6383 21.5759 13.3612 21.8335 12.0022 21.8335ZM12.0012 20.2502C14.3026 20.2502 16.2529 19.4506 17.8522 17.8512C19.4516 16.2519 20.2512 14.3016 20.2512 12.0002C20.2512 9.69891 19.4516 7.74858 17.8522 6.14924C16.2529 4.54991 14.3026 3.75024 12.0012 3.75024C9.69989 3.75024 7.74955 4.54991 6.15022 6.14924C4.55089 7.74858 3.75122 9.69891 3.75122 12.0002C3.75122 14.3016 4.55089 16.2519 6.15022 17.8512C7.74955 19.4506 9.69989 20.2502 12.0012 20.2502ZM11.991 17.3835C12.931 17.3835 13.7981 17.1669 14.5925 16.7337C15.3868 16.3007 16.033 15.7018 16.531 14.937C16.6306 14.7458 16.6245 14.5586 16.5125 14.3752C16.4005 14.1919 16.2325 14.1002 16.0085 14.1002H7.99822C7.76689 14.1002 7.59639 14.1919 7.48672 14.3752C7.37689 14.5586 7.3748 14.7438 7.48047 14.931C7.97214 15.6993 8.61589 16.3002 9.41172 16.7335C10.2076 17.1668 11.0673 17.3835 11.991 17.3835Z"
                  fill="#888888"
                />
                </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  {/* Attachment icon */}
                  <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.42541 3.53198C4.94956 3.84953 3.82566 4.99078 3.52746 6.47483C3.45601 6.83038 3.44886 7.46378 3.46296 12.1748C3.47766 17.0965 3.48521 17.4962 3.56836 17.7748C3.88646 18.8403 4.62136 19.7197 5.57396 20.1745C6.31606 20.5288 6.19271 20.5178 9.60841 20.5369C12.2688 20.5517 12.7376 20.5434 13.0283 20.476C13.7571 20.3069 13.7108 20.3468 17.0291 17.0285C20.3474 13.7102 20.3075 13.7565 20.4766 13.0277C20.544 12.737 20.5523 12.2682 20.5375 9.60783C20.5183 6.18968 20.5292 6.30943 20.1734 5.57483C19.7047 4.60688 18.8447 3.88703 17.7754 3.56778C17.4962 3.48438 17.1045 3.47743 12.1254 3.46743C7.52016 3.45818 6.72671 3.46713 6.42541 3.53198ZM6.68181 5.00533C6.57531 5.03033 6.33286 5.13243 6.14306 5.23218C5.56891 5.53388 5.13371 6.10523 4.99936 6.73373C4.96531 6.89288 4.95251 8.73443 4.96161 12.1536L4.97541 17.3324L5.18781 17.761C5.51596 18.4232 6.05221 18.8491 6.74036 18.994C6.91436 19.0307 7.83586 19.0498 9.42486 19.0498H11.8444L11.8635 16.9873C11.8846 14.7089 11.8881 14.6806 12.2277 13.9694C12.5812 13.2291 13.2312 12.5798 13.974 12.2252C14.6807 11.8877 14.7113 11.884 16.9879 11.8629L19.0504 11.8438L19.0498 9.38433C19.0492 6.68873 19.0469 6.66358 18.7481 6.10313C18.468 5.57753 17.8902 5.14013 17.2948 5.00288C17.0151 4.93838 6.95691 4.94073 6.68181 5.00533ZM15.0818 13.4053C14.4926 13.5437 13.8387 14.0729 13.5792 14.6213C13.3666 15.0709 13.3474 15.277 13.3618 16.9625L13.3754 18.5502L15.9752 15.95L18.5751 13.3498L16.9252 13.3548C16.0178 13.3576 15.1883 13.3803 15.0818 13.4053Z"
                  fill="#888888"
                />
              </svg>
                </button>
              </div>
              <div className="flex-1" />
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#757575] hover:bg-[#5a5a5a] transition"
                onClick={handleSend}
              >
                <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <mask
                id="mask0_2615_9451"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_2615_9451)">
                <path
                  d="M6.7665 18.7233C6.4645 18.8439 6.17792 18.8183 5.90675 18.6463C5.63558 18.4743 5.5 18.2238 5.5 17.8948V13.6735L12.423 12.0005L5.5 10.3275V6.10625C5.5 5.77725 5.63558 5.52675 5.90675 5.35475C6.17792 5.18275 6.4645 5.15709 6.7665 5.27775L20.723 11.162C21.0948 11.3285 21.2807 11.6086 21.2807 12.0023C21.2807 12.3959 21.0948 12.6748 20.723 12.839L6.7665 18.7233Z"
                  fill="white"
                />
              </g>
            </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallSidebar; 