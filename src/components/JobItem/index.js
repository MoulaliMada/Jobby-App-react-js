import {Component} from 'react'
import {MdLocationOn, MdLocalPostOffice} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItem extends Component {
  state = {
    resultList: [],
    apiSearchStatus: apiStatusConstants.initial,
  }

  render() {
    const {eachJobItem} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = eachJobItem
    return (
      <Link to={`/jobs/${id}`} className="link">
        <div className="JobItem-bg-container">
          <div className="JobItem-title-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="JobItem-companyLogo"
            />
            <div>
              <h1 className="JobItem-title">{title}</h1>
              <div className="JobItem-star-container">
                <FaStar className="JobItem-star-logo" />
                <p className="JobItem-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="JobItem-location-salary-container">
            <div className="JobItem-location-type-container">
              <MdLocationOn className="JobItem-location-logo" />
              <p className="JobItem-location">{location}</p>
              <MdLocalPostOffice className="JobItem-location-logo" />
              <p className="JobItem-location">{employmentType}</p>
            </div>
            <p className="JobItem-location">{packagePerAnnum}</p>
          </div>
          <hr />
          <h1 className="JobItem-location">Description</h1>
          <p className="JobItem-location">{jobDescription}</p>
        </div>
      </Link>
    )
  }
}
export default JobItem
