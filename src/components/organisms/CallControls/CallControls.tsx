import React from 'react';

type CallControlsProps = {
  isMicOn: boolean;
  isCamOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onEndCall: () => void;
};

const CallControls: React.FC<CallControlsProps> = ({ isMicOn, isCamOn, onToggleMic, onToggleCam, onEndCall }) => {
  return (
    <div className="w-full flex items-center justify-center gap-6 py-4 bg-[#FBFBFB] border border-[#EDF0F6] backdrop-blur-[8px]">
      {/* زر المايك */}
      <button
        onClick={onToggleMic}
        className={`w-12 h-12 flex items-center cursor-pointer justify-center rounded-full transition border-2 ${isMicOn ? 'bg-[#6629DE] border-[#6629DE]' : 'bg-red-100 border-red-400'}`}
        title={isMicOn ? 'كتم المايك' : 'تشغيل المايك'}
      >
        {isMicOn ? (
          // أيقونة مايك مفتوح
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13.5727 6.42725H7.50248H7.22656V10.681L9.70982 13.4155H11.3653L13.5727 10.9848V6.42725Z" fill="white" fill-opacity="0.8" />
            <path d="M10.3996 13.0125C12.1527 13.0125 13.5727 11.5691 13.5727 9.78709V5.3522C13.5727 3.57018 12.1527 2.12683 10.3996 2.12683C8.6465 2.12683 7.22656 3.57018 7.22656 5.3522V9.78709C7.22656 11.5691 8.6465 13.0125 10.3996 13.0125Z" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.33008 8.29529V9.66607C4.33008 13.0688 7.05097 15.8346 10.3985 15.8346C13.7461 15.8346 16.467 13.0688 16.467 9.66607V8.29529" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.3984 15.8346V18.2536" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ) : (
          // أيقونة مايك مكتوم
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 6.3V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.03906 14.19C9.76906 15 10.8291 15.5 11.9991 15.5C14.2091 15.5 15.9991 13.71 15.9991 11.5V11" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.7793 16.95C8.1493 18.22 9.9793 19 11.9993 19C16.2193 19 19.6493 15.57 19.6493 11.35V9.65002" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.34961 9.65002V11.35C4.34961 12.41 4.55961 13.41 4.94961 14.33" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.0697 2.83997L3.92969 18.99" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 3V6" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 19V22" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>)}
      </button>
      {/* زر الكاميرا */}
      <button
        onClick={onToggleCam}
        className={`w-12 h-12 flex items-center cursor-pointer justify-center rounded-full transition border-2 ${isCamOn ? 'bg-[#6629DE] border-[#6629DE]' : 'bg-red-100 border-red-400'}`}
        title={isCamOn ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
      >
        {isCamOn ? (
          // أيقونة كاميرا مفتوحة
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.2124 16.9798H5.19901C2.6923 16.9798 1.85938 15.2865 1.85938 13.5851V6.7957C1.85938 4.24766 2.6923 3.401 5.19901 3.401H10.2124C12.7191 3.401 13.5521 4.24766 13.5521 6.7957V13.5851C13.5521 16.1332 12.7112 16.9798 10.2124 16.9798Z" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.758 14.3028L13.5527 12.7304V7.6424L15.758 6.07003C16.8368 5.304 17.7253 5.77168 17.7253 7.11828V13.2626C17.7253 14.6092 16.8368 15.0769 15.758 14.3028Z" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.39497 9.38412C10.0521 9.38412 10.5849 8.8426 10.5849 8.1746C10.5849 7.50661 10.0521 6.96509 9.39497 6.96509C8.73781 6.96509 8.20508 7.50661 8.20508 8.1746C8.20508 8.8426 8.73781 9.38412 9.39497 9.38412Z" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>) : (
          // أيقونة كاميرا مغلقة
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.63 7.57996C16.63 7.57996 16.66 6.62996 16.63 6.31996C16.46 4.27996 15.13 3.57996 12.52 3.57996H6.21C3.05 3.57996 2 4.62996 2 7.78996V16.21C2 17.47 2.38 18.74 3.37 19.55L4 20" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.7398 10.95V16.21C16.7398 19.37 15.6898 20.42 12.5298 20.42H7.25977" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22.0002 6.73999V15.81C22.0002 17.48 20.8802 18.06 19.5202 17.1L16.7402 15.15" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22.0195 2.18994L2.01953 22.1899" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        )}
      </button>
      {/* Shere Screen */}
      <button className='w-12 h-12 flex items-center cursor-pointer justify-center rounded-full transition border-2 bg-[#D0BDF5] border-[#D0BDF5]'>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.80869 18.2537H12.5683C16.5346 18.2537 18.1211 16.641 18.1211 12.6093V7.77123C18.1211 3.73952 16.5346 2.12683 12.5683 2.12683H7.80869C3.84238 2.12683 2.25586 3.73952 2.25586 7.77123V12.6093C2.25586 16.641 3.84238 18.2537 7.80869 18.2537Z" stroke="#6629DE" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7.80859 8.18246L10.1884 5.76343L12.5682 8.18246" stroke="#6629DE" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.1875 5.76343V12.2142" stroke="#6629DE" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.42969 13.8269C8.51548 14.8751 11.863 14.8751 14.9488 13.8269" stroke="#6629DE" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      </button>
      {/* Record */}
      <button className='w-12 h-12 flex items-center cursor-pointer justify-center rounded-full transition border-2 bg-[#FFC8C8] border-[#FFC8C8]'>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.95996 18.2537C14.341 18.2537 17.8926 14.6436 17.8926 10.1903C17.8926 5.73695 14.341 2.12683 9.95996 2.12683C5.5789 2.12683 2.02734 5.73695 2.02734 10.1903C2.02734 14.6436 5.5789 18.2537 9.95996 18.2537Z" stroke="#EB5757" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.9844 13.6011C11.8376 13.6011 13.3399 12.074 13.3399 10.1902C13.3399 8.3065 11.8376 6.77942 9.9844 6.77942C8.13121 6.77942 6.62891 8.3065 6.62891 10.1902C6.62891 12.074 8.13121 13.6011 9.9844 13.6011Z" stroke="#EB5757" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </button>
      {/* Chat */}
      <button className='w-12 h-12 flex items-center cursor-pointer justify-center rounded-full transition border-2 bg-[#D0BDF5] border-[#D0BDF5]'>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.00386 15.8347H6.60723C3.43418 15.8347 1.84766 15.0283 1.84766 10.9966V6.96489C1.84766 3.73952 3.43418 2.12683 6.60723 2.12683H12.9533C16.1264 2.12683 17.7129 3.73952 17.7129 6.96489V10.9966C17.7129 14.222 16.1264 15.8347 12.9533 15.8347H12.5567C12.3108 15.8347 12.0728 15.9556 11.9221 16.1572L10.7322 17.7699C10.2086 18.4795 9.35191 18.4795 8.82836 17.7699L7.63847 16.1572C7.51155 15.9798 7.21804 15.8347 7.00386 15.8347Z" stroke="#6629DE" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.9489 9.38401H12.956" stroke="#6629DE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.77509 9.38401H9.78221" stroke="#6629DE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.60321 9.38401H6.61034" stroke="#6629DE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      </button>
      {/* More */}
      <button className='w-12 h-12 flex cursor-pointer items-center justify-center rounded-full transition border-2 bg-[#D0BDF5] border-[#D0BDF5]'>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10.1742 8.57776C9.30163 8.57776 8.5877 9.30347 8.5877 10.1904C8.5877 11.0774 9.30163 11.8031 10.1742 11.8031C11.0468 11.8031 11.7607 11.0774 11.7607 10.1904C11.7607 9.30347 11.0468 8.57776 10.1742 8.57776ZM14.9338 8.57776C14.0612 8.57776 13.3473 9.30347 13.3473 10.1904C13.3473 11.0774 14.0612 11.8031 14.9338 11.8031C15.8064 11.8031 16.5203 11.0774 16.5203 10.1904C16.5203 9.30347 15.8064 8.57776 14.9338 8.57776ZM5.41465 8.57776C4.54206 8.57776 3.82812 9.30347 3.82812 10.1904C3.82812 11.0774 4.54206 11.8031 5.41465 11.8031C6.28724 11.8031 7.00117 11.0774 7.00117 10.1904C7.00117 9.30347 6.28724 8.57776 5.41465 8.57776Z" fill="#6629DE" />
      </svg>
      </button>
      {/* زر إنهاء المكالمة */}
      <button
        onClick={onEndCall}
        className="px-8 py-4 cursor-pointer rounded-[16px] bg-[#EB5757] hover:bg-red-700 text-white font-normal  shadow-lg transition"
        title="End Call"
      >
        End Call
      </button>
    </div>
  );
};

export default CallControls;