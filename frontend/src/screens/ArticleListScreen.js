import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listArticles,
  deleteArticle,
  createArticle,
} from '../actions/articleActions'
import { ARTICLE_CREATE_RESET } from '../constants/articleConstants'

const ArticleListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const articleList = useSelector((state) => state.articleList)
  const { loading, error, articles, page, pages } = articleList

  const articleDelete = useSelector((state) => state.articleDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = articleDelete

  const articleCreate = useSelector((state) => state.articleCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    article: createdArticle,
  } = articleCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: ARTICLE_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/article/${createdArticle._id}/edit`)
    } else {
      dispatch(listArticles('', pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdArticle,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteArticle(id))
    }
  }

  const createArticleHandler = () => {
    dispatch(createArticle())
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Articles</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createArticleHandler}>
            <i className='fas fa-plus'></i> Create Article
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th>STATUS</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td>{article._id}</td>
                  <td>{article.title}</td>
                  <td>{article.status}</td>
                  <td>{article.category}</td>
                  <td>{article.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/article/${article._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(article._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ArticleListScreen
