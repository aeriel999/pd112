import { Routes, Route } from "react-router-dom";
import '/node_modules/antd/dist/reset.css';
import DefaultLayout from "./container/_Layout.tsx"
import GetCategories from "./categories/getAll";
import AddCategory from "./categories/create";
import EditCategory from "./categories/update";
import Register from "./auth/registre";
import Login from "./auth/login";

function App() {
  //const [count, setCount] = useState(0)
  return (
      <>
          <Routes>
              <Route path="/" element={<DefaultLayout />}>
                  <Route index element={<GetCategories />} />
                  <Route path="/home" element={<GetCategories/>}/>
                  <Route path="/categories/add" element={<AddCategory/>}/>
                  <Route path="/categories/edit/:categoryId" element={<EditCategory/>}/>
                  <Route path={"/register"} element={<Register/>} />
                  <Route path={"/login"} element={<Login/>} />

              </Route>
          </Routes>
      </>
  )
}

export default App



