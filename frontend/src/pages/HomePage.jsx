import {useSelector} from 'react-redux';
// import {Link} from "react-router-dom";

const HomePage = () => {
  const {userInfo} = useSelector((state) => state.auth);

  return (
    <main className="container mx-auto">
      
    </main>
  )
}

export default HomePage