interface props{
    children: React.ReactNode
}

const Layout = ({children}: props) => {
    return(
        <div className="h-screen bg-black">
            {children}
        </div>
    )
}

export default Layout