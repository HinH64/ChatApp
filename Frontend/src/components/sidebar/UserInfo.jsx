const UserInfo = ({userData, isOnline}) => {
    
  return (
    <>
        <div className={`avatar ${isOnline ? "online" : ""}`}>
            <div className='w-12 rounded-full'>
                <img
                    src={userData.profilePic}
                    alt='user avatar'
                />
			</div>
        </div> 
        <div className='flex flex-col flex-1'>
            <div className='flex gap-3 justify-between'>
                <p className='font-bold text-gray-200'>{userData.fullName}</p>
                
            </div>
        </div> 
    </>
      
  )
}

export default UserInfo