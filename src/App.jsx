import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getApiConfiguration, getGenres } from './store/homeSlice'
import { fetchDataFromApi } from './utils/api'

import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import Details from './pages/details/Details'
import Search from './pages/search/Search'
import Explore from './pages/explore/Explore'
import PageNotFound from './pages/404/PageNotfound'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()

  const fetchApiConfig = useCallback(() => {
    fetchDataFromApi("/configuration").then((res) => {

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url))
    })
  }, [dispatch])

  const genresCall = useCallback(async () => {
    let promises = []
    let endPoints = ["tv", "movie"]
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)

    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item))
    })
    dispatch(getGenres(allGenres))
  }, [dispatch])

  useEffect(() => {
    fetchApiConfig()
    genresCall()
  }, [fetchApiConfig, genresCall])

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
