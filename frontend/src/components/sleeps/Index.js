import { useState } from 'react'
import { BsCalendarWeek } from 'react-icons/bs'
import Edit from './Edit'
import Delete from './Delete'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
const moment = require('moment')

const Index = ({ sleep }) => {
const sleepTime = sleep.sleep.replace('T', ' ')
const wakeTime = sleep.wake.replace('T', ' ')

const durationCoverter = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    console.log(hours, minutes)
    return `${padToTwoDigits(hours)} Hours ${padToTwoDigits(minutes)} minutes`
}

const padToTwoDigits = (num) => {
    return num.toString().padStart(2, '0')
}

  return (
    <div className="card mb-3">
        <div className="card-body d-flex justify-content-between align-items-start">
            <div>
                <div className="fs-4 mb-1 text-primary"><BsCalendarWeek/>&nbsp;{moment(sleep.sleep.split('T').shift()).format('DD-MM-YYYY')}</div>
                <p>
                    <strong className="fs-6 text-muted">Sleep time:</strong>&nbsp;{sleepTime}<br/>
                    <strong className="fs-6 text-muted">Wake time:</strong>&nbsp;{wakeTime}<br/>
                    <strong className="fs-6 text-muted">Duration:</strong>&nbsp;{durationCoverter(sleep.duration)}<br/>
                    {formatDistanceToNow(new Date(sleep.createdAt), { addSuffix: true })}
                </p>
            </div>
            <div>
                <Edit sleep={sleep}/>
                <Delete sleep={sleep}/>
            </div>
        </div>
        {/* <div className="mx-3">
            {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
        </div> */}
    </div>
  )
}
  
export default Index

