import React, { useState } from 'react';
import '../styles/components/typewriter.scss';
 
const Typewriter = ({dataText}) => {
  const[i, setI] = useState(0);

  function typeText() {
      setI(i + 1);
  }

  if (dataText.length > i) {
    setTimeout(typeText, 40)
  }
  
  return (
    <>
      {dataText.substring(0, i)}
      {dataText.length > i ? 
       <span className="large-cursor"></span>
       :
       null
      }
    </>
  );
}
 
export default Typewriter