import React, { useEffect, useRef, useState } from "react";
import "./ToDo.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getLocalData, setLocalData } from "./util";

const ToDo = () => {
  const refElement = useRef();
  const inputValue = useRef();
  const [text, setText] = useState("");
  const [taskButton, setTaskButton] = useState(true);
  const [taskData, setTaskData] = useState(() => {
    const a = getLocalData("taskData");
    if (a) {
      return JSON.parse(a);
    }
    return [];
  });
  const [editData, setEditData] = useState({
    isEdit: false,
    index: null,
  });

  const [filterData, setFilterData] = useState(() => {
    const a = getLocalData("taskData");
    if (a) {
      return JSON.parse(a);
    }
    return [];
  });
  console.log("text", text);

  //Function for Adding a new Task
  function addTask() {
    const updatedTaskData = [...taskData, { todo: text, completed: false }];
    setTaskData(updatedTaskData);
    setLocalData("taskData", JSON.stringify(updatedTaskData));
    setText("");
    refElement.current.focus();
    setTaskButton(true);
  }

  //Function to Remove Task
  function removeTask(index) {
    console.log("task removed", index);
    const updatedListData = taskData.filter((ele, id) => {
      return index != id;
    });
    setTaskData(updatedListData);
    setLocalData("taskData", JSON.stringify(updatedListData));
  }

  // Function to Edit Task
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
        setLocalData("taskData", JSON.stringify(tempData));
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

  function completeTask(id) {
    console.log("idghy", id);
    let updateData = [...taskData];
    updateData[id].completed = true;
    setTaskData(updateData);
  }

  //Function to filter tasks
  function handleRadioChange(data) {
    console.log("dataradio", data.target.value);
    if (data.target.value == "completedTasks") {
      setFilterData(
        taskData.filter((ele, ind) => {
          return ele.completed == true;
        })
      );
    } else if (data.target.value == "activeTasks") {
      setFilterData(
        taskData.filter((ele, ind) => {
          return ele.completed == false;
        })
      );
    } else {
      setFilterData([...taskData]);
    }
  }

  useEffect(() => {
    setFilterData([...taskData]);
  }, [taskData]);
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
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="allTasks"
        name="radio-buttons-group"
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value="allTasks"
          control={<Radio />}
          label="All Tasks"
        />
        <FormControlLabel
          value="activeTasks"
          control={<Radio />}
          label="Active Tasks"
        />
        <FormControlLabel
          value="completedTasks"
          control={<Radio />}
          label="Completed Tasks"
        />
      </RadioGroup>

      {filterData.length > 0 &&
        filterData.map((ele, index) => {
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
                    {/* Remove */}
                    <DeleteIcon />
                  </button>
                  <button onClick={() => editTask(index)}>
                    {editData.isEdit && editData.index == index
                      ? "Update"
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
                  <button onClick={() => completeTask(index)}>
                    {ele.completed ? "Done" : "Mark as done"}
                  </button>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default ToDo;
