import React, { memo } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    changeValue(selectedValue);

    // Check if the selected value is empty, and if so, reload the page
    if (selectedValue === '') {
      window.location.reload();
    }
  };

  return (
    <select className='form-select text-sm' value={value} onChange={handleChange}>
      <option value=''>Choose</option>
      {options?.map((el) => (
        <option key={el.id} value={el.value}>
          {el.text}
        </option>
      ))}
    </select>
  );
};

export default memo(InputSelect);
