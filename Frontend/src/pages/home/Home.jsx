import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'

const Home = () => {
  return (
    <div className='flex h-full w-full overflow-hidden bg-clip-padding backdrop-filter'>
      <Sidebar />
      <div className='lg:w-3/4 w-full'>
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home