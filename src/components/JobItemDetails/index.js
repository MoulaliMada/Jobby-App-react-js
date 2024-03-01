import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn, MdLocalPostOffice} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    datjobDetails: {},
    datsimilarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response1 = await fetch(url, options)
    if (response1.ok === true) {
      const data = await response1.json()
      const dataJobDetails = data.job_details
      const jobDetails = {
        companyLogoUrl: dataJobDetails.company_logo_url,
        companyWebsiteUrl: dataJobDetails.company_website_url,
        employmentType: dataJobDetails.employment_type,
        id: dataJobDetails.id,
        jobDescription: dataJobDetails.job_description,
        lifeAtCompany: {
          description: dataJobDetails.life_at_company.description,
          imageUrl: dataJobDetails.life_at_company.image_url,
        },
        location: dataJobDetails.location,
        packagePerAnnum: dataJobDetails.package_per_annum,
        rating: dataJobDetails.rating,
        skills: dataJobDetails.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        title: dataJobDetails.title,
      }
      const dataSimilarJobs = data.similar_jobs
      const similarJobs = dataSimilarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        datjobDetails: jobDetails,
        datsimilarJobs: similarJobs,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryJobsBtn = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetryJobsBtn}>
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {datjobDetails, datsimilarJobs} = this.state
    console.log(datsimilarJobs)
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = datjobDetails
    return (
      <div className="JobItemDetails-successView-container">
        <div className="JobItemDetails-successView-container2">
          <div className="JobItem-title-container">
            <img
              src={companyLogoUrl}
              className="JobItem-companyLogo"
              alt="job details company logo"
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
          <div className="Description-container">
            <h1 className="JobItem-location">Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p className="JobItem-location">{jobDescription}</p>
          <h1 className="skills">Skills</h1>
          <ul className="skills-bg-container">
            {skills.map(each => (
              <li className="skilss-container" key={each.name}>
                <img
                  src={each.imageUrl}
                  className="skills-img"
                  alt={each.name}
                />
                <p className="JobItem-location">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="skills">Life at Company</h1>
          <div className="lifeAtCompany-container">
            <p className="JobItem-location lifeAtCompany-paragraph">
              {lifeAtCompany.description}
            </p>
            <img src={lifeAtCompany.imageUrl} className="lifeAtCompany-image" />
          </div>
        </div>
        <h1 className="similarJobs-heading">Similar Jobs</h1>
        <ul className="jobItemDetails-similarJob-Container">
          {datsimilarJobs.map(eachSimilarJob => (
            <SimilarJobItem
              eachSimilarJob={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="JobsItemDetails-bg-container">
        <Header />
        {this.renderJobsView()}
      </div>
    )
  }
}
export default JobItemDetails
