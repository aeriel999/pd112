import { Routes, Route } from "react-router-dom";
import '/node_modules/antd/dist/reset.css';
import DefaultLayout from "./container/_Layout.tsx"
import GetCategories from "./categories";
import AddCategory from "./categories/add_category.tsx";


function App() {
  //const [count, setCount] = useState(0)
  return (
      <>
          <Routes>
              <Route path="/" element={<DefaultLayout />}>
                  <Route index element={<GetCategories />} />
                  <Route path="/home" element={<GetCategories/>}/>
                  <Route path="/categories/add" element={<AddCategory/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App



