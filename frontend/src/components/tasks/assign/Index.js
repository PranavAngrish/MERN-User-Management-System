import { useTasksContext } from '../../../hooks/useTasksContext'
import Delete from './Delete'

const Index = ({ task_id }) => {
  const { assignedUser } =  useTasksContext()

  return (
    <>
      {assignedUser.assignedTo.map(user => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td><Delete user_id={user._id}/></td>
        </tr>
      ))}
    </>
  )
}

export default Index