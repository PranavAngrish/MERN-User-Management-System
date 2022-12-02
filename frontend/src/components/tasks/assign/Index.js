import { useTasksContext } from '../../../context/task'
import Delete from './Delete'

const Index = () => {
  const { assignedUser } =  useTasksContext()

  return (
    <>
      {assignedUser.assignedTo.map(user => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td><Delete user={user}/></td>
        </tr>
      ))}
    </>
  )
}

export default Index