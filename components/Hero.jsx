/* eslint-disable react/no-unescaped-entities */
import { SiJavascript, SiPython } from 'react-icons/si'

const Hero = ({ text }) => {
  return (
    <div className="px-4 pb-5 mb-5 text-center">
      <h1 className="display-5 fw-bold azure text-4xl font-bold">Hello, I'm Lorenzo 🧑🏻‍💻</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead my-6 azure text-shadow text-xl">
          I am a software developer in Bergamo (Italy 🇮🇹).<br/>
          I work mainly in the frontend development area, but I also like the backend part.<br/>
          The programming languages I use and love the most are JS <SiJavascript className="h-[30px] w-[30px] inline-block" /> and Python <SiPython className="h-[30px] w-[30px] inline-block" />
        </p>
        {/* TODO: add social links */}
      </div>
    </div>
  )
}
export default Hero
