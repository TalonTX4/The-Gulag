import React, { Fragment, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Spinner from "../layout/spinner"
import ProfileItem from "./ProfileItem"
import { getProfiles } from "../../actions/profile"

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  return (
    <section className="container">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">
            <i className="fas fa-person-military-rifle"></i> Convicts
          </h1>
          <p className="lead">
            <i className="fas fa-people-group"></i> Browse and connect with
            other Convicts
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No Convicts found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  )
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
