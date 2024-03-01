import {MdLocationOn, MdLocalPostOffice} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import './index.css'

const SimilarJobItem = props => {
  const {eachSimilarJob} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachSimilarJob
  console.log(eachSimilarJob)
  return (
    <li className="JobItem-bg-container similart-job-Item">
      <div className="JobItem-title-container">
        <img
          src={companyLogoUrl}
          className="JobItem-companyLogo"
          alt="similar job company logo"
        />
        <div>
          <h1 className="JobItem-title">{title}</h1>
          <div className="JobItem-star-container">
            <FaStar className="JobItem-star-logo" />
            <p className="JobItem-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="JobItem-location">Description</h1>
      <p className="JobItem-location">{jobDescription}</p>
      <div className="JobItem-location-type-container">
        <MdLocationOn className="JobItem-location-logo" />
        <p className="JobItem-location">{location}</p>
        <MdLocalPostOffice className="JobItem-location-logo" />
        <p className="JobItem-location">{employmentType}</p>
      </div>
    </li>
  )
}
export default SimilarJobItem
