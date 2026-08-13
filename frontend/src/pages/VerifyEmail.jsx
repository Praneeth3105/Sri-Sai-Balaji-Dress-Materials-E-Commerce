import React, { useState } from 'react'

const VerifyEmail = () => {
    const { token } = useParams()
    const [status,setStatus]=useState("Verifying.....")
  return (
    <div>VerifyEmail</div>
  )
}

export default VerifyEmail