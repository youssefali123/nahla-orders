import { Puff } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div style={{backdropFilter:"blur(3px)",backgroundColor:"#000000a0",width:"100vw", height:"100vh", position:"fixed", top:"0",left:"0", zIndex:"99999999"}} className="flex justify-center items-center h-screen">
            <Puff
                visible={true}
                height="120"
                width="120"
                color= "#0fe45aff"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loader;