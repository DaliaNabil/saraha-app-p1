import axios from "axios";

export const getCountriesCodeByIp = async (ip) => {
    const result = await axios.get(`https://ipapi.co/${ip}/json/`);
    return result.data
}