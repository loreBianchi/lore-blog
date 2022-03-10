/* eslint-disable react/no-unescaped-entities */
import { SiJavascript, SiPython } from 'react-icons/si'

const Hero = ({ text }) => {
  return (
    <div className="px-4 pb-5 mb-5 text-center">
      <h1 className="display-5 fw-bold azure">Hello, I'm Lorenzo 🧑🏻‍💻</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-6 azure text-shadow">
          I am a software developer in Bergamo (Italy 🇮🇹).<br/>
          I work mainly in the frontend development area, but I also like the backend part. 
          The programming languages I use and love the most are JS <SiJavascript /> and Python <SiPython />
        </p>
      </div>
    </div>
  )
}
export default Hero
