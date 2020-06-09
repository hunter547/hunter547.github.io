import React, { useState } from 'react'
 
const Typewriter = ({dataText}) => {
  const[i, setI] = useState(0);

  function typeText() {
      setI(i + 1);
  }

  if (dataText.length > i) {
    setTimeout(typeText, 40)
  }
  
  return (
    <div>
      {dataText.substring(0, i)}
    </div>
  );
}
 
export default Typewriter