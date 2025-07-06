import BannerImage from "../../assets/images/BannerImage.svg";
import {BottomLink} from "../../components/atoms/Bottom/BottomLink";

const Banner = () => {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
      <div className="w-full lg:w-1/2 max-w-[600px] order-2 lg:order-1">
        <div className="flex flex-col justify-center text-amiko capitalize text-center lg:text-start space-y-6 text-[#000]">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight">
            <span className="text-[#6629DE]">Collaborate,</span> Communicate,
            <br className="hidden sm:block" /> Succeed All in One Workspace
          </h2>
          <p className="text-base sm:text-lg font-normal max-w-[360px] mx-auto lg:mx-0 opacity-90">
            Worksy brings your team together with seamless messaging, file
            sharing, and HD video calls all in a secure, easy-to-use platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <BottomLink to="/workspace" variant="filled">
              Get Started
            </BottomLink>

            <BottomLink to="/login" variant="outline">
              Sign in
            </BottomLink>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 max-w-[690px] order-1 lg:order-2">
        <img
          src={BannerImage}
          alt="Worksy Collaboration Platform"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Banner;
