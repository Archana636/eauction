import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      const options = {
        httpOnly: true,
        signed: true,
      };
      const cookies = new Cookies();
      cookies.set('eauction', res.data.token, { path: '/' });
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>{
      console.log(err)
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
    );
};

export const createAuction = (auctionData, history) => dispatch => {
  axios
    .post("/api/users/auction", auctionData)
    .then(res => history.push("/listauction"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteAuction = (auctionData, history) => dispatch => {
  console.log(auctionData);
  axios
    .delete("/api/users/auction",{data:auctionData})
    .then(res => {
      console.log(res);
      history.push("/dashboard")})
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


export const listAuctions = () => dispatch => {
  axios
    .get("/api/users/auctions")
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = (userData, history) => dispatch => {
  console.log(userData);
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  const cookies = new Cookies();
  cookies.set('eauction', null, { path: '/' });
  axios
    .post("/api/users/logout", userData)
    .then(res => {
      //history.push("/")
    })
    .catch(err =>{
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }

    );
};
