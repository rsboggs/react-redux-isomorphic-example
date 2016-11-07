import React from 'react'
import { connect } from 'react-redux'
import BasicInfo from '../components/BasicInfo'

const mapStateToProps = (state) => {
  return {
  }
}

const dispatchToProps = (dispatch) => {
  return {
  }
}

const BasicInfoContainer = connect(
  mapStateToProps,
  dispatchToProps,
)(BasicInfo)

export default BasicInfoContainer
