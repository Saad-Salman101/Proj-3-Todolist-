import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { useCookies } from 'react-cookie';

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
        { check: true, message: 'eat chocolate' },
        { check: true, message: 'eat banana' },
        { check: false, message: 'eat egg' },
        { check: true, message: 'eat chips' },
        { check: false, message: 'eat pasta' },
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

  return (
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
          <div className='bg-white w-[40%]'>
            <div className='h-[10vh]'>
              {filteredList.length === 0 && <div>Nothing to show</div>}
            </div>

            {filteredList.map((item, index) => (
              <div
                key={index}
                className='flex flex-row justify-between items-center border-t border-black'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
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
              </div>
            ))}

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
    </>
  );
};

export default Home1;