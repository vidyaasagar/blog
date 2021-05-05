import asyncHandler from 'express-async-handler'
import Article from '../models/articleModel.js'

// @desc    Fetch all articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Article.countDocuments({ ...keyword })
  const articles = await Article.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ articles, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)

  if (article) {
    res.json(article)
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

// @desc    Delete a article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)

  if (article) {
    await article.remove()
    res.json({ message: 'Article removed' })
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

// @desc    Create a article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = asyncHandler(async (req, res) => {
  const article = new Article({
    title: 'Sample name',
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    numReviews: 0,
    body: 'Sample description',
    status: 'public'
  })

  const createdArticle = await article.save()
  res.status(201).json(createdArticle)
})

// @desc    Update a article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = asyncHandler(async (req, res) => {
  const {
    title,
    body,
    image,
    brand,
    category,
    status,
  } = req.body

  const article = await Article.findById(req.params.id)

  if (article) {
    article.title = title
    article.body = body
    article.image = image
    article.brand = brand
    article.category = category
    article.status = status

    const updatedArticle = await article.save()
    res.json(updatedArticle)
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

// @desc    Create new review
// @route   POST /api/articles/:id/reviews
// @access  Private
const createArticleReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const article = await Article.findById(req.params.id)

  if (article) {
    const alreadyReviewed = article.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Article already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    article.reviews.push(review)

    article.numReviews = article.reviews.length

    article.rating =
      article.reviews.reduce((acc, item) => item.rating + acc, 0) /
      article.reviews.length

    await article.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

// @desc    Get top rated articles
// @route   GET /api/articles/top
// @access  Public
const getTopArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({}).sort({ rating: -1 }).limit(3)

  res.json(articles)
})

export {
  getArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle,
  createArticleReview,
  getTopArticles,
}
