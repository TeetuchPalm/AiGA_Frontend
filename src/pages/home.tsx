import { ReactElement } from "react";
function Home(): ReactElement {
    const handleLogout = async (e: React.ChangeEvent<any>) => {
        e.preventDefault()
        localStorage.clear()
        window.location.href = "/login"
    }

    
    return(
    <>
        <h1>welcome to aiga</h1>
        <button onClick={handleLogout}>Logout</button>
        <tr>
            <th>
            </th>
        </tr>
    </>
    )
}

export default Home