import React from 'react'
import { Route } from 'react-router'
import BasicInfoContainer from '../containers/BasicInfoContainer';

const routes = {
  path: '/',
  component: BasicInfoContainer,
  // childRoutes: [
  // {
  //   path: '/route1',
  //   component: ComponentName,
  // },
  // {
  //   path: '/route2',
  //   component: ComponentName,
  // }]
}

export default routes
