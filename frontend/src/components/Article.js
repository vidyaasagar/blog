import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Article = ({ article }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/article/${article._id}`}>
        <Card.Img src={article.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/article/${article._id}`}>
          <Card.Title as='div'>
            <strong>{article.title}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={article.rating}
            text={`${article.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>{article.status}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Article
