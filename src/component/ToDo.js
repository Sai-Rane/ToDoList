import React, { useEffect, useRef, useState } from "react";
import "./ToDo.css";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
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
    console.log("idCompleteTask", id);
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
    <div className="main">
      <div className="toDo_Text">
        <h1>To Do List</h1>
      </div>
      <div className="main-Two">
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addTask}
          disabled={taskButton}
        >
          Add Task
        </Button>
      </div>

      {/* displaying tasks */}
      <h1>Here are your Tasks</h1>

      <div className="radioArea">
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="allTasks"
          name="radio-buttons-group"
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="allTasks"
            control={<Radio color="default" />}
            label="All Tasks"
          />
          <FormControlLabel
            value="activeTasks"
            control={<Radio color="default" />}
            label="Active Tasks"
          />
          <FormControlLabel
            value="completedTasks"
            control={<Radio color="default" />}
            label="Completed Tasks"
          />
        </RadioGroup>
      </div>

      {filterData.length > 0 &&
        filterData.map((ele, index) => {
          return (
            <>
              <div className="taskArea" key={index}>
                <div className="serialArea">
                  {editData.isEdit && editData.index == index ? (
                    <div>
                      <input
                        className="textTaskk"
                        defaultValue={ele.todo}
                        onChange={handleEdit}
                      />
                    </div>
                  ) : (
                    <div className="taskSerial">
                      <div>{index + 1}</div>
                      <div>{ele.todo}</div>
                    </div>
                  )}
                </div>

                <div>
                  <Chip
                    icon={<DeleteIcon />}
                    label="Delete Task"
                    onClick={() => removeTask(index)}
                    deleteIcon={<DeleteIcon />}
                  />
                </div>

                <div>
                  <Chip
                    icon={<EditIcon />}
                    onClick={() => editTask(index)}
                    label={
                      editData.isEdit && editData.index == index
                        ? "Update"
                        : "Edit"
                    }
                  />
                  {editData.isEdit && editData.index == index && (
                    <Chip
                      icon={<CloseIcon />}
                      label="Cancel"
                      onClick={() =>
                        setEditData({ isEdit: false, index: null })
                      }
                    />
                  )}
                </div>

                <div>
                  {ele.completed ? (
                    <Chip label="success" color="success" />
                  ) : (
                    <Chip
                      label="Mark as Done"
                      onClick={() => completeTask(index)}
                      deleteIcon={<DoneIcon />}
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default ToDo;
