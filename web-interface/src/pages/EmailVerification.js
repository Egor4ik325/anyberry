import { useParams } from "react-router-dom";


const EmailVerification = (props) => {
    const { email } = useParams();

    return <>The email verification was sent to {email}.</>
}

export default EmailVerification;