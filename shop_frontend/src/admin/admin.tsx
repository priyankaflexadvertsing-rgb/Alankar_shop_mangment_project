import React from 'react'
import DashBoardWarpper from './dashBoardWarpper'
import UserDetails from '../../components/Screen/UserDetails/UserDetails'

const Admin = () => {
    return (
        <DashBoardWarpper>
            <UserDetails/>
        </DashBoardWarpper>
    )
}

export default Admin
