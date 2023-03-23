import React, { Fragment, useState, useEffect } from "react"
import { Link, useMatch, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createProfile, getCurrentProfile } from "../../actions/profile"
import { formConstructor } from "../../constructors/formConstructor"

// declaring initialState outside of profileForm to preemptively set all values to null
const initialState = {
  company: "",
  website: "",
  location: "",
  status: "",
  skills: "",
  githubUsername: "",
  bio: "",
  twitter: "",
  facebook: "",
  linkedin: "",
  youtube: "",
  instagram: "",
}

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
}) => {
  const [formData, setFormData] = useState(initialState)

  const creatingProfile = useMatch("/create-profile")

  const [displaySocialInputs, toggleSocialInputs] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // if there is no profile, attempt to fetch one
    if (!profile) getCurrentProfile()

    // if we finished loading, and we do have a profile
    // then build our profileData
    if (!loading && profile) {
      const profileData = { ...initialState }
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key]
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key]
      }
      // the skills may be an array from our API response
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(", ")
      // set local state with the profileData
      setFormData(profileData)
    }
  }, [loading, getCurrentProfile, profile])

  const {} = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    const editing = !!profile
    e.preventDefault()
    createProfile(formData, editing).then(() => {
      if (!editing) navigate("/dashboard")
    })
  }

  let profileFields = formConstructor("profile", formData, onChange)

  let socialFields = formConstructor("social", formData, onChange)

  return (
    <section className="container">
      <h1 className="large text-primary">
        {creatingProfile
          ? "Create Your Personnel File"
          : "Edit Your Personnel File"}
      </h1>
      <p className="lead">
        <i className="fas fa-user" />
        {creatingProfile
          ? ` Let's get some information to make your Personnel File`
          : " Add some changes to your Personnel File"}
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        {profileFields}
        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && <Fragment>{socialFields}</Fragment>}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  )
}

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
)
