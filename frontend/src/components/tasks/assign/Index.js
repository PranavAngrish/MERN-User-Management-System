import { useTasksContext } from '../../../context/task'
import Delete from './Delete'

const Index = ({ filteredLists }) => {
  const { assignedUser } =  useTasksContext()

  return (
    <>
      {filteredLists.assignedTo.map(user => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td><Delete user={user}/></td>
        </tr>
      ))}
    </>
  )
}

export default Index