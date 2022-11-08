import { useEffect } from 'react'
import { MdSpaceDashboard, MdOutlineVerifiedUser } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Activate = () => {
    const axiosPrivate = useAxiosPrivate()
    const [ searchParams ] = useSearchParams()

    // useEffect(() => {
    //     let isMounted = true
    //     const abortController = new AbortController()
    
    //     // const activateAccount = async () => {
    //     //   try {
    //     //     const response = await axiosPrivate.post(`/api/auth/activate/`)
    //     //     isMounted && set(response.data)
    //     //   } catch (err) {
    //     //     // console.log(err)
    //     //   }
    //     // }

    //     // activateAccount()
    
    //     return () => {
    //       isMounted = false
    //       abortController.abort()
    //     }
    // }, [])

    return (
        <div className="popup center">
            {/* <div className="icon">
                <i className="fa fa-check"></i>
            </div> */}
            <MdOutlineVerifiedUser className="fs-1"/>
            <div className="title">Account Activated</div>
            <div className="description">Your email has been confirmed, check dashboard for more details.</div>
            <div className="dismiss-btn">
                <button id="dismiss-popup-btn"><MdSpaceDashboard /> DASHBOARD</button>
            </div>
        </div>
    )
}

export default Activate