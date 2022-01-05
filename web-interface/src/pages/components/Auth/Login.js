import React from "react";
import axios from "axios";
import { Container, Form, FormGroup, Input, Label, Button } from "reactstrap";

import { LOGIN_URL, USER_URL } from "../../../api/constants";

function Login() {
    const [login, setLogin] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    function handleSubmit(e) {
        e.preventDefault();

        let data = {
            password: password
        }

        const reEmail = /\S+@\S+\.\S+/;
        if (reEmail.test(login)) {
            data.email = login;
        } else {
            data.username = login;
        }

        // Login
        axios.post(LOGIN_URL, data, {
            withCredentials: true
        })
            // fetch(API_URL + 'auth/login/', {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //         'content-type': 'application/json'
            //     },
            //     body: JSON.stringify(data),
            // })
            .then(response => {
                console.log(response);

            })
            .catch(err => {
                console.log(err);
            })

        // Log currently logged-in user
        axios.get(USER_URL, {
            // Send and recive all cookies (csrftoken, sessionid)
            withCredentials: true,
        })
            // fetch(API_URL + 'auth/user/', {
            //     credentials: 'include'
            // })
            .then(res2 => {
                console.log('User: ', res2);
            })
            .catch(err => {
                console.log(err);
            })

        // Clear values
        e.target.reset();
        setLogin(null);
        setPassword(null);
    }

    function handleLoginChange(e) {
        setLogin(e.target.value);
    }

    function handlePasswordChnage(e) {
        setPassword(e.target.value);
    }

    return (
        <Container>
            <h1 className="mb-2">Login</h1>
            <Form className="d-grid gap-2 mb-4" onSubmit={handleSubmit}>
                <FormGroup className="form-floating">
                    <Input type="text" name="login" id="login" placeholder="Login" onChange={handleLoginChange} />
                    <Label for="login">Username or email</Label>
                </FormGroup>
                <FormGroup className="form-floating">
                    <Input type="password" name="password" id="password" placeholder="Password" onChange={handlePasswordChnage} />
                    <Label for="password">Password</Label>
                </FormGroup>
                <FormGroup>
                    <Button type="submit" size="lg" color="primary">Submit</Button>
                </FormGroup>
            </Form>
            <Button color="primary">Login with VK</Button>
        </Container>
    );
}

export default Login;