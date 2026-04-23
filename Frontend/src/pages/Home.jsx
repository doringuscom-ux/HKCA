import AdminMessagePrompt from '../components/Home/AdminMessagePrompt'
import HeroSlider from '../components/Home/HeroSlider'
import PresidentMessage from '../components/Home/PresidentMessage'
import Partners from '../components/Home/Partners'
import Disciplines from '../components/Home/Disciplines'
import About from '../components/Home/About'
import Awarde from '../components/Home/Awarde'
import Highlights from '../components/Home/Highlights'
import NewsUpdates from '../components/Home/NewsUpdates'
import WhyChooseUs from '../components/Home/WhyChooseUs'
import CTA from '../components/Home/CTA'
import Objectives from "../components/About/Objectives"

const Home = () => {
  return (
    <>
      <AdminMessagePrompt />
      <HeroSlider />
      <PresidentMessage />
      <Partners />
      <Disciplines />
      <NewsUpdates />
      <About />

      {/* <Objectives/> */}
      <Awarde />
      <Highlights />
      <WhyChooseUs />
      <CTA />
    </>
  )
}

export default Home
