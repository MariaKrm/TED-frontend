import decode from "jwt-decode"
import * as Constants from "../Constants/Constants"
import axios from "axios"

class AuthHelper {

  static loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = AuthHelper.getToken() // Getting token from localstorage
    return !!token && !AuthHelper.isTokenExpired(token) // handwaiving here
  }

  static isTokenExpired(token) {
    try {
      const decoded = decode(token)
      if(decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true
      } else return false
    } catch (err) {
      console.log("Expired check failed!")
      return false
    }
  }

  static setToken(idToken) {
    // Saves user token to localStorage
    sessionStorage.setItem("id_token", idToken)
  }

  static getToken() {
    // Retrieves the user token from localStorage
    return sessionStorage.getItem("id_token")
  }

  static logout() {
    // Clear user token and profile data from localStorage
    sessionStorage.removeItem("id_token")
  }

  static getConfirm() {
    // Using jwt-decode npm package to decode the token
    let answer = decode(AuthHelper.getToken())
    console.log("Recieved answer!")
    return answer
  }

  static getAuthHeader() {
    const header = {
      "Authorization": "Bearer " + AuthHelper.getToken()
    }
    return header
  }

}

export function request(method, url, data) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if(AuthHelper.loggedIn()) {
      headers["Authorization"] = "Bearer " + AuthHelper.getToken()
    }

    return axios.request({
      url,
      method,
      baseURL: Constants.BASEURL,
      headers,
      data,
    }).then(res => {
      console.log("\nReceived the following response from "+res.request.responseURL+":", res, "\n");
      return res;
    }).catch(err => {
      err.response ? console.error(err.response.data) : console.error(err)
      throw err;
    });
  }

export default AuthHelper