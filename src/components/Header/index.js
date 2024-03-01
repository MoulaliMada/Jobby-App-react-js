import {Link, withRouter} from 'react-router-dom'
import {MdLocalPostOffice} from 'react-icons/md'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    console.log(Cookies.get('jwt_token'))
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-bg-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-web-logo"
          alt="website logo"
        />
      </Link>
      <div className="header-links-container">
        <ul className="header-links-ul">
          <li>
            <Link to="/">
              <IoMdHome className="header-home-link" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <MdLocalPostOffice className="header-home-link" />
            </Link>
          </li>
        </ul>
        <li>
          <button type="button" className="logout-mobile-btn">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="logout icon"
              className="logout-icon"
              onClick={onClickLogout}
            />
          </button>
        </li>
      </div>
      <div className="links-container-desktop">
        <div className="links-home-jobs-container">
          <li>
            <Link to="/" className="header-desktop-home">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="header-desktop-home">
              Jobs
            </Link>
          </li>
        </div>
        <li>
          <button className="logout-btn" onClick={onClickLogout} type="button">
            Logout
          </button>
        </li>
      </div>
    </div>
  )
}
export default withRouter(Header)
