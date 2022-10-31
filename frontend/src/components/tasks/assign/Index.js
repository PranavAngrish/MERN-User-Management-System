import Delete from './Delete'

const Index = ({ assignedUser }) => {

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