import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Link, useHistory } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    try {
      const config1 = { headers: { "Content-Type": "application/json" } };
      // console.log(formData)
      setLoading(true);
      const data  = await axios.post(
        `${config.endpoint}/auth/register`,
        { username: formData.username,
          password: formData.password
        },
        config1
      );
      setLoading(false)
      // console.log(data);
      // alert("success")
      enqueueSnackbar("Success - registering a new user",{variant: "success"})
      history.push("/login", {from: "register"})
    } catch (error) {
      setLoading(false);
      // console.log(error.response.data.message)
      if(error.response.status === 400){
        enqueueSnackbar(error.response.data.message, {variant: "error"})
      }
      else{
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error"})
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(formData.username.length == 0){
      enqueueSnackbar("Username is a required field", {variant: "warning"})
    }
    else if(formData.username.length < 6){
      enqueueSnackbar("Username must be at least 6 characters", {variant: "warning"})
    }
    else if(formData.password.length == 0){
      enqueueSnackbar("Password is a required field", {variant: "warning"})
    }
    else if(formData.password.length < 6){
      enqueueSnackbar("Password must be at least 6 characters", {variant: "warning"})
    }
    else if(formData.password !== formData.confirmPassword){
      enqueueSnackbar("Password do not match", {variant: "warning"})
    }
    else{
      register(formData)
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons/>
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(e)=>{setFormData({...formData, username:e.target.value})}}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={(e)=>{setFormData({...formData, password:e.target.value})}}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e)=>{setFormData({...formData, confirmPassword:e.target.value})}}
          />
          {loading ? <div className="progress"><CircularProgress/></div> : <Button className="button" variant="contained" onClick={validateInput}>
            Register Now
           </Button>}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
