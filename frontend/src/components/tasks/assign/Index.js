import Delete from './Delete'

const Index = ({ filteredLists }) => {

  return (
    <>
      {filteredLists.map(user => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td><Delete user={user}/></td>
        </tr>
      ))}
    </>
  )
}

export default Index