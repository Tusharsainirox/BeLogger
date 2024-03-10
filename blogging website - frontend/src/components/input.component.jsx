import React, { useState } from 'react'

const InputBox = ({name, type, id, value, placeholder, icon}) => {
 
    const [ ShowPassWord, SetShowPassWord] = useState(false)
 
    return (
    <div className='relative w-[100%] mb-4'>
    <input className='input-box'
        name={name}
        type={(type == 'password'? ShowPassWord? "text" : "password":type)}
        placeholder={placeholder}
        id={id}
        defaultValue={value}

    />
    <i className={"fi "+ icon+ " input-icon "}></i>

    {
        type == 'password'? <i className={"fi fi-rr-eye"+(ShowPassWord?"-crossed":'')+" input-icon left-auto right-4 cursor-pointer"} onClick={()=>{
            SetShowPassWord(currentval=>!currentval)
        }}></i>:"" 
    }
    </div>
  )
}

export default InputBox