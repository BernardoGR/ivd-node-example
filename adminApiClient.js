const axios = require("axios");
const NodeCache = require("node-cache");
const dotenv = require("dotenv");

dotenv.config();
const cache = new NodeCache();

const axiosAdminClient = axios.create({
  baseURL: process.env.ADMIN_API_URL,
});

async function getToken() {
  let token = cache.get("token");

  if (token) {
    return token;
  }

  console.log("Fetching new token");
  const m2m_credentials = {
    client_id: process.env.ADMIN_API_M2M_CLIENT_ID,
    client_secret: process.env.ADMIN_API_M2M_CLIENT_SECRET,
  };
  const response = await axiosAdminClient.post(
    "/m2m/authenticate",
    m2m_credentials
  );
  token = response.data.token;
  cache.set("token", token);

  return token;
}

function getHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function getUserById(id) {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get("v1/users/find_one", {
    headers,
    params: {
      ivd_id: id,
    },
  });
  return response.data;
}

async function getUserGroups(cycle_id, user_ivd_id) {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get(
    "v1/school_cycles/user_groups_index",
    {
      headers,
      params: {
        id: cycle_id,
        user_ivd_id,
      },
    }
  );
  return response.data;
}

module.exports = { getUserById, getUserGroups };
