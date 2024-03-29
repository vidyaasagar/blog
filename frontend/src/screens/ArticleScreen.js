import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  listArticleDetails,
  createArticleReview,
} from '../actions/articleActions'
import { ARTICLE_CREATE_REVIEW_RESET } from '../constants/articleConstants'

const ArticleScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const articleDetails = useSelector((state) => state.articleDetails)
  const { loading, error, article } = articleDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const articleReviewCreate = useSelector((state) => state.articleReviewCreate)
  const {
    success: successArticleReview,
    loading: loadingArticleReview,
    error: errorArticleReview,
  } = articleReviewCreate

  useEffect(() => {
    if (successArticleReview) {
      setRating(0)
      setComment('')
    }
    if (!article._id || article._id !== match.params.id) {
      dispatch(listArticleDetails(match.params.id))
      dispatch({ type: ARTICLE_CREATE_REVIEW_RESET })
    }
  }, [dispatch, match, successArticleReview])

  

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createArticleReview(match.params.id, {
        rating,
        comment,
      })
    )
  }

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={article.title} />
          <Row>
            <Col md={6}>
              <Image src={article.image} alt={article.title} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{article.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={article.rating}
                    text={`${article.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Status: {article.status}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {article.body}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tech Specification:</Col>
                      <Col>
                        <strong>Version 3.0</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Released Year:</Col>
                      <Col>
                        {1 ? '2020' : '2021'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {article.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(article.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  {/* <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={article.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item> */}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {article.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {article.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {successArticleReview && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingArticleReview && <Loader />}
                  {errorArticleReview && (
                    <Message variant='danger'>{errorArticleReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingArticleReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review{' '}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ArticleScreen
