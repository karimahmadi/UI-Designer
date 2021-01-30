import React,{useState} from 'react';

const LoadingIcon= () => <svg  version="1.0" width="16px" height="16px" viewBox="0 0 128 128" ><g><circle cx="16" cy="64" r="16" fill="#000000" fill-opacity="1"/><circle cx="16" cy="64" r="16" fill="#555555" fill-opacity="0.67" transform="rotate(45,64,64)"/><circle cx="16" cy="64" r="16" fill="#949494" fill-opacity="0.42" transform="rotate(90,64,64)"/><circle cx="16" cy="64" r="16" fill="#cccccc" fill-opacity="0.2" transform="rotate(135,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(180,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(225,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(270,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(315,64,64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg>;
const TreeNodeIcon= ({collaped,onClick}) => <span onClick={onClick} style={{cursor:'pointer'}}>{collaped?'+':'-'}</span>;

const TreeNode= ({title}) => {

    const [data,setData]=useState([]);
    const [show,setShow]=useState(false);
    const [loaded,setLoaded]=useState(false);

    const handleTreeNodeClick = () => {
        setShow(!show);
        if(data&& data.length===0){
            setTimeout(()=>{
                setLoaded(true);
                if(title.length<10)
                    setData([{title:title+'1'},{title:title+'2'}]);                
            },2000);
            
        }
    };
    return (
        <div style={{}}>            
            <div ><TreeNodeIcon collaped={!show} onClick={handleTreeNodeClick}/>{title}</div>
            {show && <div style={{margin:'0 10px 0 0'}}>
                {loaded && data.map(item =><TreeNode title={item.title} />)} 
                {!loaded && <LoadingIcon/>}
            </div>} 
        </div>
    );
};

export default TreeNode;