import axios from "axios"

const BASE_URL = "https://api.themoviedb.org/3"
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNWFmYjc3OWM5NjFmMWFjZWY2N2Y1OThmYTBjNjEwNiIsInN1YiI6IjYzMzU1MzY3ZTIxMDIzMDA4MzBjZGJkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWU1FxMZhfSBlSVXyz8VTaPCfF-4KjvZJGyiWbAi5TU'

const headers = {
    Authorization:`bearer ${TMDB_TOKEN}`
}

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers, params
        })
        return data
    } catch (err) {
        console.log(err)
    }
}