import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Project from '../Project'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsPage extends Component {
  state = {
    projectsList: [],
    activeId: 'ALL',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeId} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const fetchedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        projectsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOptions = event => {
    this.setState({activeId: event.target.value}, this.getProjects)
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="TailSpin" color="#328af2" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-container">
        {projectsList.map(each => (
          <Project key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  renderFinalResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsView()
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
      <div className="bg-container" onChange={this.onChangeOptions}>
        <Header />
        <select className="select-options">
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderFinalResult()}
      </div>
    )
  }
}

export default ProjectsPage
