import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import { fetchDataFromApi } from '../../utils/api'
import './style.scss'

import { useParams } from 'react-router-dom'
import Spinner from '../../components/spinner/Spinner'
import MovieCard from '../../components/movieCard/MovieCard'

const Search = () => {

  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const { query } = useParams()

  const fetchInitialData = useCallback(() => {
    setLoading(true)
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      setData(res)
      setPageNum(prev => prev + 1)
      setLoading(false)
    })
  }, [query, pageNum])

  const fetchNextPageData = () => {
    setLoading(true)
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      if (data.results) {
        setData({
          ...data,
          results: [...data.results, res.results]
        })
      } else {
        setData(res)
      }
    })
  }

  useEffect(() => {
    setPageNum(1)
    fetchInitialData()
  }, [query, fetchInitialData])

  return (
    <>
      <div className="searchResultsPage">
        {loading && (<Spinner initial={true} />)}
        {!loading && (
          <ContentWrapper>
            {data?.results.length > 0 ? (
              <>
                <div className="pageTitle">
                  {`Search ${data?.total_results > 1 ? "results" : "result"} of '${query}'`}
                </div>
                <InfiniteScroll className='content' dataLength={data?.results?.length || []} next={fetchNextPageData} hasMore={pageNum <= data?.total_pages} loader={<Spinner />}>
                  {data?.results?.map((item, ind) => {
                    if (item.mediaType === "person") return <></>;
                    return (
                      <MovieCard key={ind} data={item} fromSearch={true} />
                    )
                  })}
                </InfiniteScroll>
              </>
            ) : (
              <span className="resultNotFound">Sorry, Results Not found</span>
            )}
          </ContentWrapper>
        )}
      </div>
    </>
  )
}

export default Search
