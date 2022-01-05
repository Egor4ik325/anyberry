import { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { Container, Button, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheck  } from "@fortawesome/free-solid-svg-icons";

import Mailbox from "../assets/img/illustrations/mailbox.svg";
import { resendEmail } from "../api/Auth";

const EmailVerification = (props) => {
    const { email } = useParams();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [sentFirstTime, setSentFirstTime] = useState(false);
    const [goHome, setGoHome] = useState(false);

    const handleResend = async (e) => {
        setSending(true);

        await resendEmail({ email });

        setSending(false);
        setSent(true);
        setSentFirstTime(true);

        setTimeout(() => {
            setSent(false);
        }, 3000);
    }

    const renderResendButton = () => {
        if (sending) {
            return <><Spinner size="sm" /> Email Sent</>;
        }

        if (sent) {
            return <><FontAwesomeIcon icon={faCheck} className="me-1" />Email Sent</>;
        }

        if (sentFirstTime) {
            return <><FontAwesomeIcon icon={faPaperPlane} className="me-1" />Resend Again</>;
        }

        return <><FontAwesomeIcon icon={faPaperPlane} className="me-1" />Resend Email</>;
    }

    const handleBackToHome = () => {
        setGoHome(true);
    }

    if (goHome) {
        return <Redirect to="/" />;
    }

    return (
        <Container className="text-center">
            <h2 className="my-3">Verify your email</h2>
            <p>You will need to verify your email to complete registration.</p>
            <img src={Mailbox} alt="Mailbox" draggable={false} className="img-fluid my-5" width={300} />
            <p className="text-muted small mb-4">An email has been sent to to {email} with a link to verify your account</p>
            <div className="d-flex justify-content-center mb-4">
                <Button color="danger" size="lg" className="rounded-4 px-5 me-2" onClick={handleBackToHome}>
                     <span className="small">Back to Home</span>
                </Button>

                <Button color="danger" size="lg" outline className="border-3 px-5 ms-5" style={{ "borderRadius": 12 }} onClick={handleResend}>
                    <span className="small">
                        {renderResendButton()}
                    </span>
                </Button>
            </div>
        </Container>
    );
}

export default EmailVerification;