import { Link } from "react-router-dom"

const Index = ({ filteredNote }) => {

  return (
    <>
      {filteredNote.map((note, index) => (
        <Link to={`/note/view/${note._id}`} key={index} className="text-decoration-none text-muted">
          <div className="col-lg-3">
            <div className="card my-2">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}

export default Index