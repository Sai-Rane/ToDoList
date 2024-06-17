import React, { useRef, useState } from "react";
import "./ToDo.css";

const ToDo = () => {
  const refElement = useRef();
  const inputValue = useRef();
  const [text, setText] = useState("");
  const [taskButton, setTaskButton] = useState(true);
  const [taskData, setTaskData] = useState(() => {
    const a = localStorage.getItem("taskData");
    if (a) {
      return JSON.parse(a);
    }
    return [];
  });
  const [editData, setEditData] = useState({
    isEdit: false,
    index: null,
  });
  console.log("text", text);

  //   const obj = {
  //     name: "John",
  //   };
  //   localStorage.setItem("user", JSON.stringify(obj));
  //   const user1 = localStorage.getItem("user");
  //   console.log("user", user1);

  function addTask() {
    const updatedTaskData = [...taskData, { todo: text, completed: false }];
    setTaskData(updatedTaskData);
    localStorage.setItem("taskData", JSON.stringify(updatedTaskData));
    setText("");
    refElement.current.focus();
  }

  function removeTask(index) {
    console.log("task removed", index);
    const updatedListData = taskData.filter((ele, id) => {
      return index != id;
    });
    setTaskData(updatedListData);
    localStorage.setItem("taskData", JSON.stringify(updatedListData));
  }

  function editTask(id) {
    console.log("id", id);
    if (editData.isEdit) {
      setTaskData((prev) => {
        const tempData = prev.map((ele, ind) => {
          if (id == ind) {
            return { ...ele, todo: inputValue.current };
          }
          return ele;
        });
        localStorage.setItem("taskData", JSON.stringify(tempData));
        return tempData;
      });
      setEditData({ isEdit: false, index: null });
    } else {
      setEditData({ isEdit: true, index: id });
    }
  }

  function handleEdit(e) {
    inputValue.current = e.target.value;
  }
  console.log("taskData", taskData);
  return (
    <div>
      <div className="toDo_Text">To Do List</div>
      <div className="main">
        <input
          className="textTask"
          ref={refElement}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTaskButton(false);
          }}
          placeholder="Add your task"
        />
        <button className="addTaskBtn" disabled={taskButton} onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* displaying tasks */}
      <p>Here are your tasks</p>
      {taskData.length > 0 &&
        taskData.map((ele, index) => {
          return (
            <>
              <div className="taskArea" key={index}>
                {editData.isEdit && editData.index == index ? (
                  <input defaultValue={ele.todo} onChange={handleEdit} />
                ) : (
                  <div>{ele.todo}</div>
                )}

                <div>
                  <button
                    className="removeTaskBtn"
                    onClick={() => removeTask(index)}
                  >
                    Remove
                  </button>
                  <button onClick={() => editTask(index)}>
                    {editData.isEdit && editData.index == index
                      ? "update"
                      : "Edit"}
                  </button>
                  {editData.isEdit && editData.index == index && (
                    <button
                      onClick={() =>
                        setEditData({ isEdit: false, index: null })
                      }
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </>
          );
        })}
      <div className="container">
        <div className="box red"></div>
      </div>
    </div>
  );
};

export default ToDo;
