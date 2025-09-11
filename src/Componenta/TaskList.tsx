

function TaskList({tasks,updateStatus}) {
    

    return (
        <table className="table table-striped" >
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <th scope="row">{task.id}</th>
                        <td>{task.title}</td>
                        <td>
                            <button onClick={() => updateStatus(task.id, "inprogress")}  className={`btn btn-outline-primary ${task.status === "inprogress" && "active"}`} >inprogress</button>
                            <button onClick={() => updateStatus(task.id, "completed")} className={`btn btn-outline-warning ${task.status === "completed" && "active"} mx-3`} >completed</button>
                            <button onClick={() => updateStatus(task.id, "verified")} className={`btn btn-outline-success ${task.status === "verified" && "active"}`} >verified</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TaskList
