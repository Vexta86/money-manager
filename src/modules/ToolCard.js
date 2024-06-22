import '../financial-tools/tools.css'
import {useNavigate} from "react-router-dom";
const ToolCard = ({name: name, description: description, link: link, auth: auth})=>{
    const navigate = useNavigate()
    return(
        <div className={'tool-card'} onClick={()=>{
            if (link.includes('http')) {
                window.open(link, '_blank');
            }
             else {
                navigate(link, { state: { auth: auth} })
             }

        }}>
            <h1>{name}</h1>

            <p>{description}</p>
        </div>
    )
}
export default ToolCard;