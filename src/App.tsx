import { useState } from "react"
import TaskList from "./Componenta/TaskList"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import modal from './Componenta/Moddal';

function App() {

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "oltin olma du ol",
            status: "inprogress"
        },
        {
            id: 2,
            title: "pul olma du ol",
            status: "completed"
        },
        {
            id: 3,
            title: "olma olma du ol",
            status: "verified"
        },
    ])

    const [status, setStatus] = useState("all")

    function updateStatus(id, status) {
        let newTasks = tasks.map((task) => {
            if (task.id === id) {
                task.status = status
            }
            return task
        })
        setTasks(newTasks)
    }


    return (
        <div className="container mt-5">

            <button onClick={() => setStatus("all")} className="btn btn-outline-success mx-2" >All</button>
            <button onClick={() => setStatus("inprogress")} className="btn btn-outline-success mx-2" >inprogress</button>
            <button onClick={() => setStatus("completed")} className="btn btn-outline-success mx-2" >completed</button>
            <button onClick={() => setStatus("verified")} className="btn btn-outline-success mx-2" >verified</button>
            <button type="submit" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
  Launch static backdrop modal
</button>
            <TaskList
                updateStatus={updateStatus}
                tasks={status == "all" ? tasks : tasks.filter(task => task.status == status)}
            />

        </div>
    )
}

export default App
