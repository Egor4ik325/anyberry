import { useState } from "react";
import {
    Container, Row, Col,
    Form, FormGroup, Label, Input,
    Button
} from "reactstrap";

const Signup = () => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    return (
        <Container fluid="sm">
            <Row className="my-5">
                <Col xs={{size: 12}} sm={{size: 8, offset: 2}} md={{size: 6, offset: 3}}>
                    <h3 className="mb-4">Register an Account</h3>
                    <Form>
                        <FormGroup className="mb-3">
                            <Label for="username">Username</Label>
                            <Input type="text" name="username" id="username" placeholder="Nezort11" />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="egorzorin@gmail.com" />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="* * * * * * * *" />
                        </FormGroup>
                        <Button color="danger" block={true} className="w-100 rounded-0">Sign Up</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;