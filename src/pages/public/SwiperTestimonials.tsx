import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperTestimonials.css";

const testimonials = [
  {
    id: 1,
    image: "https://i.pravatar.cc/150?img=1",
    name: "Sara Mohamed",
    title: "Lead Designer",
    description:
      "We switched from Notion to Worksy and we're glad we did. Not only is it more productive than Zoom and Google Drive for us, but our team is now 20% more productive. The built-in video calls are smooth and have saved us from needing to switch between apps.",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/150?img=2",
    name: "John Smith",
    title: "Product Manager",
    description:
      "The integration capabilities and workflow automation features have transformed how our team collaborates. Highly recommended for any remote team looking to streamline their processes.",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/150?img=3",
    name: "Emily Chen",
    title: "Software Engineer",
    description:
      "The real-time collaboration features are outstanding. Our development team has seen a significant improvement in productivity since we started using this platform.",
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/150?img=4",
    name: "Alex Rivera",
    title: "UX Researcher",
    description:
      "The intuitive interface and seamless collaboration features have made our remote work experience incredibly smooth. The platform has become an essential part of our daily workflow.",
  },
];

const SwiperTestimonials: React.FC = () => {
  return (
    <div className="min-h-screen relative bg-[#917cba] flex items-center justify-center p-0">
      <div className="absolute lg:top-25 lg:left-150 hidden lg:flex md:flex md:top-70 md:left-50 inset-0 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="565"
          height="520"
          viewBox="0 0 565 520"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clip-rule="evenodd"
            d="M273.312 0.156445C343.073 -1.9473 412.16 17.0692 464.637 63.0649C520.725 112.225 557.23 180.001 563.297 254.322C569.903 335.255 559.1 425.34 498.635 479.564C439.826 532.304 352.075 520.574 273.312 514.376C202.838 508.831 132.064 495.426 80.8714 446.693C28.5018 396.84 -2.2604 326.573 0.129791 254.322C2.45182 184.131 41.7653 122.113 93.1919 74.2663C142.599 28.2982 205.847 2.19095 273.312 0.156445Z"
            fill="#D0BDF5"
          />
        </svg>
      </div>

      <div className="w-full max-w-4xl">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          // pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white rounded-2xl shadow-lg p-8 m-4">
                <div className="flex flex-col items-center testimonial-card-content">
                  <div className="relative -top-18 mb-4 testimonial-avatar">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full shadow-inner"></div>
                  </div>
                  <h3 className="text-xl relative -top-18 font-semibold text-gray-800 testimonial-name">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 relative -top-18 mt-1 mb-6 testimonial-title">
                    {testimonial.title}
                  </p>
                  <p className="text-gray-700 relative -top-10 leading-relaxed text-center testimonial-text">
                    {testimonial.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperTestimonials;
