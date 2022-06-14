import { Routes, Route, Link } from "react-router-dom";



const AppNativation = () => {
return(
<Routes>
<Route path="/src" element="<App/>" ></Route>
<Route path="/src" element="<HomePage/>"></Route>
</Routes>
);
}