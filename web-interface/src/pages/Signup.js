import { useState } from "react";
import {
    Container, Row, Col,
    Form, FormGroup, Label, Input,
    Button, Alert, FormFeedback
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { register } from "../api/Auth";
import { APIError } from "../api/exceptions";

const Signup = () => {
    // React states and hooks
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null); // state for generic error object
    const [emailSent, setEmailSent] = useState(false);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await register({
                username: username,
                email: email,
                password: password,
            });

            // If register was successful redirect to email verification page
            setEmailSent(true);
        }
        catch (error) {
            // If error is in any way related to the API display it to the user
            if (error instanceof APIError) {
                setError(error);
                return;
            }

            // If something went wrong reraise error up
            throw error;
        }
    }

    // Render non field error messages or nothing
    const Errors = ({ error }) => {
        if (!error) {
            return null;
        }

        if (error.name === "RegistrationBadRequestError") {
            if (error.nonFieldErrors) {
                return error.nonFieldErrors.map((e, i) => <Alert color="danger" key={i}>{e}</Alert>);
            }
        }

        if (error.name === "DetailError") {
            return <Alert color="danger">{error.detail}</Alert>;
        }

        // No messages to display
        return null;
    }

    if (emailSent) {
        return <Redirect to={`/email/verify/${email}`} />;
    }

    const isFormError = error && error.name === "RegistrationBadRequestError";

    // Bootstrap/HTML
    return (
        <Container fluid="sm">
            <Row className="my-5">
                <Col xs={{ size: 10, offset: 1 }} sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} xl={{ size: 4, offset: 4 }}>
                    <h2 className="mb-4">Register an Account</h2>
                    {
                        // Render error messages
                        <Errors error={error} />
                    }
                    <Form className="mb-3" onSubmit={handleFormSubmit}>
                        <FormGroup className="mb-3">
                            <Label for="username" className="mb-1">Username</Label>
                            <Input type="text" name="username" id="username" placeholder="Nezort11" required onChange={handleUsernameChange}
                                valid={isFormError && !error.username}
                                invalid={isFormError && !!error.username}
                            />
                            <FormFeedback> { isFormError && error.username && error.username.join(" ") } </FormFeedback>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label for="email" className="mb-1">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="egorzorin@gmail.com" required onChange={handleEmailChange}
                                valid={isFormError && !error.email}
                                invalid={isFormError && error.email}
                            />
                            <FormFeedback> { isFormError && error.email && error.email.join(" ") } </FormFeedback>
                        </FormGroup>
                        <FormGroup className="mb-4">
                            <Label for="password" className="mb-1">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="* * * * * * * *" required onChange={handlePasswordChange}
                                valid={isFormError && !error.password}
                                invalid={isFormError && error.password}
                            />
                            <FormFeedback> { isFormError && error.password && error.password.join(" ") } </FormFeedback>
                        </FormGroup>
                        <Button color="danger" block={true} className="w-100 rounded-0">Sign Up</Button>
                    </Form>
                    <div className="text-center text-muted small">Already a user? <Link to="/login" className="link-dark text-decoration-none">Log In</Link></div>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;