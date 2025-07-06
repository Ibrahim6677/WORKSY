import Banner from './Banner'
import Collaboration from './Collaboration'
import IntuitiveWay from './IntuitiveWay'
import SwiperTestimonials from './SwiperTestimonials'

const HomePage = () => {
  return (
    <div className="space-y-12 py-6 overflow-hidden w-full">
      <Banner />
      <Collaboration />
      <IntuitiveWay />
      <SwiperTestimonials />
    </div>
  )
}

export default HomePage