import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const getAbout = (locale = "en") =>
  API.get(`/about?populate=*&locale=${locale}`);
