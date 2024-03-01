import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initialProfile: 'INITIALPROFILE',
  successPrifile: 'SUCCESSPROFILE',
  failureProfile: 'FAILUREPROFILE',
  inProgressProfile: 'IN_PROGRESSProfile',
}

class Jobs extends Component {
  state = {
    apiJobsState: apiStatusConstants.initial,
    apiProfileState: apiStatusConstants.initialProfile,
    profileData: {},
    salary: 0,
    typeOfEmployment: [],
    searchResult: '',
    search: '',
    jobFetchedList: [],
  }

  componentDidMount() {
    this.getPrifileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    const {search, typeOfEmployment, salary} = this.state
    this.setState({apiJobsState: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jointTypeofEmployment = typeOfEmployment.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${jointTypeofEmployment}&minimum_package=${salary}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedDate = data.jobs.map(each => ({
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
        jobFetchedList: updatedDate,
        apiJobsState: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobsState: apiStatusConstants.failure,
      })
    }
  }

  getPrifileDetails = async () => {
    this.setState({apiProfileState: apiStatusConstants.inProgressProfile})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.profile_details
      const data = {
        name: updatedData.name,
        profileImageUrl: updatedData.profile_image_url,
        shortBio: updatedData.short_bio,
      }
      this.setState({
        profileData: data,
        apiProfileState: apiStatusConstants.successPrifile,
      })
    } else {
      this.setState({
        apiProfileState: apiStatusConstants.failureProfile,
      })
    }
  }

  renderinProgressProfile = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryProfile = () => {
    this.getPrifileDetails()
  }

  renderfailureProfile = () => (
    <div>
      <button type="button" onClick={this.onClickRetryProfile}>
        Retry
      </button>
    </div>
  )

  rendersuccessPrifile = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="jobs-profile-container">
        <img src={profileImageUrl} className="jobs-profile" alt="profile" />
        <h1 className="jobs-profile-name">{name}</h1>
        <p className="jobs-profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderPrifle = () => {
    const {apiProfileState} = this.state
    switch (apiProfileState) {
      case apiStatusConstants.successPrifile:
        return this.rendersuccessPrifile()
      case apiStatusConstants.failureProfile:
        return this.renderfailureProfile()
      case apiStatusConstants.inProgressProfile:
        return this.renderinProgressProfile()
      default:
        return null
    }
  }

  onClickSalary = salaryId => {
    this.setState({salary: salaryId}, this.getJobsDetails)
  }

  onCheckedTypeofEmplyment = employmentTypeId => {
    const {typeOfEmployment} = this.state
    const isInclude = typeOfEmployment.includes(employmentTypeId)
    if (isInclude === false) {
      this.setState(
        prevState => ({
          typeOfEmployment: [...prevState.typeOfEmployment, employmentTypeId],
        }),
        this.getJobsDetails,
      )
    } else {
      const filterdItem = typeOfEmployment.filter(
        item => item !== employmentTypeId,
      )
      this.setState({typeOfEmployment: filterdItem}, this.getJobsDetails)
    }
  }

  onChangeInputSearch = event => {
    this.setState({searchResult: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchResult} = this.state
    this.setState({search: searchResult}, this.getJobsDetails)
  }

  rendersuccessJob = () => {
    const {jobFetchedList} = this.state
    const leng = jobFetchedList.length
    if (leng !== 0) {
      return (
        <div>
          {jobFetchedList.map(eachJobItem => (
            <JobItem eachJobItem={eachJobItem} key={eachJobItem.id} />
          ))}
        </div>
      )
    }
    return (
      <div className="noJobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="noJobs-heading">No Jobs Found</h1>
        <p className="noJobs-paragraph">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderinProgressJob = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryJobsBtn = () => {
    this.getJobsDetails()
  }

  renderfailureJob = () => (
    <div>
      <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" />
      <h1>Oops! Somthing Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetryJobsBtn}>
        Retry
      </button>
    </div>
  )

  renderJobItems = () => {
    const {apiJobsState} = this.state
    switch (apiJobsState) {
      case apiStatusConstants.success:
        return this.rendersuccessJob()
      case apiStatusConstants.failure:
        return this.renderfailureJob()
      case apiStatusConstants.inProgress:
        return this.renderinProgressJob()
      default:
        return null
    }
  }

  render() {
    const {searchResult, salary, jobFetchedList} = this.state

    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-container">
          <div className="jobs-filers-container">
            <div className="jobs-search-icon-container">
              <input
                type="search"
                className="jobs-search-input"
                placeholder="search"
                onChange={this.onChangeInputSearch}
                value={searchResult}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.renderPrifle()}</div>
            <hr />
            <div>
              <h1 className="jobs-employmentType-heading">
                Type of Employment
              </h1>
              <ul className="jobs-employmentType-ul">
                {employmentTypesList.map(each => (
                  <li
                    className="jobs-employmentType-li"
                    key={each.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      onChange={() =>
                        this.onCheckedTypeofEmplyment(each.employmentTypeId)
                      }
                    />
                    <label
                      htmlFor={each.employmentTypeId}
                      className="jobs-employmentType-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="jobs-employmentType-heading">Salary Range</h1>
              <ul className="jobs-employmentType-ul">
                {salaryRangesList.map(each => (
                  <li
                    className="jobs-employmentType-li"
                    key={each.salaryRangeId}
                  >
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      value={each.salaryRangeId}
                      onChange={() => this.onClickSalary(each.salaryRangeId)}
                      checked={each.salaryRangeId === salary}
                    />
                    <label
                      htmlFor={each.salaryRangeId}
                      className="jobs-employmentType-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-result-container">
            <div className="jobs-search-icon-desktop-container">
              <input
                type="search"
                className="jobs-search-input"
                placeholder="search"
                onChange={this.onChangeInputSearch}
                value={searchResult}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-result-items-container">
              {this.renderJobItems()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
