import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopArticles } from '../actions/articleActions'

const ArticleCarousel = () => {
  const dispatch = useDispatch()

  const articleTopRated = useSelector((state) => state.articleTopRated)
  const { loading, error, articles } = articleTopRated

  useEffect(() => {
    dispatch(listTopArticles())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {articles.map((article) => (
        <Carousel.Item key={article._id}>
          <Link to={`/article/${article._id}`}>
            <Image src={article.image} alt={article.title} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {article.title} ({1? '2021' : '2020'})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ArticleCarousel
