import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { useCookies } from 'react-cookie';
import Example from './Example';
import DragAndDrop from './DragAndDrop';
import Example2 from './Example2';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home1 = () => {
  const [isChecked, setIsChecked] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [cookies, setCookie] = useCookies(['list']);

  useEffect(() => {
    const storedList = cookies.list;
    if (storedList) {
      setList(storedList);
    } else {
      setList([
        { check: true, message: 'add your task' },
      ]);
    }
  }, []);

  useEffect(() => {
    setCookie('list', list);
  }, [list, setCookie]);

  useEffect(() => {
    const initialCheckedValues = list.map((item) => item.check);
    setIsChecked(initialCheckedValues);
  }, [list]);

  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxChange = (index) => {
    setIsChecked((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked[index] = !updatedChecked[index];
      return updatedChecked;
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // console.log('Mouse entered');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (inputValue.trim() !== '') {
        const newItem = { check: true, message: inputValue.trim() };
        setList((prevList) => [...prevList, newItem]);
        setInputValue('');
      }
    }
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredList = list.filter((item, index) => {
    if (filter === 'active') {
      return isChecked[index];
    } else if (filter === 'completed') {
      return !isChecked[index];
    }
    return true;
  });

  const handleClearCompleted = () => {
    setList((prevList) => prevList.filter((item, index) => isChecked[index]));
    setIsChecked((prevChecked) =>
      prevChecked.filter((_, index) => isChecked[index])
    );
  };

  const activeItemCount = isChecked.filter((value) => value).length;

  const handleRemoveItem = (index) => {
    setList((prevList) => prevList.filter((_, itemIndex) => itemIndex !== index));
    setIsChecked((prevChecked) =>
      prevChecked.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // A function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // Some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `${grid * 2}px`,
  margin: `0 0 ${grid}px 0`,

  // Change background color if dragging
  background: isDragging ? "lightgreen" : "purple",

  // Styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: `${grid}px`,

});

const [items, setItems] = useState(list.length);

useEffect(() => {
  // Check if the window object is available
  if (typeof window !== "undefined") {
    // Perform any window-dependent operations here
    // This code will only run in a browser environment
    // You can initialize or perform any necessary actions that require the window object
  }
}, []);

const onDragEnd = (result) => {
  // Dropped outside the list
  if (!result.destination) {
    return;
  }

  const updatedItems = reorder(
    items,
    result.source.index,
    result.destination.index
  );

  setItems(updatedItems);
};
  return (
    typeof window !== "undefined" && (
    <>
      <div className='h-[100vh] bg-red-600 w-full flex flex-col justify-between items-center'>
        <div className='h-[20%] flex flex-col justify-end items-center w-full'>
          <input
            placeholder='Currently typing'
            className='w-[40%] h-[30%] placeholder:text-black placeholder:uppercase uppercase tracking-[1px]'
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
        </div>

        <div className='h-[60%] mt-4 flex justify-center items-start w-full'>
          <div className='bg-white md:w-[40%] w-[60%]'>
            <div className='h-[10vh]'>
              {filteredList.length === 0 && <div>Nothing to show</div>}
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className='w-full bg-black'
            >

            {filteredList.map((item, index) => {
               const draggableId = `item-${index}`;
              return(
              <Draggable
                // key={index}
                key={draggableId} draggableId={draggableId} index={index}
                className='flex flex-row justify-between items-center border-t border-black w-full'

              >
                {(provided, snapshot) => (
                <div
                className='w-full flex flex-row justify-between'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave} 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}>
                <label>
                  <div
                    className='circle-icon'
                    onClick={() => handleCheckboxChange(index)}
                  >
                    {isChecked[index] ? (
                      <FaCheckCircle style={{ color: 'blue' }} />
                    ) : (
                      <FaRegCircle />
                    )}
                  </div>
                </label>
                {item.message}
                {isHovered ? (
                  <ImCancelCircle
                    style={{ color: 'red' }}
                    className='cursor-pointer'
                    onClick={() => handleRemoveItem(index)}
                  />
                ) : (
                  <div className='text-white'>..... </div>
                )}
                </div>)}
              </Draggable>
              )
              })}
            {provided.placeholder}
            </div>
          )}
            </Droppable>
            </DragDropContext>

            <div className='h-[5vh] flex flex-row justify-between items-center border-t border-black'>
              <div className='focus:text-purple-700 hover:text-purple-700 cursor-pointer'>
                {activeItemCount} item(s) left
              </div>
              <div className='flex'>
                <div
                  className={`mx-1 focus:text-purple-700 hover:text-purple-700 cursor-pointer ${
                    filter === 'all' && 'text-purple-700'
                  }`}
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </div>
                <div
                  className={`mx-1 focus:text-purple-700 hover:text-purple-700 cursor-pointer ${
                    filter === 'active' && 'text-purple-700'
                  }`}
                  onClick={() => handleFilterChange('active')}
                >
                  Active
                </div>
                <div
                  className={`mx-1 focus:text-purple-700 hover:text-purple-700 cursor-pointer ${
                    filter === 'completed' && 'text-purple-700'
                  }`}
                  onClick={() => handleFilterChange('completed')}
                >
                  Completed
                </div>
              </div>
              <div
                className='focus:text-purple-700 hover:text-purple-700 cursor-pointer'
                onClick={handleClearCompleted}
              >
                Clear Completed
              </div>
            </div>
          </div>
        </div>

        <div className='h-[20%]'></div>
      </div>
      {/* <Example/> */}
      <DragAndDrop/>
      {/* <Example2/> */}
    </>
    )
  );
};

export default Home1;
