import React, { Component } from "react";
import Navigation from "../components/Navigation";
import "./signupLogin.css";
import { connect } from "react-redux";
import { loginAction } from "../actions/loginAction";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      name: null,
      password: null,
      errorMessage: null,
      signupError: null,
    };
  }

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        console.log(this.state);
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.name !== null && this.state.password !== null) {
      console.log("valid entries");
      this.submitToServer();
    } else {
      this.setState({
        signupError: (
          <div style={{ color: "red", marginBottom: "15px" }}>
            *Filled out the form to log in.
            <br />{" "}
          </div>
        ),
      });
    }
  };

  // using function inside a class function instead of using useEffect inside functional component
  submitToServer = () => {
    /**
     * Returns the history object from the Redux store. 
     */
    const { history } = this.props; 

    return fetch("http://localhost:3000/login", {
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data looks good")

        console.log(data)
        if (data.user.name === this.state.name) {
          this.props.auth(this.state.name, data.user.user_type);
          localStorage.setItem("token", data.jwt); //Login successful, dispatch redux action to update redux store with user data.
          localStorage.setItem("user", this.state.name);
          localStorage.setItem("userType", data.user.user_type);
          console.log(this.props.loginReducer);
          history.push("/");
        }
      })
      .catch((error) => {
        this.setState({
          signupError: (
            <div style={{ color: "red" }}>Try agains</div>
          ),
        });
        console.error("Error:", error);
      });
  };

  render() {
    return (
      <div className="signupLoginBody">
        <Navigation />
        <div className="signupLogin">
          {/* <h1>Sign In</h1> */}
          <br/>
          <div className="signupLoginForm">
            <h2>Sign In</h2>
            <p>Use your Username and Password from YUC to log in.</p>
            <form>
              <input
                type="text"
                placeholder="Username"
                className="textInput"
                onChange={this.handleChange}
                name="name"
              />
              <br />

              <input
                type="password"
                placeholder="Password"
                className="textInput"
                onChange={this.handleChange}
                name="password"
              />
              <br />

              <div className="centerSubmitButton">
                <input
                  type="submit"
                  value="Sign in"
                  className="submitButton"
                  onClick={this.handleSubmit}
                />
              </div>
            </form>

            <div>
              <br></br>
              Don't have an account yet?{" "}<Link to="/signup">Sign up</Link>
            </div>

          </div>


        </div>
      </div>
    );
  }
}

const MSP = (globalState) => {
  console.log("FROM CONNECT", globalState);
  return globalState;
};

const MDP = (dispatch) => {
  return {
    auth: (name, usertype) => dispatch(loginAction(name, usertype)),
  };
};

export default connect(MSP, MDP)(Login);
